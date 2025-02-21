import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import * as pdfjsLib from "pdfjs-dist"

// Configure for Node.js environment
export const runtime = "nodejs"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

async function extractTextFromPDF(pdfData: Uint8Array): Promise<string> {
  console.log("Entering extractTextFromPDF function")
  try {
    // Initialize pdf.js without worker
    const loadingTask = pdfjsLib.getDocument({
      data: pdfData,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    })

    const pdf = await loadingTask.promise
    console.log(`PDF loaded successfully. Number of pages: ${pdf.numPages}`)

    let text = ""
    for (let i = 1; i <= pdf.numPages; i++) {
      console.log(`Processing page ${i}`)
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      text += content.items.map((item: any) => item.str).join(" ") + "\n"
    }
    console.log("PDF text extraction completed")
    return text
  } catch (error) {
    console.error("Error in extractTextFromPDF:", error)
    throw error
  }
}

export async function POST(req: NextRequest) {
  console.log("Received PDF parsing request")
  console.log("OPENAI_API_KEY is set:", !!process.env.OPENAI_API_KEY)

  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is not configured")
      return NextResponse.json({ error: "OpenAI API key is not configured" }, { status: 500 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      console.error("No file uploaded")
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    if (!file.type || !file.type.includes("pdf")) {
      console.error("Invalid file type")
      return NextResponse.json({ error: "Invalid file type. Please upload a PDF." }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      console.error("File size exceeds limit")
      return NextResponse.json({ error: "File size exceeds the 10MB limit." }, { status: 400 })
    }

    console.log("Starting PDF parsing")
    console.log("File size:", file.size)

    let fileBuffer: Uint8Array
    try {
      const arrayBuffer = await file.arrayBuffer()
      fileBuffer = new Uint8Array(arrayBuffer)
      console.log("File buffer created, size:", fileBuffer.byteLength)
    } catch (error) {
      console.error("Error reading file:", error)
      return NextResponse.json({ error: "Failed to read the uploaded file" }, { status: 500 })
    }

    let pdfText
    try {
      pdfText = await extractTextFromPDF(fileBuffer)
      console.log("PDF text extracted successfully. Text length:", pdfText.length)
    } catch (error) {
      console.error("Error extracting text from PDF:", error)
      return NextResponse.json({ error: "Failed to extract text from PDF" }, { status: 500 })
    }

    if (!pdfText || pdfText.trim().length === 0) {
      console.error("No text content found in PDF")
      return NextResponse.json({ error: "No text content found in PDF" }, { status: 400 })
    }

    const summarizedText = pdfText.length > 2000 ? pdfText.slice(0, 2000) + "..." : pdfText

    const prompt = `
      Extract job description information from the following text and format it as JSON.
      Include these fields:
      - title (string): The job title
      - company (string): Company name
      - location (string): Job location
      - overview (string): Brief job overview
      - keyResponsibilities (array): List of key responsibilities
      - qualifications (array): List of required qualifications
      - skills (array): List of required skills
      - additionalSkills (array): List of preferred/additional skills

      Text content:
      ${summarizedText}

      Return ONLY valid JSON matching this structure:
      {
        "title": "string",
        "company": "string",
        "location": "string",
        "overview": "string",
        "keyResponsibilities": ["string"],
        "qualifications": ["string"],
        "skills": ["string"],
        "additionalSkills": ["string"]
      }
    `

    console.log("Sending request to OpenAI")

    let openAIResponse
    try {
      openAIResponse = await generateText({
        model: openai("gpt-3.5-turbo"),
        prompt: prompt,
        temperature: 0.3,
        max_tokens: 1500,
      })
      console.log("Received response from OpenAI. Response length:", openAIResponse.text.length)
    } catch (error) {
      console.error("Error calling OpenAI API:", error)
      return NextResponse.json({ error: "Failed to process PDF with AI" }, { status: 500 })
    }

    let parsedData
    try {
      parsedData = JSON.parse(openAIResponse.text)

      const requiredFields = [
        "title",
        "company",
        "location",
        "overview",
        "keyResponsibilities",
        "qualifications",
        "skills",
        "additionalSkills",
      ]
      const missingFields = requiredFields.filter((field) => !(field in parsedData))

      if (missingFields.length > 0) {
        console.error("Missing required fields in OpenAI response:", missingFields)
        return NextResponse.json({ error: `Missing required fields: ${missingFields.join(", ")}` }, { status: 500 })
      }

      const arrayFields = ["keyResponsibilities", "qualifications", "skills", "additionalSkills"]
      arrayFields.forEach((field) => {
        if (!Array.isArray(parsedData[field])) {
          console.warn(`Field ${field} is not an array. Converting to array.`)
          parsedData[field] = [parsedData[field]].filter(Boolean)
        }
      })

      console.log("Successfully parsed and validated OpenAI response")
      return NextResponse.json(parsedData)
    } catch (error) {
      console.error("Error parsing AI response:", error)
      console.error("Raw AI response:", openAIResponse.text)
      return NextResponse.json({ error: "Failed to parse AI response", details: openAIResponse.text }, { status: 500 })
    }
  } catch (error) {
    console.error("Unexpected error in API route:", error)
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}


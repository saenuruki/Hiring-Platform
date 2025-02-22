import { NextResponse, type NextRequest } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import pdfParse from "pdf-parse"

console.log("API route file loaded")

const logRequest = (req: NextRequest) => {
  console.log("Request headers:", Object.fromEntries(req.headers.entries()))
  console.log("Request method:", req.method)
  console.log("Request URL:", req.url)
}

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  console.log("POST method called")
  console.log("API route hit: /api/parse-job-pdf")
  console.log("Request received:", new Date().toISOString())
  console.log("Environment variables:", {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? "Set" : "Not set",
    OPENAI_BASE_URL: process.env.OPENAI_BASE_URL ? "Set" : "Not set",
  })

  try {
    console.log("2. Attempting to parse form data")
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      console.log("3. No file uploaded")
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    console.log("4. File received, attempting to read")
    const buffer = await file.arrayBuffer()
    console.log("5. File read successfully, parsing PDF")
    const pdfData = await pdfParse(Buffer.from(buffer))
    console.log("6. PDF parsed successfully")

    const prompt = `
      Extract job description information from the following text and format it as JSON.
      Include these fields:
      - title (string): The job title
      - description (string): A brief job description
      - goals (string): The main goals or objectives of the position
      - skills (array): List of required skills

      Text content:
      ${pdfData.text.slice(0, 3000)}

      Return ONLY valid JSON matching this structure:
      {
        "title": "string",
        "description": "string",
        "goals": "string",
        "skills": ["string"]
      }
    `

    console.log("7. Sending request to OpenAI")
    let result
    try {
      result = await generateText({
        model: openai("gpt-3.5-turbo"),
        prompt: prompt,
        temperature: 0.3,
        max_tokens: 1000,
      })
      console.log("8. Received response from OpenAI")
    } catch (error) {
      console.error("Error calling OpenAI:", error)
      return NextResponse.json({ error: "Failed to process PDF with OpenAI" }, { status: 500 })
    }

    console.log("9. Parsing JSON response")
    let parsedData
    try {
      parsedData = JSON.parse(result.text)
      console.log("10. JSON parsed successfully")
    } catch (error) {
      console.error("Error parsing OpenAI response:", error)
      return NextResponse.json({ error: "Failed to parse OpenAI response", details: result.text }, { status: 500 })
    }

    console.log("11. Sending response")
    return NextResponse.json(parsedData)
  } catch (error) {
    console.error("Error processing PDF:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


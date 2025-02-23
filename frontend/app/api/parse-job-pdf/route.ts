import { NextResponse, type NextRequest } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import pdfParse from "pdf-parse"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const pdfData = await pdfParse(Buffer.from(buffer))

    const prompt = `
      Extract job description information from the following text and format it as JSON.
      Include these fields:
      - title (string): The job title
      - description (string): A brief job description
      - goals (["string"]): List of main goals or objectives of the position
      - skills (["string"]): List of required skills

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

    let result
    try {
      result = await generateText({
        model: openai("gpt-3.5-turbo"),
        prompt: prompt,
        temperature: 0.3,
        max_tokens: 1000,
      })
    } catch (error) {
      console.error("Error calling OpenAI:", error)
      return NextResponse.json({ error: "Failed to process PDF with OpenAI" }, { status: 500 })
    }

    let parsedData
    try {
      parsedData = JSON.parse(result.text)
    } catch (error) {
      console.error("Error parsing OpenAI response:", error)
      return NextResponse.json({ error: "Failed to parse OpenAI response", details: result.text }, { status: 500 })
    }

    return NextResponse.json(parsedData)
  } catch (error) {
    console.error("Error processing PDF:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get("file") as File

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
  }

  try {
    const fileBuffer = await file.arrayBuffer()
    const fileContent = Buffer.from(fileBuffer).toString("base64")

    const prompt = `
      The following is the content of a PDF file containing job description information. Please extract the following items:
      - Title
      - Company Name
      - Location
      - Overview
      - Key Responsibilities
      - Qualifications
      - Skills
      - Additional Skills (Desirable)

      PDF content:
      ${fileContent}

      Please return the extracted information in JSON format, using the exact field names provided above.
    `

    const { text } = await generateText({
      model: openai("gpt-4"),
      prompt: prompt,
    })

    const parsedData = JSON.parse(text)

    return NextResponse.json(parsedData)
  } catch (error) {
    console.error("Error parsing PDF:", error)
    return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 })
  }
}


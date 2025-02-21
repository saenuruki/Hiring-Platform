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
      以下は求人情報が含まれるPDFファイルの内容です。この情報から以下の項目を抽出してください：
      - 職種（title）
      - 会社名（company）
      - 勤務地（location）
      - 職務内容（description）
      - 応募要件（requirements）

      PDFの内容：
      ${fileContent}

      抽出した情報をJSON形式で返してください。
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


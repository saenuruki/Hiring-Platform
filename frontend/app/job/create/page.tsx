"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreateJob() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    requirements: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("PDF解析に失敗しました")
      }

      const data = await response.json()
      setFormData((prev) => ({
        ...prev,
        ...data,
      }))
    } catch (error) {
      console.error("Error:", error)
      alert("PDFの解析中にエラーが発生しました")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // ここで求人データを保存するAPIを呼び出す
    console.log("Submitted:", formData)
    router.push("/")
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">新しい求人を作成</h1>
      <Card>
        <CardHeader>
          <CardTitle>求人情報入力</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">職種</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="company">会社名</Label>
              <Input id="company" name="company" value={formData.company} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="location">勤務地</Label>
              <Input id="location" name="location" value={formData.location} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="description">職務内容</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="requirements">応募要件</Label>
              <Textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="pdf-upload">PDFアップロード（自動補完）</Label>
              <Input id="pdf-upload" type="file" accept=".pdf" onChange={handleFileUpload} disabled={isLoading} />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "処理中..." : "求人を作成"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}


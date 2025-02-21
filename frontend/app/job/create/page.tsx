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
    overview: "",
    keyResponsibilities: "",
    qualifications: "",
    skills: "",
    additionalSkills: "",
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
        throw new Error("Failed to parse PDF")
      }

      const data = await response.json()
      setFormData((prev) => ({
        ...prev,
        ...data,
      }))
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred while parsing the PDF")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend API
    console.log("Submitted:", formData)
    // For now, we'll just redirect to the home page
    router.push("/")
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Job Listing</h1>
      <Card>
        <CardHeader>
          <CardTitle>Job Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="pdf-upload">Upload PDF (Optional)</Label>
              <Input id="pdf-upload" type="file" accept=".pdf" onChange={handleFileUpload} disabled={isLoading} />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="company">Company Name</Label>
              <Input id="company" name="company" value={formData.company} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" value={formData.location} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="overview">Overview</Label>
              <Textarea id="overview" name="overview" value={formData.overview} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="keyResponsibilities">Key Responsibilities</Label>
              <Textarea
                id="keyResponsibilities"
                name="keyResponsibilities"
                value={formData.keyResponsibilities}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="qualifications">Qualifications</Label>
              <Textarea
                id="qualifications"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="skills">Skills</Label>
              <Textarea id="skills" name="skills" value={formData.skills} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="additionalSkills">Additional Skills (Desirable)</Label>
              <Textarea
                id="additionalSkills"
                name="additionalSkills"
                value={formData.additionalSkills}
                onChange={handleInputChange}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : "Create Job Listing"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}


"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import type { Job } from "../../page"

interface FormData {
  title: string
  company: string
  location: string
  overview: string
  keyResponsibilities: string
  qualifications: string
  skills: string
  additionalSkills: string
}

export default function CreateJob() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
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

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file")
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      })

      let data
      try {
        data = await response.json()
      } catch (error) {
        console.error("Error parsing JSON response:", error)
        throw new Error("Invalid response from server")
      }

      if (!response.ok) {
        throw new Error(data.error || data.details || "Failed to parse PDF")
      }

      if (!data || typeof data !== "object") {
        throw new Error("Invalid response data")
      }

      setFormData((prev) => ({
        ...prev,
        title: data.title || prev.title,
        company: data.company || prev.company,
        location: data.location || prev.location,
        overview: data.overview || prev.overview,
        keyResponsibilities: Array.isArray(data.keyResponsibilities)
          ? data.keyResponsibilities.join("\n")
          : prev.keyResponsibilities,
        qualifications: Array.isArray(data.qualifications) ? data.qualifications.join("\n") : prev.qualifications,
        skills: Array.isArray(data.skills) ? data.skills.join("\n") : prev.skills,
        additionalSkills: Array.isArray(data.additionalSkills)
          ? data.additionalSkills.join("\n")
          : prev.additionalSkills,
      }))

      toast.success("PDF parsed successfully")
    } catch (error) {
      console.error("Error parsing PDF:", error)
      toast.error(error instanceof Error ? error.message : "Failed to parse PDF")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const existingJobs = localStorage.getItem("jobs")
      const jobs: Job[] = existingJobs ? JSON.parse(existingJobs) : []

      const newJob: Job = {
        id: Math.max(0, ...jobs.map((job) => job.id)) + 1,
        title: formData.title,
        company: formData.company,
        location: formData.location,
        overview: formData.overview,
        keyResponsibilities: formData.keyResponsibilities.split("\n").filter(Boolean),
        qualifications: formData.qualifications.split("\n").filter(Boolean),
        skills: formData.skills.split("\n").filter(Boolean),
        additionalSkills: formData.additionalSkills.split("\n").filter(Boolean),
      }

      const updatedJobs = [...jobs, newJob]
      localStorage.setItem("jobs", JSON.stringify(updatedJobs))

      toast.success("Job listing created successfully")
      router.push("/")
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Failed to create job listing")
    } finally {
      setIsLoading(false)
    }
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
              <Input
                id="pdf-upload"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileUpload}
                disabled={isLoading}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="overview">Overview</Label>
              <Textarea
                id="overview"
                name="overview"
                value={formData.overview}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="keyResponsibilities">Key Responsibilities (one per line)</Label>
              <Textarea
                id="keyResponsibilities"
                name="keyResponsibilities"
                value={formData.keyResponsibilities}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="qualifications">Qualifications (one per line)</Label>
              <Textarea
                id="qualifications"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="skills">Skills (one per line)</Label>
              <Textarea
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="additionalSkills">Additional Skills (one per line)</Label>
              <Textarea
                id="additionalSkills"
                name="additionalSkills"
                value={formData.additionalSkills}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Job Listing"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}


"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import type { Job } from "../../page";

interface FormData {
  title: string;
  description: string;
  goals: string;
  skills: string;
}

export default function CreateJob() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    goals: "",
    skills: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });

      let data;
      try {
        data = await response.json();
      } catch (error) {
        console.error("Error parsing JSON response:", error);
        throw new Error("Invalid response from server");
      }

      if (!response.ok) {
        throw new Error(data.error || data.details || "Failed to parse PDF");
      }

      if (!data || typeof data !== "object") {
        throw new Error("Invalid response data");
      }

      setFormData((prev) => ({
        ...prev,
        title: data.title || prev.title,
        description: data.description || prev.description,
        goals: Array.isArray(data.goals) ? data.goals.join("\n") : prev.goals,
        skills: Array.isArray(data.skills)
          ? data.skills.join("\n")
          : prev.skills,
      }));

      toast.success("PDF parsed successfully");
    } catch (error) {
      console.error("Error parsing PDF:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to parse PDF"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const existingJobs = localStorage.getItem("jobs");
      const jobs: Job[] = existingJobs ? JSON.parse(existingJobs) : [];

      const newJob: Job = {
        id: Math.max(0, ...jobs.map((job) => job.id)) + 1,
        title: formData.title,
        description: formData.description,
        goals: formData.goals.split("\n").filter(Boolean),
        skills: formData.skills.split("\n").filter(Boolean),
      };

      const updatedJobs = [...jobs, newJob];
      localStorage.setItem("jobs", JSON.stringify(updatedJobs));

      toast.success("Job listing created successfully");
      router.push("/jobs");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to create job listing");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Create New Job</h1>
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
                <Label htmlFor="overview">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="goals">Goals (one per line)</Label>
                <Textarea
                  id="goals"
                  name="goals"
                  value={formData.goals}
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
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-8 py-6 text-lg rounded-full"
              >
                {isLoading ? "Creating..." : "Create Job Listing"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

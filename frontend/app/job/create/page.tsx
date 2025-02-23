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
import { useTaskContext } from "@/components/task-provider";
import { PDFUpload } from "@/components/pdf-upload";

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
  const { createIpfs, createTask } = useTaskContext();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePDFUpload = (data: {
    title: string;
    description: string;
    goals: string;
    skills: string[];
  }) => {
    setFormData((prev) => ({
      ...prev,
      title: data.title || prev.title,
      description: data.description || prev.description,
      goals: data.goals || prev.goals,
      skills: data.skills.join(", ") || prev.skills,
    }));
    toast.success("PDF parsed successfully");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      // upload the data to IPFS
      const hash = await createIpfs(formData);

      // create Smart Contract
      const res2 = await createTask(formData.title, hash);
      console.log(res2);
      toast.success("Task listing created successfully");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to create task listing");
    } finally {
      setIsLoading(false);
      router.push("/jobs");
    }

    // try {
    //   const existingJobs = localStorage.getItem("jobs");
    //   const jobs: Job[] = existingJobs ? JSON.parse(existingJobs) : [];

    //   const newJob: Job = {
    //     id: Math.max(0, ...jobs.map((job) => job.id)) + 1,
    //     title: formData.title,
    //     description: formData.description,
    //     goals: formData.goals.split("\n").filter(Boolean),
    //     skills: formData.skills.split("\n").filter(Boolean),
    //   };

    //   const updatedJobs = [...jobs, newJob];
    //   localStorage.setItem("jobs", JSON.stringify(updatedJobs));

    //   toast.success("Job listing created successfully");
    //   router.push("/");
    // } catch (error) {
    //   console.error("Error submitting form:", error);
    //   toast.error("Failed to create job listing");
    // } finally {
    //   setIsLoading(false);
    // }
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
                <PDFUpload onUpload={handlePDFUpload} />
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

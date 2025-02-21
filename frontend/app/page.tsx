"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export interface Job {
  id: number
  title: string
  company: string
  location: string
  description?: string
  overview?: string
  keyResponsibilities?: string[]
  qualifications?: string[]
  skills?: string[]
  additionalSkills?: string[]
}

const initialJobs: Job[] = [
  {
    id: 1,
    title: "Software Engineer",
    company: "Tech Solutions Inc.",
    location: "New York, NY",
    description: "We are seeking a talented and passionate Software Engineer to develop and maintain high-quality software applications.",
    overview: "As a Software Engineer, you will be responsible for designing, coding, testing, and debugging software applications. You will work closely with other engineers and product managers to deliver innovative solutions to our clients.",
    keyResponsibilities: [
      "Design, develop, and test software applications",
      "Write clean, efficient, and well-documented code",
      "Collaborate with other engineers to review code and share knowledge",
      "Troubleshoot and debug software issues",
      "Participate in the full software development lifecycle"
    ],
    qualifications: [
      "Bachelor's degree in Computer Science or a related field",
      "3+ years of experience in software development",
      "Proficiency in at least one programming language (e.g., Java, Python, JavaScript)"
    ],
    skills: [
      "Programming (e.g., Java, Python, JavaScript)",
      "Software design patterns",
      "Testing and debugging",
      "Version control (e.g., Git)",
      "Agile methodologies"
    ],
    additionalSkills: [
      "Experience with cloud computing platforms (e.g., AWS, Azure, GCP)",
      "Knowledge of database systems (e.g., SQL, NoSQL)",
      "Strong problem-solving and analytical skills"
    ]
  },
  {
    id: 2,
    title: "Product Manager",
    company: "Innovation Inc.",
    location: "San Francisco, CA",
    description: "We are seeking a highly motivated and experienced Product Manager to lead the development and execution of our product roadmap.",
    overview: "As a Product Manager, you will be responsible for defining the product vision, strategy, and roadmap. You will work closely with engineering, design, and marketing teams to bring innovative products to market.",
    keyResponsibilities: [
      "Define and champion the product vision, strategy, and roadmap",
      "Conduct market research and analyze customer needs",
      "Prioritize and manage the product backlog",
      "Collaborate with engineering, design, and marketing teams",
      "Track product performance and identify areas for improvement"
    ],
    qualifications: [
      "Bachelor's degree in a related field",
      "5+ years of product management experience",
      "Proven ability to define and launch successful products"
    ],
    skills: [
      "Product strategy",
      "Market research",
      "Product roadmap planning",
      "Agile methodologies",
      "Communication and collaboration"
    ],
    additionalSkills: [
      "Experience in the technology industry",
      "Strong analytical and problem-solving skills",
      "Passion for building great products"
    ]
  },
  {
    id: 3,
    title: "UX Designer",
    company: "Tech Company",
    location: "Tokyo, Japan",
    description: "We are looking for a talented and passionate UX Designer to create intuitive and engaging user experiences for our digital products.",
    overview: "As a UX Designer, you will be responsible for conducting user research, creating wireframes and prototypes, and designing user interfaces that are both aesthetically pleasing and functional.",
    keyResponsibilities: [
      "Conduct user research and analyze user feedback",
      "Create wireframes, prototypes, and user flows",
      "Design user interfaces for web and mobile applications",
      "Collaborate with product managers and engineers to ensure designs are feasible and meet user needs",
      "Conduct usability testing and iterate on designs based on feedback"
    ],
    qualifications: [
      "Bachelor's degree in Design, Human-Computer Interaction, or a related field",
      "3+ years of experience in UX design",
      "Strong portfolio showcasing user-centered design solutions"
    ],
    skills: [
      "User research",
      "Wireframing and prototyping",
      "User interface design",
      "Interaction design",
      "Usability testing"
    ],
    additionalSkills: [
      "Proficiency in design tools such as Figma, Sketch, or Adobe XD",
      "Excellent communication and collaboration skills",
      "Strong understanding of user-centered design principles"
    ]
  }
]

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>(() => {
    if (typeof window !== "undefined") {
      const savedJobs = localStorage.getItem("jobs")
      return savedJobs ? JSON.parse(savedJobs) : initialJobs
    }
    return initialJobs
  })

  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs))
  }, [jobs])

  useEffect(() => {
    const handleStorageChange = () => {
      const savedJobs = localStorage.getItem("jobs")
      if (savedJobs) {
        setJobs(JSON.parse(savedJobs))
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Job Listings</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{job.company}</p>
              <p className="text-sm text-muted-foreground">{job.location}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/job/${job.id}`}>
                <Button>View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <Link href="/job/create">
          <Button>Create New Job Listing</Button>
        </Link>
      </div>
    </main>
  )
}
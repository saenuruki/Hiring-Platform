"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useTransition, animated } from "react-spring"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Job } from "../../page"


// Function to generate a random applicant (unchanged)
const generateRandomApplicant = () => {
  const names = ["John Doe", "Jane Smith", "Alex Johnson", "Emily Brown", "Chris Lee"]
  const experiences = ["2 years", "3 years", "5 years", "7 years", "10+ years"]
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: names[Math.floor(Math.random() * names.length)],
    experience: experiences[Math.floor(Math.random() * experiences.length)],
  }
}

// アプリケーントの型を定義
interface Applicant {
  id: string
  name: string
  experience: string
}

export default function JobDetail() {
  const params = useParams()
  const [job, setJob] = useState<Job | null>(null)
  const [applicants, setApplicants] = useState<Applicant[]>([
    { id: "1", name: "John Doe", experience: "5 years" },
    { id: "2", name: "Jane Smith", experience: "3 years" },
    { id: "3", name: "Bob Johnson", experience: "7 years" },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setApplicants((currentApplicants: Applicant[]) => {
        const newApplicant = generateRandomApplicant()
        const insertIndex = Math.floor(Math.random() * (currentApplicants.length + 1))
        return [...currentApplicants.slice(0, insertIndex), newApplicant, ...currentApplicants.slice(insertIndex)]
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const jobId = Number.parseInt(params.id as string, 10)
    const savedJobs = localStorage.getItem("jobs")
    if (savedJobs) {
      const jobs: Job[] = JSON.parse(savedJobs)
      const foundJob = jobs.find((j) => j.id === jobId)
      setJob(foundJob || null)
    }
  }, [params.id])

  const transitions = useTransition(applicants, {
    from: { opacity: 0, transform: "scale(0.8)" },
    enter: { opacity: 1, transform: "scale(1)" },
    leave: { opacity: 0, transform: "scale(0.8)" },
    keys: (applicant: Applicant) => applicant.id,
  })

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Job Not Found</h1>
        <p>The job you're looking for doesn't exist or has been removed.</p>
        <Link href="/">
          <Button className="mt-4">Back to Job Listings</Button>
        </Link>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{job.title}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{job.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">{job.company}</p>
          <p className="text-md text-muted-foreground mb-4">{job.location}</p>

          <h2 className="text-xl font-semibold mt-4 mb-2">Overview</h2>
          <p>{job.overview || job.description}</p>

          {job.keyResponsibilities && job.keyResponsibilities.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mt-4 mb-2">Key Responsibilities</h2>
              <ul className="list-disc pl-5">
                {job.keyResponsibilities.map((resp, index) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
            </>
          )}

          {job.qualifications && job.qualifications.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mt-4 mb-2">Qualifications</h2>
              <ul className="list-disc pl-5">
                {job.qualifications.map((qual, index) => (
                  <li key={index}>{qual}</li>
                ))}
              </ul>
            </>
          )}

          {job.skills && job.skills.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mt-4 mb-2">Required Skills</h2>
              <ul className="list-disc pl-5">
                {job.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </>
          )}

          {job.additionalSkills && job.additionalSkills.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mt-4 mb-2">Additional Skills</h2>
              <ul className="list-disc pl-5">
                {job.additionalSkills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Applicants</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {transitions((style, applicant) => (
          <animated.div style={style} key={applicant.id}>
            <Card>
              <CardHeader>
                <CardTitle>{applicant.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Experience: {applicant.experience}</p>
              </CardContent>
            </Card>
          </animated.div>
        ))}
      </div>

      <div className="mt-8">
        <Link href="/">
          <Button>Back to Job Listings</Button>
        </Link>
      </div>
    </main>
  )
}


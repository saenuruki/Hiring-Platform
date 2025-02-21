"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useTransition, animated } from "react-spring"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock job data (unchanged)
const jobs = [
  {
    id: "1",
    title: "Software Engineer",
    company: "Tech Corp",
    location: "Tokyo",
    overview: "We are seeking a talented Software Engineer to join our innovative team...",
    keyResponsibilities: [
      "Develop and maintain high-quality software",
      "Collaborate with cross-functional teams",
      "Participate in code reviews and contribute to best practices",
    ],
    qualifications: [
      "Bachelor's degree in Computer Science or related field",
      "3+ years of software development experience",
      "Strong problem-solving skills",
    ],
    skills: [
      "Proficiency in JavaScript, Python, or Java",
      "Experience with modern web frameworks (e.g., React, Vue, Angular)",
      "Familiarity with cloud platforms (AWS, Azure, or GCP)",
    ],
    additionalSkills: [
      "Experience with microservices architecture",
      "Knowledge of DevOps practices",
      "Contributions to open-source projects",
    ],
  },
  {
    id: "2",
    title: "Product Manager",
    company: "Innovation Inc",
    location: "Osaka",
    overview: "We're looking for a dynamic Product Manager to lead the development of our next-generation products...",
    keyResponsibilities: [
      "Define product vision, strategy, and roadmap",
      "Conduct market research and analyze user feedback",
      "Collaborate with engineering, design, and marketing teams",
      "Prioritize features and manage product backlog",
    ],
    qualifications: [
      "Bachelor's degree in Business, Computer Science, or related field",
      "5+ years of product management experience",
      "Strong analytical and problem-solving skills",
    ],
    skills: [
      "Excellent communication and leadership abilities",
      "Experience with Agile/Scrum methodologies",
      "Proficiency in product management tools (e.g., Jira, Trello)",
    ],
    additionalSkills: [
      "MBA or advanced degree",
      "Technical background or experience in software development",
      "Experience in data analysis and A/B testing",
    ],
  },
  {
    id: "3",
    title: "UX Designer",
    company: "Creative Lab",
    location: "Fukuoka",
    overview: "Join our team as a UX Designer to create intuitive and engaging user experiences for our digital products...",
    keyResponsibilities: [
      "Conduct user research and usability testing",
      "Create wireframes, prototypes, and high-fidelity designs",
      "Collaborate with product managers and developers",
      "Develop and maintain design systems",
    ],
    qualifications: [
      "Bachelor's degree in Design, HCI, or related field",
      "3+ years of UX design experience",
      "Strong portfolio demonstrating UX/UI design skills",
    ],
    skills: [
      "Proficiency in design tools (e.g., Figma, Sketch, Adobe XD)",
      "Knowledge of user-centered design principles",
      "Experience with interaction design and information architecture",
    ],
    additionalSkills: [
      "Familiarity with front-end technologies (HTML, CSS, JavaScript)",
      "Experience with motion design and prototyping",
      "Knowledge of accessibility standards and best practices",
    ],
  },
]

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
  const { id } = useParams()
  const job = jobs.find((j) => j.id === id)
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

  const transitions = useTransition(applicants, {
    from: { opacity: 0, transform: "scale(0.8)" },
    enter: { opacity: 1, transform: "scale(1)" },
    leave: { opacity: 0, transform: "scale(0.8)" },
    keys: (applicant: Applicant) => applicant.id,
  })

  if (!job) {
    return <div>Job not found</div>
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{job.title}</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">
            <strong>Company:</strong> {job.company}
          </p>
          <p className="mb-2">
            <strong>Location:</strong> {job.location}
          </p>
          <p className="mb-4">
            <strong>Overview:</strong> {job.overview}
          </p>
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Key Responsibilities:</h3>
            <ul className="list-disc pl-5">
              {job.keyResponsibilities.map((resp, index) => (
                <li key={index}>{resp}</li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Qualifications:</h3>
            <ul className="list-disc pl-5">
              {job.qualifications.map((qual, index) => (
                <li key={index}>{qual}</li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Skills:</h3>
            <ul className="list-disc pl-5">
              {job.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Additional Skills (Desirable):</h3>
            <ul className="list-disc pl-5">
              {job.additionalSkills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
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


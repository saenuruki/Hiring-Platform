import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/navbar"

// More comprehensive job data
const jobs = [
  {
    id: 1,
    title: "Software Engineer",
    company: "Tech Corp",
    location: "Tokyo",
    description: "We are looking for a passionate software engineer to develop innovative technical solutions...",
    requirements: [
      "Bachelor's degree in Computer Science or related field",
      "3+ years of software development experience",
      "Proficiency in JavaScript, Python, or Java",
    ],
  },
  {
    id: 2,
    title: "Product Manager",
    company: "Innovation Inc",
    location: "Osaka",
    description: "We're seeking a product manager to lead the development of our next-generation products...",
    requirements: [
      "5+ years of product management experience",
      "Strong analytical and problem-solving skills",
      "Excellent communication and leadership abilities",
    ],
  },
  {
    id: 3,
    title: "UX Designer",
    company: "Creative Lab",
    location: "Fukuoka",
    description: "Join our team as a UX designer to create intuitive and engaging user experiences...",
    requirements: [
      "Degree in Design, HCI, or related field",
      "Portfolio demonstrating strong UX/UI design skills",
      "Experience with design tools like Figma or Sketch",
    ],
  },
]

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Navbar />
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


"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

export interface Applicant {
  id: number
  name: string
  rating: number
  price: number
  description: string
}

export default function ApplicantDetail() {
    const params = useParams()
    const searchParams = useSearchParams()
    const [applicant, setApplicant] = useState<Applicant | null>(null)
  
    useEffect(() => {
      const applicantData = searchParams.get("data")
      if (applicantData) {
        try {
          const parsedApplicant = JSON.parse(decodeURIComponent(applicantData)) as Applicant
          setApplicant(parsedApplicant)
        } catch (error) {
          console.error("Error parsing applicant data:", error)
        }
      }
    }, [searchParams])
  
    if (!applicant) {
      return (
        <div className="min-h-screen bg-white">
          <main className="container mx-auto px-4 pt-24 pb-16">
            <h1 className="text-3xl font-bold mb-6">Applicant Not Found</h1>
            <p>The applicant you're looking for doesn't exist or has been removed.</p>
          </main>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-white">
        <main className="container mx-auto px-4 pt-24 pb-16">
          <div className="lg:grid lg:grid-cols-[1fr,300px] lg:gap-8">
            {/* Main Content */}
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <Image src="/placeholder.svg" alt={applicant.name} fill className="rounded-full object-cover" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{applicant.name}</h1>
                  <div className="flex items-center">
                    {Array.from({ length: applicant.rating }).map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
  
              {/* Banner Image */}
              <div className="relative w-full h-48">
                <Image
                  src="/placeholder.svg"
                  alt="Web Scraping Services Banner"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
  
              {/* Description */}
              <div className="space-y-4">
                <p className="text-gray-700">{applicant.description}</p>
              </div>
            </div>
  
            {/* Terms of Work Card */}
            <div className="mt-8 lg:mt-0">
              <div className="lg:fixed lg:w-[300px]">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Terms of work</h3>
                  <p className="text-3xl font-bold mb-6">${applicant.price}</p>
                  <div className="space-y-3">
                    {/* Start Chatting with AI Agents */}
                    <Button className="w-full bg-[#4ADE80] hover:bg-[#22C55E] text-white">ACCEPT</Button>
                    {/* Close this screen and Delete it on the list */}
                    <Button className="w-full bg-[#F87171] hover:bg-[#EF4444] text-white">DECLINE</Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
}
    
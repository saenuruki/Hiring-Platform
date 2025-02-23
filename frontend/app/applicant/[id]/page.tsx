"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import ContractConfirmationPopup from "@/components/contract-confirmation-popup";
import { faker } from "@faker-js/faker";

export interface Applicant {
  id: number;
  name: string;
  rating: number;
  price: number;
  description: string;
  profileImage: string;
}

export default function ApplicantDetail() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const description = generateApplicantDescription();
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  // const [description, setDescription] = useState("");

  useEffect(() => {
    const applicantData = searchParams.get("data");
    if (applicantData) {
      try {
        const parsedApplicant = JSON.parse(
          decodeURIComponent(applicantData)
        ) as Applicant;
        setApplicant(parsedApplicant);
        // const newDescription = "hsoaljsaljsa";
        // setDescription(newDescription);
      } catch (error) {
        console.error("Error parsing applicant data:", error);
      }
    }
  }, [searchParams]);

  const handleAccept = () => {
    setShowConfirmation(true);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
  };

  const handleNextClick = () => {
    router.push("/chat");
  };

  if (!applicant) {
    return (
      <div className="min-h-screen bg-white">
        <main className="container mx-auto px-4 pt-24 pb-16">
          <h1 className="text-3xl font-bold mb-6">Applicant Not Found</h1>
          <p>
            The applicant you're looking for doesn't exist or has been removed.
          </p>
        </main>
      </div>
    );
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
                <Image
                  src={applicant.profileImage}
                  alt={applicant.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{applicant.name}</h1>
                <div className="flex items-center">
                  {Array.from({ length: applicant.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-6 h-6 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Banner Image */}
            <div className="relative w-full h-48">
              <Image
                src="/bg-2.png"
                alt="Web Scraping Services Banner"
                fill
                className="object-cover rounded-lg"
              />
            </div>

            {/* Description */}
            <div className="space-y-4">
              <p className="text-gray-700">{description}</p>
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
                  <Button
                    onClick={handleAccept}
                    className="w-full bg-[#4ADE80] hover:bg-[#22C55E] text-white"
                  >
                    ACCEPT
                  </Button>
                  {/* Close this screen and Delete it on the list */}
                  <Button className="w-full bg-[#F87171] hover:bg-[#EF4444] text-white">
                    DECLINE
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      {showConfirmation && (
        <ContractConfirmationPopup
          onClose={handleConfirmationClose}
          onNext={handleNextClick}
        />
      )}
    </div>
  );
}

export function generateApplicantDescription(): string {
  const skills = [
    "problem-solving",
    "communication",
    "teamwork",
    "adaptability",
    "creativity",
    "leadership",
    "time management",
    "critical thinking",
    "technical expertise",
    "project management",
  ];

  const experiences = [
    "leading cross-functional teams",
    "developing innovative solutions",
    "optimizing business processes",
    "managing large-scale projects",
    "implementing cutting-edge technologies",
    "driving strategic initiatives",
    "mentoring junior team members",
    "collaborating with international partners",
    "conducting in-depth market research",
    "presenting to executive stakeholders",
  ];

  const achievements = [
    "increased team productivity by 30%",
    "reduced operational costs by 25%",
    "launched successful products in new markets",
    "improved customer satisfaction scores by 40%",
    "secured major partnerships with industry leaders",
    "received multiple awards for innovation",
    "published articles in respected industry journals",
    "delivered keynote speeches at international conferences",
    "patented groundbreaking technologies",
    "exceeded sales targets consistently for 5 years",
  ];

  const description = `
    As a highly skilled professional with ${faker.number.int({
      min: 5,
      max: 15,
    })} years of experience in ${faker.company.buzzNoun()}, 
    I bring a wealth of expertise in ${faker.helpers
      .arrayElements(skills, 3)
      .join(", ")}, and ${faker.helpers.arrayElement(skills)}. 
    My career has been marked by significant accomplishments, including ${faker.helpers.arrayElement(
      achievements
    )} and ${faker.helpers.arrayElement(achievements)}. 
    I have extensive experience in ${faker.helpers
      .arrayElements(experiences, 2)
      .join(
        " and "
      )}, which has honed my ability to ${faker.helpers.arrayElement(
    experiences
  )}. 
    My approach combines ${faker.helpers.arrayElement(
      skills
    )} with ${faker.helpers.arrayElement(
    skills
  )} to drive results and foster innovation. 
    I am particularly adept at ${faker.helpers.arrayElement(
      experiences
    )}, having successfully ${faker.helpers.arrayElement(
    achievements
  )} in my previous role. 
    My commitment to continuous learning has led me to ${faker.helpers.arrayElement(
      experiences
    )}, further enhancing my ${faker.helpers.arrayElement(skills)} skills. 
    I am excited about the opportunity to bring my unique blend of ${faker.helpers.arrayElement(
      skills
    )} and ${faker.helpers.arrayElement(skills)} to new challenges, 
    and I am confident in my ability to make significant contributions to any team or project.
  `
    .replace(/\s+/g, " ")
    .trim();

  // Ensure the description is exactly 1200 characters
  return description.length > 1200
    ? description.slice(0, 1197) + "..."
    : description.padEnd(1200, " ");
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useTransition, animated } from "react-spring";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Applicant } from "../../applicant/[id]/page";
import { useTaskContext } from "@/components/task-provider";
import Loading from "@/components/loading";
import Image from "next/image";
import { Star } from "lucide-react";

// Function to generate a random applicant (unchanged)
const generateRandomApplicant = () => {
  const names = [
    "Alice",
    "Bob",
    "Charlie",
    "David",
    "Eva",
    "Frank",
    "Grace",
    "Henry",
    "Ivy",
    "Jack",
  ];
  const descriptions = [
    "Experienced professional with a track record of success.",
    "Innovative problem-solver ready to tackle new challenges.",
    "Detail-oriented individual with excellent communication skills.",
    "Adaptable team player with a passion for learning.",
    "Results-driven expert committed to delivering high-quality work.",
  ];
  return {
    id: Math.random(),
    name: names[Math.floor(Math.random() * names.length)],
    rating: Math.floor(Math.random() * 5) + 1,
    price: Math.floor(Math.random() * 100) + 20,
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    profileImage: `/agent-${Math.floor(Math.random() * 9)}.png`,
  };
};

const Task = {
  key: "1",
  title: "Web Scraping",
  description:
    "Looking for a web scraping expert to extract data from multiple websites.",
  goals: ["Extract data from 5 websites", "Deliver results in CSV format"],
  skills: ["Python", "Web Scraping", "Data Extraction"],
};

export interface Task {
  id: number;
  title: string;
  description?: string;
  goals?: string[];
  skills?: string[];
}

export default function JobDetail() {
  const params = useParams();

  const { program, publicKey, task, loadTask } = useTaskContext();

  useEffect(() => {
    loadTask(params.id);
  }, [params.id, program, publicKey]);

  const [applicants, setApplicants] = useState<Applicant[]>([
    {
      id: 1,
      name: "Johnson",
      rating: 4,
      price: 45,
      description:
        "Experienced web scraper with expertise in Python and BeautifulSoup. Fast and accurate data extraction guaranteed.",
      profileImage: "/agent-1.png",
    },
    {
      id: 2,
      name: "Smith",
      rating: 2,
      price: 39,
      description:
        "Skilled data analyst specializing in web scraping and data cleaning. Proficient in R and rvest package.",
      profileImage: "/agent-2.png",
    },
    {
      id: 3,
      name: "Brown",
      rating: 1,
      price: 81,
      description:
        "Full-stack developer with strong web scraping skills. Expert in JavaScript and Node.js for efficient data extraction.",
      profileImage: "/agent-3.png",
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setApplicants((currentApplicants: Applicant[]) => {
        const newApplicant = generateRandomApplicant();
        const insertIndex = Math.floor(
          Math.random() * (currentApplicants.length + 1)
        );
        const newApplicants = [
          ...currentApplicants.slice(0, insertIndex),
          newApplicant,
          ...currentApplicants.slice(insertIndex),
        ];
        return newApplicants.sort((a, b) => b.rating - a.rating);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const transitions = useTransition(applicants, {
    from: { opacity: 0, transform: "scale(0.8)" },
    enter: { opacity: 1, transform: "scale(1)" },
    leave: { opacity: 0, transform: "scale(0.8)" },
    keys: (applicant: Applicant) => applicant.id,
  });

  if (!task) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Task Not Found</h1>
        <p>The task you're looking for doesn't exist or has been removed.</p>
        <Link href="/jobs">
          <Button className="mb-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white">
            Back to Task Listings
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">{task.taskId}</h1>
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mt-4 mb-2">Description</h2>
          <p>{task.data?.description}</p>

          {task.data?.goals && (
            <>
              <h2 className="text-xl font-semibold mt-4 mb-2">Goals</h2>
              <ul className="list-disc pl-5">
                {task.data?.goals
                  .split("\n")
                  .map((goal: string, index: Number) => (
                    <li key={`goal-${index}`}>{goal}</li>
                  ))}
              </ul>
            </>
          )}

          {task.data?.skills && (
            <>
              <h2 className="text-xl font-semibold mt-4 mb-2">
                Required Skills
              </h2>
              <ul className="list-disc pl-5">
                {task.data?.skills
                  .split("\n")
                  .map((skill: string, index: Number) => (
                    <li key={`skill-${index}`}>{skill}</li>
                  ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4 mt-8">Applicants</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {transitions((style, applicant) => (
          <animated.div style={style} key={applicant.id}>
            <Card key={applicant.id} className="border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-4">
                    <Image
                      src={applicant.profileImage || "/placeholder.svg"}
                      alt={`${applicant.name}'s profile`}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <CardTitle className="text-lg">{applicant.name}</CardTitle>
                  </div>
                  <span className="text-lg font-normal">
                    ${applicant.price}
                  </span>
                </div>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < applicant.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    ({applicant.rating})
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{applicant.description}</p>
                <Link
                  href={{
                    pathname: `/applicant/${applicant.id}`,
                    query: { data: JSON.stringify(applicant) },
                  }}
                >
                  <Button className="mt-4 w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white">
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
            {/* <Card>
              <CardHeader>
                <CardTitle>{applicant.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {applicant.description}
                </p>
                <div className=" mt-8">
                  <Link
                    href={{
                      pathname: `/applicant/${applicant.id}`,
                      query: {
                        data: encodeURIComponent(JSON.stringify(applicant)),
                      },
                    }}
                  >
                    <Button className="mb-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-full">
                      More Info
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card> */}
          </animated.div>
        ))}
      </div>

      <div className="mt-8">
        <Link href="/jobs">
          <Button className="mb-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-full">
            Back to Task Listings
          </Button>
        </Link>
      </div>
    </main>
  );
}

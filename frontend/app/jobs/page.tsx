"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTaskContext } from "@/components/task-provider";

export interface Job {
  id: number;
  title: string;
  description?: string;
  goals?: string[];
  skills?: string[];
}

const initialJobs: Job[] = [
  {
    id: 1,
    title: "Software Engineer",
    description:
      "As a Software Engineer, you will be responsible for designing, coding, testing, and debugging software applications. You will work closely with other engineers and product managers to deliver innovative solutions to our clients.",
    goals: [
      "Design, develop, and test software applications",
      "Write clean, efficient, and well-documented code",
      "Collaborate with other engineers to review code and share knowledge",
      "Troubleshoot and debug software issues",
      "Participate in the full software development lifecycle",
    ],
    skills: [
      "Programming (e.g., Java, Python, JavaScript)",
      "Software design patterns",
      "Testing and debugging",
      "Version control (e.g., Git)",
      "Agile methodologies",
    ],
  },
  {
    id: 2,
    title: "Product Manager",
    description:
      "As a Product Manager, you will be responsible for defining the product vision, strategy, and roadmap. You will work closely with engineering, design, and marketing teams to bring innovative products to market.",
    goals: [
      "Define and champion the product vision, strategy, and roadmap",
      "Conduct market research and analyze customer needs",
      "Prioritize and manage the product backlog",
      "Collaborate with engineering, design, and marketing teams",
      "Track product performance and identify areas for improvement",
    ],
    skills: [
      "Product strategy",
      "Market research",
      "Product roadmap planning",
      "Agile methodologies",
      "Communication and collaboration",
    ],
  },
  {
    id: 3,
    title: "UX Designer",
    description:
      "As a UX Designer, you will be responsible for conducting user research, creating wireframes and prototypes, and designing user interfaces that are both aesthetically pleasing and functional.",
    goals: [
      "Conduct user research and analyze user feedback",
      "Create wireframes, prototypes, and user flows",
      "Design user interfaces for web and mobile applications",
      "Collaborate with product managers and engineers to ensure designs are feasible and meet user needs",
      "Conduct usability testing and iterate on designs based on feedback",
    ],
    skills: [
      "User research",
      "Wireframing and prototyping",
      "User interface design",
      "Interaction design",
      "Usability testing",
    ],
  },
];

export default function Home() {
  const { tasks } = useTaskContext();
  // const [jobs, setJobs] = useState<Job[]>(() => {
  //   if (typeof window !== "undefined") {
  //     const savedJobs = localStorage.getItem("jobs");
  //     return savedJobs ? JSON.parse(savedJobs) : initialJobs;
  //   }
  //   return initialJobs;
  // });

  // useEffect(() => {
  //   localStorage.setItem("jobs", JSON.stringify(jobs));
  // }, [jobs]);

  // useEffect(() => {
  //   const handleStorageChange = () => {
  //     const savedJobs = localStorage.getItem("jobs");
  //     if (savedJobs) {
  //       setJobs(JSON.parse(savedJobs));
  //     }
  //   };

  //   window.addEventListener("storage", handleStorageChange);
  //   return () => {
  //     window.removeEventListener("storage", handleStorageChange);
  //   };
  // }, []);

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Job Listings</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task: any) => (
            <Card key={task.account.taskId}>
              <CardHeader>
                <CardTitle>{task.account.taskId}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {task.description}
                </p>
              </CardContent>
              <CardFooter>
                <Link href={`/job/${task.account.taskId}`}>
                  <Button className="mb-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-full">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

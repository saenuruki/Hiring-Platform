"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTaskContext } from "@/components/task-provider";

dayjs.extend(relativeTime);

export default function Tasks() {
  const { program, publicKey, tasks, loadTasks } = useTaskContext();

  useEffect(() => {
    loadTasks();

    const int = setInterval(() => {
      loadTasks();
    }, 10000);

    return () => clearInterval(int);
  }, [program, publicKey]);

  console.log(tasks);

  return (
    <main className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Task Listings</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks
          .sort((a: any, b: any) => b.account.createdAt - a.account.createdAt)
          .map((task: any) => (
            <Card key={task.key}>
              <CardHeader>
                <CardTitle>{task.account.taskId}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {dayjs.unix(task.account.createdAt).fromNow()}
                </p>
              </CardContent>
              <CardFooter>
                <Link href={`/job/${task.key}`}>
                  <Button className="mb-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-full">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
      </div>
    </main>
  );
}

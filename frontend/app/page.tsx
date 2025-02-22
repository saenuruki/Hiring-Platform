import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <main className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2 space-y-6">
            <h1 className="text-5xl font-bold leading-tight">
              The AI-Powered Gig Marketplace
            </h1>
            <p className="text-2xl text-[#7C3AED]">
              Where AI Meets Work. Automate. Earn. Scale
            </p>
            <p className="text-gray-600 text-lg max-w-xl">
              NeuroGigX is a decentralized job marketplace where AI bots apply
              for jobs, complete tasks, and get paid autonomously—powered by
              Solana blockchain for transparency and efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/jobs">
                <Button className="w-full sm:w-auto bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-8 py-6 text-lg rounded-full">
                  HIRE AN AI AGENT
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex items-center">
            <div className="relative w-full h-auto">
              <div className="absolute top-0 left-0 animate-pulse rounded-full h-full w-full bg-purple-100 z-0 flex items-center justify-center">
                <div className="animate-pulse rounded-full h-[90%] w-[90%] bg-purple-50 z-0 flex items-center justify-center">
                  <div className="rounded-full h-[90%] w-[90%] bg-white z-0"></div>
                </div>
              </div>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/home-1gJAhcNEZ3bPaAbn4yNvwHLnNyL0HQ.png"
                alt="Team illustration"
                width={500}
                height={500}
                priority
                className="relative object-contain w-full h-auto z-10"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

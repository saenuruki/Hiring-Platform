import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <main className="container mx-auto px-4">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="w-full lg:w-1/2 space-y-8">
          <h1 className="text-5xl font-bold">About us</h1>
          <div className="space-y-8">
            <p className="text-lg text-gray-700">
              At NeuroGigX, we are a team of hackathon enthusiasts dedicated to
              redefining the future of work. Our diverse backgrounds in AI
              development, software engineering, and entrepreneurship drive us
              to build a seamless, automated task marketplace powered by Solana
            </p>
            <p className="text-lg text-gray-700">
              Our mission is to create an open and decentralized AI workforce,
              where AI agents can autonomously apply for jobs, complete tasks,
              and get paid securely—empowering both developers and businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <Button className="w-full sm:w-auto bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-8 py-6 text-lg rounded-full">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <div className="relative w-full h-auto">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/about-us-YVlB35IpfP8eH6VNdIOkb200R6GJ06.png"
              alt="Team at Builders Weekend event"
              width={450}
              height={600}
              className="object-contain rounded-lg"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react";
import { PhantomWalletName } from "@solana/wallet-adapter-wallets";
import { useTaskContext } from "./task-provider";
import Image from "next/image";

export function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { connected, select } = useWallet();
  const [connecting, setConnecting] = useState(false);

  const { user, initialized, initUser } = useTaskContext();

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsScrolled(true)
    } else {
      setIsScrolled(false)
    }
  }

  const connectHandler = () => {
      setConnecting(true);
      select(PhantomWalletName);
  };

  useEffect(() => {
    if (user) {
      setConnecting(false);
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [user]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 bg-white z-50 transition-shadow duration-200 ${isScrolled ? "shadow-md" : ""}`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-8kon9CPID2S3jYSk023lGSJ9ZYBLy5.png"
            alt="NeuroGigX Logo"
            width={150}
            height={40}
            priority
            className="h-8 w-auto"
          />
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/" className="text-black hover:text-[#7C3AED]">
            Home
          </Link>
          <Link href="/about" className="text-black hover:text-[#7C3AED]">
            About Us
          </Link>
          {connected && (
          <li className="flex items-center space-x-2">
            <button
                className="ml-3 mr-2"
                onClick={() => {
                  initUser();
                }}
            >
                <img src={user?.avatar} className="h-8 w-8 rounded-full" />
            </button>
            <Link href="/job/create" className="text-black hover:text-[#7C3AED]">
                <Button variant="outline" className="border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white rounded-full">
                    Create Job
                </Button>
            </Link>
          </li>
        )}
        {!connected && (
            <Button onClick={connectHandler} variant="outline" className="border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white rounded-full">
                Login
            </Button>
        )}
        </div>
      </div>
    </nav>
  )
}
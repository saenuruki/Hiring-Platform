import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import NavBar from "@/components/nav-bar";

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NavBar />
          {children}
          <div className="bg-gray-200 ">
            <div className="container  mx-auto px-4 py-4 flex justify-between items-center">
              Builders Weekend Hackathon - 2025
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}

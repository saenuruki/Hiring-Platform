"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PDFUploadProps {
  onUpload: (data: {
    title: string;
    description: string;
    goals: string;
    skills: string[];
  }) => void;
}

export function PDFUpload({ onUpload }: PDFUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("File details:", {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      // fetch呼び出しの直前に追加
      console.log("Sending request to API...");

      console.log("Sending request to /api/parse-job-pdf");
      const response = await fetch("/api/parse-job-pdf", {
        method: "POST",
        body: formData,
      });
      console.log("API Response:", response);

      // レスポンス受信後、JSON解析前に追加
      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to parse PDF: ${errorData.error || response.statusText}`
        );
      }

      console.log("Received response from /api/parse-job-pdf");
      const data = await response.json();
      console.log("Parsed data:", data);
      onUpload(data);
    } catch (error) {
      console.error("Error parsing PDF:", error);
      setError(
        `Error parsing PDF: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="pdf-upload">Upload Job Description PDF (Optional)</Label>
      <Input
        id="pdf-upload"
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileUpload}
        disabled={isUploading}
      />
      {isUploading && (
        <p className="text-sm text-gray-500">Uploading and parsing PDF...</p>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PDFMessageProps {
  pdfUrl: string | null;
}

export function PDFMessage({ pdfUrl }: PDFMessageProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gray-100 flex justify-between items-center">
        <span className="font-semibold text-gray-700">PDF Document</span>
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="outline"
          size="sm"
        >
          {isExpanded ? "Close" : "View"}
        </Button>
      </div>
      {isExpanded && (
        <div className="h-[70vh] max-h-[500px]">
          {pdfUrl ? (
            <iframe
              src={`${pdfUrl}#view=FitH`}
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">PDF could not be loaded</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

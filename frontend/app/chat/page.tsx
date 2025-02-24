"use client";

import type React from "react";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { PDFMessage } from "@/components/pdf-message";
import { TypingIndicator } from "@/components/typing-indicator";

type Message = {
  id: number;
  role: "user" | "assistant" | "pdf";
  content: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  //   const [showPDF, setShowPDF] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null);

  //   const scrollToBottom = useCallback(() => {
  //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  //   }, [])

  //   useEffect(() => {
  //     scrollToBottom()
  //   }, [scrollToBottom])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        role: "user",
        content: input.trim(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setInput("");

      if (isFirstMessage) {
        setIsFirstMessage(false);
        sendDummyResponses();
      }
    }
  };

  const sendDummyResponses = () => {
    const responses = [
      {
        content:
          "Thank you for the contract! I will work hard to complete the tasks.☺️",
        delay: 1000,
      },
      {
        content: "I am currently researching a wide range of sites.",
        delay: 3000,
      },
      {
        content:
          "This process will take approximately 7 minutes. For the purpose of this demonstration, I'll provide you with the pre-generated results.",
        delay: 7000,
      },
    ];

    responses.forEach((response, index) => {
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const newMessage: Message = {
            id: Date.now() + index,
            role: "assistant",
            content: response.content,
          };
          setMessages((prev) => [...prev, newMessage]);
        }, 2000);
      }, response.delay);
    });

    setTimeout(() => {
      const pdfMessage: Message = {
        id: Date.now() + responses.length,
        role: "pdf",
        content: "https://meltinghack.s3.us-west-2.amazonaws.com/report.pdf",
      };
      setMessages((prev) => [...prev, pdfMessage]);
    }, 10000);

    // setTimeout(() => {
    //   setShowPDF(true)
    // }, 10000)
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <main className="container mx-auto px-4 py-4 h-[calc(100vh-theme(spacing.16)-theme(spacing.16))] flex items-center justify-center">
        <Card className="w-full h-full max-w-3xl overflow-hidden flex flex-col">
          {/* <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "pdf" ? (
                  <PDFMessage pdfUrl={message.content} />
                ) : (
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-[#7C3AED] text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {message.content}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent> */}
          <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "pdf" ? (
                  <PDFMessage pdfUrl={message.content} />
                ) : (
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-[#7C3AED] text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {message.content}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <TypingIndicator />
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
          <div className="p-4 border-t bg-white">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow"
              />
              <Button
                type="submit"
                className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
              >
                Send
              </Button>
            </form>
          </div>
        </Card>
      </main>
    </div>
  );
}

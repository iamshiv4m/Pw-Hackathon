"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChatCompletion } from "@/hooks/useChatCompletion";
import { useTranscript } from "@/contexts/TranscriptContext";
import TypingIndicator from "@/components/typing-indicator";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Stable initial timestamp
const INITIAL_TIMESTAMP = new Date("2024-01-01T00:00:00.000Z");

// Stable ID generation
const generateId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).substr(2, 9)}`;

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      text: "Welcome! I'm here to help you with any questions about the video. Feel free to ask anything!",
      isUser: false,
      timestamp: INITIAL_TIMESTAMP,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { mutate: getChatCompletion, isPending } = useChatCompletion();
  const { videoId, isPending: isTranscriptPending } = useTranscript();

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isPending) return;

    if (!videoId) {
      const errorMessage: Message = {
        id: generateId("error"),
        text: isTranscriptPending
          ? "Please wait while we generate the video transcript..."
          : "No video transcript available. Please make sure you're watching a video.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    const userMessage: Message = {
      id: generateId("user"),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    getChatCompletion(
      {
        question: inputValue.trim(),
        videoId,
      },
      {
        onSuccess: (response) => {
          setIsTyping(false);
          const botMessage: Message = {
            id: generateId("bot"),
            text: response.data.answer,
            isUser: false,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMessage]);
        },
        onError: (error) => {
          setIsTyping(false);
          const errorMessage: Message = {
            id: generateId("error"),
            text: "Sorry, I encountered an error. Please try again.",
            isUser: false,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        },
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-full flex flex-col border-0 shadow-lg bg-gradient-to-br from-white to-indigo-50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500">
        <CardTitle className="flex items-center gap-2 text-white">
          <MessageCircle className="h-5 w-5" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-100">
            CHAT
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        <div
          className="flex-1 overflow-y-auto px-4 min-h-0"
          ref={scrollAreaRef}
        >
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm transition-all duration-300 hover:shadow-md ${
                    message.isUser
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                      : "bg-white text-gray-900 border border-indigo-100"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.isUser ? "text-indigo-200" : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "UTC",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-indigo-100">
                  <TypingIndicator />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-indigo-100 p-4 bg-white bg-opacity-70 backdrop-blur-sm">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isTranscriptPending
                  ? "Generating transcript..."
                  : "Type your message..."
              }
              disabled={isPending || isTranscriptPending}
              className="flex-1 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isPending || isTranscriptPending}
              size="icon"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:shadow-md"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

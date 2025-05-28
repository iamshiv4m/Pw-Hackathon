"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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
      text: "Welcome! I'm here to help you with any questions about the video. You have 3 free messages to chat with me.",
      isUser: false,
      timestamp: INITIAL_TIMESTAMP,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [isPolling, setIsPolling] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const maxMessages = 3;

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const simulatePolling = async (): Promise<string> => {
    // Simulate polling with random delay
    const delay = Math.random() * 2000 + 1000; // 1-3 seconds
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Mock responses
    const responses = [
      "That's a great question! Based on the video content, I can help explain that concept in more detail.",
      "I understand your query. The video covers this topic around the middle section where the presenter discusses...",
      "Excellent point! This relates to what was mentioned in the video about best practices and implementation strategies.",
      "Thank you for asking! The video provides some insights on this topic that I can elaborate on for you.",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || messageCount >= maxMessages || isPolling) return;

    const userMessage: Message = {
      id: generateId("user"),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setMessageCount((prev) => prev + 1);
    setIsTyping(true);
    setIsPolling(true);

    try {
      const response = await simulatePolling();

      setIsTyping(false);

      const botMessage: Message = {
        id: generateId("bot"),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setIsTyping(false);
      const errorMessage: Message = {
        id: generateId("error"),
        text: "Sorry, I encountered an error. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsPolling(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-full flex flex-col border-0 shadow-lg bg-gradient-to-br from-white to-indigo-50 overflow-hidden">
      <CardHeader className=" bg-gradient-to-r from-indigo-500 to-purple-500">
        <CardTitle className="flex items-center gap-2 text-white">
          <MessageCircle className="h-5 w-5" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-100">
            CHAT
          </span>
        </CardTitle>
        {/* <div className="text-sm text-indigo-100 flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span>
            {messageCount}/{maxMessages} messages used
          </span>
        </div> */}
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
              /*  placeholder={
                messageCount >= maxMessages
                  ? "Message limit reached"
                  : "Type your message..."
              } */
              disabled={/* messageCount >= maxMessages || */ isPolling}
              className="flex-1 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400"
            />
            <Button
              onClick={handleSendMessage}
              disabled={
                !inputValue.trim() /* || messageCount >= maxMessages */ ||
                isPolling
              }
              size="icon"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:shadow-md"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/*  {messageCount >= maxMessages && (
            <p className="text-xs text-red-500 mt-2 animate-pulse">
              You've reached the maximum number of free messages.
            </p>
          )} */}
        </div>
      </CardContent>
    </Card>
  );
}

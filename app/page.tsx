"use client";

import { Suspense } from "react";
import VideoPlayer from "@/components/video-player";
import VideoSummary from "@/components/video-summary";
import ChatInterface from "@/components/chat-interface";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              <span className="inline-block transform hover:scale-105 transition-transform duration-200">
                Convert
              </span>
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Video and Summary */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video Player */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100 transform transition-all duration-300 hover:shadow-xl">
              <Suspense
                fallback={
                  <div className="aspect-video bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                    <div className="text-indigo-500 animate-pulse">
                      Loading video...
                    </div>
                  </div>
                }
              >
                <VideoPlayer />
              </Suspense>
            </div>

            {/* Video Summary */}
            <VideoSummary />
          </div>

          {/* Right Column - Chat */}
          <div className="lg:col-span-1 h-full flex flex-col min-h-0">
            <ChatInterface />
          </div>
        </div>
      </main>
    </div>
  );
}

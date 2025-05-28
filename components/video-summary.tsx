"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { useGenerateTranscript } from "@/hooks/useGenerateTranscript";
import { TranscriptProvider } from "@/contexts/TranscriptContext";

export default function VideoSummary() {
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    mutate: generateTranscript,
    isPending,
    error,
    data,
  } = useGenerateTranscript();

  useEffect(() => {
    const url = searchParams.get("video");
    if (url) {
      generateTranscript(
        { videoUrl: url },
        {
          onSuccess: (data) => {
            console.log("Transcript generated successfully:", data);
          },
          onError: (error) => {
            console.error("Failed to generate transcript:", error);
          },
        }
      );
    }
  }, [searchParams, generateTranscript]);

  const transcript = data?.data?.transcript || "";
  const videoId = data?.data?.videoId || null;
  const truncatedTranscript = transcript.slice(0, 200);
  const shouldShowToggle = transcript.length > 200;

  return (
    <TranscriptProvider
      value={{
        videoId,
        transcript,
        isPending,
        error,
      }}
    >
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-indigo-50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500">
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Film className="h-5 w-5" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-100">
              Video Transcript
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {isPending ? (
            <div className="space-y-3">
              <div className="h-4 bg-gradient-to-r from-indigo-200 to-purple-100 rounded animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-indigo-200 to-purple-100 rounded animate-pulse w-5/6"></div>
              <div className="h-4 bg-gradient-to-r from-indigo-200 to-purple-100 rounded animate-pulse w-4/6"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">Error: {error.message}</p>
            </div>
          ) : (
            <div className="animate-fadeIn">
              <p className="text-gray-700 leading-relaxed">
                {isExpanded ? transcript : truncatedTranscript}
                {!isExpanded && shouldShowToggle && "..."}
              </p>

              {shouldShowToggle && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-3 p-0 h-auto font-medium text-indigo-600 transition-all duration-200 hover:text-white"
                >
                  {isExpanded ? (
                    <>
                      See Less <ChevronUp className="ml-1 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      See More <ChevronDown className="ml-1 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </TranscriptProvider>
  );
}

"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VideoSummary() {
  const [summary, setSummary] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching summary from backend
    const fetchSummary = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock summary data
      const mockSummary = `This video provides a comprehensive overview of modern web development practices, covering essential topics such as React, Next.js, and TypeScript. The presenter demonstrates how to build scalable applications using component-based architecture and discusses best practices for state management, routing, and performance optimization. Key concepts include server-side rendering, static site generation, and the importance of user experience in modern web applications. The video also covers deployment strategies and how to optimize applications for production environments. Additionally, the presenter shares insights on debugging techniques, testing methodologies, and maintaining code quality in large-scale projects. This comprehensive guide serves as an excellent resource for developers looking to enhance their skills in modern web development frameworks and tools.`;

      setSummary(mockSummary);
      setIsLoading(false);
    };

    fetchSummary();
  }, []);

  const truncatedSummary = summary.slice(0, 200);
  const shouldShowToggle = summary.length > 200;

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-indigo-50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500">
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <Film className="h-5 w-5" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-100">
            Summary of the Video
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-4 bg-gradient-to-r from-indigo-200 to-purple-100 rounded animate-pulse"></div>
            <div className="h-4 bg-gradient-to-r from-indigo-200 to-purple-100 rounded animate-pulse w-5/6"></div>
            <div className="h-4 bg-gradient-to-r from-indigo-200 to-purple-100 rounded animate-pulse w-4/6"></div>
          </div>
        ) : (
          <div className="animate-fadeIn">
            <p className="text-gray-700 leading-relaxed">
              {isExpanded ? summary : truncatedSummary}
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
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VideoPlayer() {
  const searchParams = useSearchParams();
  const [videoUrl, setVideoUrl] = useState<string>("");

  useEffect(() => {
    const url = searchParams.get("video");
    if (url) {
      // Convert YouTube URL to embed format if needed
      const embedUrl = convertToEmbedUrl(url);
      setVideoUrl(embedUrl);
    }
  }, [searchParams]);

  const convertToEmbedUrl = (url: string): string => {
    // Handle different YouTube URL formats
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("youtube.com/embed/")) {
      return url;
    }
    return url;
  };

  if (!videoUrl) {
    return (
      <div className="aspect-video bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center border-2 border-dashed border-indigo-200 rounded-lg">
        <div className="text-center p-6">
          <div className="text-indigo-600 text-lg font-medium mb-2">
            No video URL provided
          </div>
          <div className="text-indigo-400 text-sm">
            Add ?video=YOUR_YOUTUBE_URL to the page URL
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video relative">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 animate-pulse opacity-20 rounded-lg"></div>
      <iframe
        src={videoUrl}
        title="Video Player"
        className="w-full h-full relative z-10"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
}

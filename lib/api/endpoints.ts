export const API_ENDPOINTS = {
  GENERATE_TRANSCRIPT: "/uxncc-go/video-stats/generate-transcript",
} as const;

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8888";

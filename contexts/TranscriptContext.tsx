"use client";

import { createContext, useContext, ReactNode } from "react";

interface TranscriptContextType {
  videoId: string | null;
  transcript: string | null;
  isPending: boolean;
  error: Error | null;
}

const TranscriptContext = createContext<TranscriptContextType>({
  videoId: null,
  transcript: null,
  isPending: false,
  error: null,
});

export function TranscriptProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: TranscriptContextType;
}) {
  return (
    <TranscriptContext.Provider value={value}>
      {children}
    </TranscriptContext.Provider>
  );
}

export function useTranscript() {
  return useContext(TranscriptContext);
}

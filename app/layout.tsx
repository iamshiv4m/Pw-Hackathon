import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "PW Hackathon",
  keywords: ["PW Hackathon", "AI", "Chatbot"],
  authors: [{ name: "Shivam Jha" }],
  description: "Created with PW Hackathon",
  generator: "PW",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

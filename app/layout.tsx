import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
};

export const metadata: Metadata = {
  title: "Civentra AI | Autonomous Multi-Agent Civic Intelligence Platform",
  description: "Autonomous problem solving for modern communities. Real-time civic issue identification, verification, prediction, and resolution using a collaborative network of intelligent AI agents.",
  keywords: ["Civic Tech", "Artificial Intelligence", "Multi-Agent Systems", "Smart City", "Google Vertex AI", "Gemini Vision", "Urban Planning"],
  authors: [{ name: "Civentra AI team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full bg-brand-black text-foreground antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}

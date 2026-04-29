import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Image from "next/image";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lakon — AI Prompt Compressor",
  description:
    "Lakon compresses your prompts before Claude, ChatGPT, or Gemini reads them. Same answer — up to 78% fewer tokens.",
  keywords: ["prompt compression", "AI tokens", "Claude", "ChatGPT", "Gemini", "token saver"],
  openGraph: {
    title: "Lakon — AI Prompt Compressor",
    description: "Stop sending prompts raw.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        style={{ background: "var(--bg)", color: "var(--text-1)", display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Navbar />

        {/* Page content — offset by navbar height + padding */}
        <div style={{ paddingTop: "72px", flex: 1, display: "flex", flexDirection: "column", width: "100%" }}>
          {children}
        </div>

        {/* ── FOOTER ───────────────────────────────────────────────────────── */}
        <footer
          style={{
            borderTop: "0.8px solid var(--border)",
            padding: "24px 24px",
          }}
        >
          <div
            style={{
              maxWidth: "900px",
              margin: "0 auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ position: "relative", width: 16, height: 16 }}>
                <Image 
                  src="/edited-photo (2).png" 
                  alt="Lakon Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
              <span style={{ fontSize: "12px", color: "var(--text-3)", fontWeight: 500 }}>lakon</span>
              <span style={{ fontSize: "12px", color: "var(--text-3)", marginLeft: "4px" }}>— built on LLM attention research</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                fontSize: "12px",
                color: "var(--text-3)",
              }}
            >
              <a href="/docs" style={{ color: "var(--text-3)", textDecoration: "none" }}>Docs</a>
              <a href="/privacy" style={{ color: "var(--text-3)", textDecoration: "none" }}>Privacy</a>
              <a href="mailto:sumitagar4@gmail.com" style={{ color: "var(--text-3)", textDecoration: "none" }}>Contact</a>
            </div>
          </div>
        </footer>

        <Analytics />
      </body>
    </html>
  );
}

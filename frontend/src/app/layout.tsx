import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });

export const metadata: Metadata = {
  title: "Ganesh Vaddepalli | Python Full-Stack & Generative AI Engineer",
  description:
    "Architecting scalable Python backends, engineering multi-agent Gen AI systems, and deploying secure web applications.",
};

export const viewport: Viewport = { themeColor: "#05060f" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={grotesk.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

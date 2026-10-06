import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Vercel sets VERCEL_PROJECT_PRODUCTION_URL to the stable production domain
// (no per-deployment hash) in every environment; fall back to localhost.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Riverside Ward | Sacrament Meeting Planner",
  description:
    "Plan, view, and print Riverside Ward sacrament meeting agendas. Built with the Next.js App Router for WDD 430.",
  openGraph: {
    title: "Riverside Ward | Sacrament Meeting Planner",
    description:
      "Plan, view, and print Riverside Ward sacrament meeting agendas.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12 print:max-w-none print:p-0">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

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

export const metadata: Metadata = {
  title: "Riverside Ward | Sacrament Meeting Planner",
  description:
    "Plan, view, and print Riverside Ward sacrament meeting agendas. Built with the Next.js App Router for WDD 430.",
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

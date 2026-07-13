import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { Header } from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Ticket Router",
  description: "AI-powered support ticket classification",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
          <Sidebar />
          <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
            <MobileNav />
            <div className="mx-auto max-w-6xl space-y-6 p-6">
              <Header />
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

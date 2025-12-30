import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { LayoutProvider } from "@/context/LayoutContext"; // 1. Import the provider

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Assistant",
  description: "Minimalist RAG Chat Interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* 2. Wrap the entire layout structure with LayoutProvider */}
          <LayoutProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex flex-1 flex-col">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                  {children}
                </main>
              </div>
            </div>
          </LayoutProvider>
          
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
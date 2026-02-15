import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexProvider } from "@/components/providers";
import { Nav } from "@/components/nav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "OpenClaw Mission Control",
  description: "AI Agent Command Center",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased scrollbar-custom">
        <ConvexProvider>
          <div className="flex flex-col min-h-screen">
            <Nav />
            <main className="flex-1 px-3 py-4 md:px-6 md:py-6">
              {children}
            </main>
          </div>
        </ConvexProvider>
      </body>
    </html>
  );
}

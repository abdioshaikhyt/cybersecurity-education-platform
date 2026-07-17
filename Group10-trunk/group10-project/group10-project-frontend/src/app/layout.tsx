import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ArticleNavbar from "@/components/articles/ArticleNavbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VYDS: VIsualize Your Data Security",
  description: "Helping you visualise and understand your data security, and how different companies handle your data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex flex-col antialiased min-h-screen min-w-screen w-full h-full`}
      >
        <ArticleNavbar />
        <div className="bg-gradient-to-b from-blue-100 to-white flex flex-grow flex-col h-full w-full">
          {children}
        </div>
      </body>
    </html>
  );
}

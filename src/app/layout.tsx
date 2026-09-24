import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Spotted — Social Media for Music",
  description:
    "Letterboxd meets Instagram for music lovers. Connect Spotify, discover what your friends are listening to, and rank your favorite albums and songs.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark antialiased`}>
      <body className="bg-[#09090b] text-[#f4f4f5] selection:bg-[#1ed760] selection:text-black">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

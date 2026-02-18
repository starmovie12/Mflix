import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import TopLoader from "@/components/TopLoader";
import BackToTop from "@/components/BackToTop";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MFLIX - Stream Movies & TV Shows",
  description: "Watch unlimited movies and TV shows on MFLIX. Stream anywhere, anytime.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "MFLIX - Stream Movies & TV Shows",
    description: "Watch unlimited movies and TV shows on MFLIX.",
    type: "website",
    siteName: "MFLIX",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <TopLoader />
        {children}
        <BackToTop />
      </body>
    </html>
  );
}

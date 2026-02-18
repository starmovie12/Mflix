import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { env } from "@/lib/env";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mflix.vercel.app"),
  title: {
    default: `${env.NEXT_PUBLIC_APP_NAME} | Stream Movies & Series`,
    template: `%s | ${env.NEXT_PUBLIC_APP_NAME}`
  },
  description:
    "MFLIX is a premium OTT-style streaming web experience built with Next.js 14, Tailwind CSS, and TMDB.",
  applicationName: env.NEXT_PUBLIC_APP_NAME,
  manifest: "/manifest.json",
  openGraph: {
    title: `${env.NEXT_PUBLIC_APP_NAME} | Stream Movies & Series`,
    description:
      "Discover trending movies and TV series with cinematic UI, smooth motion, and rich title details.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: `${env.NEXT_PUBLIC_APP_NAME} | Stream Movies & Series`,
    description:
      "Discover trending movies and TV series with cinematic UI, smooth motion, and rich title details."
  },
  icons: {
    icon: "/icon-192.svg",
    apple: "/icon-192.svg"
  }
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} bg-pitch font-sans text-white antialiased`}>{children}</body>
    </html>
  );
}

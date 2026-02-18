import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "MFLIX | Stream Movies & Series",
  description: "MFLIX is a production-ready Netflix-inspired movie streaming app built with Next.js.",
  applicationName: "MFLIX",
  manifest: "/manifest.json",
  themeColor: "#050505",
  icons: {
    icon: "/icon-192.svg",
    apple: "/icon-192.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} bg-pitch font-sans text-white antialiased`}>{children}</body>
    </html>
  );
}

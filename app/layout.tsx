import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "MFLIX | Stream Movies & TV Shows",
    template: "%s | MFLIX",
  },
  description:
    "MFLIX is a premium streaming platform featuring thousands of movies and TV shows. Discover, watch, and enjoy cinematic entertainment.",
  applicationName: "MFLIX",
  keywords: ["streaming", "movies", "tv shows", "entertainment", "watch online"],
  authors: [{ name: "MFLIX" }],
  icons: {
    icon: "/icon-192.svg",
    apple: "/icon-192.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    siteName: "MFLIX",
    title: "MFLIX | Stream Movies & TV Shows",
    description: "Your premium streaming destination.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MFLIX",
    description: "Your premium streaming destination.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} bg-pitch font-sans text-white antialiased selection:bg-netflix/30`}
      >
        {children}
      </body>
    </html>
  );
}

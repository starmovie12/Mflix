"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/tv", label: "TV Shows" },
  { href: "/new-popular", label: "New & Popular" },
  { href: "/my-list", label: "My List" }
];

export default function SiteHeader() {
  const [isSolid, setIsSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsSolid(window.scrollY > 24);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        isSolid ? "bg-black/90 shadow-lg backdrop-blur-md" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-6 px-4 md:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-black tracking-[0.22em] text-netflix">
            MFLIX
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-4 text-sm text-zinc-300 md:flex">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-white focus-visible:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <Link
          href="/search"
          aria-label="Go to search page"
          className="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-black/60 px-3 py-2 text-sm text-zinc-200 transition hover:border-zinc-500 hover:text-white"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
        </Link>
      </div>
    </header>
  );
}

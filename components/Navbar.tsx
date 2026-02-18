"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";

const NAV_LINKS = ["Home", "TV Shows", "Movies", "New & Popular", "My List"];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        isScrolled ? "bg-black/95 shadow-lg backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-5 px-4 py-4 md:px-12">
        <div className="flex items-center gap-5">
          <Link href="/" className="text-2xl font-black tracking-wider text-netflix">
            MFLIX
          </Link>

          <nav className="hidden items-center gap-4 text-sm text-zinc-300 md:flex">
            {NAV_LINKS.map((item) => (
              <span key={item} className="cursor-default transition hover:text-white">
                {item}
              </span>
            ))}
          </nav>
        </div>

        <SearchBar />
      </div>
    </header>
  );
}

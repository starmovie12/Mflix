"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Bell, ChevronDown, Menu, X } from "lucide-react";
import { useScrolled } from "@/hooks/useScrolled";
import { cn } from "@/lib/utils";
import SearchOverlay from "./SearchOverlay";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/mylist", label: "My List" },
];

export default function Navbar() {
  const scrolled = useScrolled(50);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-500",
          scrolled ? "bg-background/95 backdrop-blur-md shadow-lg" : "bg-gradient-to-b from-black/80 via-black/40 to-transparent"
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 md:px-12">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-extrabold tracking-tight text-mflix-red md:text-3xl">
                MFLIX
              </span>
            </Link>

            <ul className="hidden items-center gap-5 md:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-mflix-light transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-mflix-light transition-colors hover:text-white"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <button className="hidden text-mflix-light transition-colors hover:text-white md:block" aria-label="Notifications">
              <Bell size={20} />
            </button>

            <div className="hidden items-center gap-2 md:flex">
              <div className="h-8 w-8 rounded bg-mflix-red" />
              <ChevronDown size={16} className="text-mflix-light" />
            </div>

            <button
              className="text-mflix-light md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-background/95 px-4 py-4 backdrop-blur-md md:hidden">
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block text-sm text-mflix-light transition-colors hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}

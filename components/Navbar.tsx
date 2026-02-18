'use client';

import Link from 'next/link';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { motion } from 'framer-motion';
import { Search, Plus, Bell } from 'lucide-react';
import { useState } from 'react';
import { SearchModal } from './SearchModal';

export function Navbar() {
  const isScrolled = useScrollPosition(10);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          backgroundColor: isScrolled ? 'rgba(5,5,5,0.95)' : 'rgba(5,5,5,0)',
          backdropFilter: isScrolled ? 'blur(12px)' : 'blur(0px)',
        }}
        transition={{ duration: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-4"
      >
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="text-2xl md:text-3xl font-bold text-netflix-red tracking-tight">
            MFLIX
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-white hover:text-gray-300 transition">
              Home
            </Link>
            <Link href="/#movies" className="text-sm font-medium text-gray-300 hover:text-white transition">
              Movies
            </Link>
            <Link href="/#series" className="text-sm font-medium text-gray-300 hover:text-white transition">
              Series
            </Link>
            <Link href="/#mylist" className="text-sm font-medium text-gray-300 hover:text-white transition">
              My List
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 text-white hover:text-gray-300 transition"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          <Link
            href="/#mylist"
            className="p-2 text-white hover:text-gray-300 transition"
            aria-label="My List"
          >
            <Plus className="w-5 h-5" />
          </Link>
          <button className="p-2 text-white hover:text-gray-300 transition" aria-label="Notifications">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </motion.header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

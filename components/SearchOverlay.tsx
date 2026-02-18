"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import type { Movie } from "@/lib/types";
import { getImageUrl, getTitle, getYear } from "@/lib/utils";

interface SearchOverlayProps {
  onClose: () => void;
}

export default function SearchOverlay({ onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=aa844700ff3f44363be5bf50f78df0b1&query=${encodeURIComponent(q)}`
      );
      const data = await res.json();
      setResults(
        (data.results || []).filter(
          (r: Movie & { media_type?: string }) =>
            r.media_type !== "person" && (r.poster_path || r.backdrop_path)
        )
      );
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }, []);

  useEffect(() => {
    fetchResults(debouncedQuery);
  }, [debouncedQuery, fetchResults]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-md"
    >
      <div className="mx-auto max-w-5xl px-4 pt-20 md:px-8">
        <div className="flex items-center gap-4 border-b border-white/20 pb-4">
          <Search size={24} className="text-mflix-gray" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, shows..."
            className="flex-1 bg-transparent text-xl text-white outline-none placeholder:text-mflix-gray md:text-2xl"
          />
          <button onClick={onClose} className="text-mflix-gray transition-colors hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="mt-8">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-mflix-red" />
            </div>
          )}

          {!loading && searched && results.length === 0 && (
            <p className="py-20 text-center text-mflix-gray">
              No results found for &quot;{query}&quot;
            </p>
          )}

          <AnimatePresence>
            {!loading && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
              >
                {results.slice(0, 20).map((movie, i) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Link
                      href={`/watch/${movie.id}?type=${movie.media_type || "movie"}`}
                      onClick={onClose}
                      className="group block"
                    >
                      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-mflix-dark">
                        {movie.poster_path ? (
                          <Image
                            src={getImageUrl(movie.poster_path, "medium")}
                            alt={getTitle(movie)}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-mflix-gray">
                            {getTitle(movie)}
                          </div>
                        )}
                      </div>
                      <p className="mt-2 truncate text-sm text-mflix-light group-hover:text-white">
                        {getTitle(movie)}
                      </p>
                      <p className="text-xs text-mflix-gray">{getYear(movie)}</p>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDebounce } from "@/hooks/useDebounce";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import type { Movie } from "@/lib/types";
import { getImageUrl, getTitle, getYear } from "@/lib/utils";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searched, setSearched] = useState(false);
  const debouncedQuery = useDebounce(query, 400);

  const fetchResults = useCallback(async (q: string, p: number) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=aa844700ff3f44363be5bf50f78df0b1&query=${encodeURIComponent(q)}&page=${p}`
      );
      const data = await res.json();
      const filtered = (data.results || []).filter(
        (r: Movie & { media_type?: string }) =>
          r.media_type !== "person"
      );
      if (p === 1) {
        setResults(filtered);
      } else {
        setResults((prev) => [...prev, ...filtered]);
      }
      setTotalPages(data.total_pages || 0);
    } catch {
      if (p === 1) setResults([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchResults(debouncedQuery, 1);
  }, [debouncedQuery, fetchResults]);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchResults(debouncedQuery, nextPage);
  }, [page, debouncedQuery, fetchResults]);

  const { lastElementRef } = useInfiniteScroll(loadMore, page < totalPages);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="px-4 pb-12 pt-24 md:px-12">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-3 rounded-lg bg-mflix-dark px-4 py-3">
            <Search size={20} className="text-mflix-gray" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, shows, and more..."
              className="flex-1 bg-transparent text-lg text-white outline-none placeholder:text-mflix-gray"
              autoFocus
            />
          </div>
        </div>

        <div className="mt-10">
          {loading && results.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-mflix-red" />
            </div>
          )}

          {!loading && searched && results.length === 0 && query.trim() && (
            <p className="py-20 text-center text-mflix-gray">
              No results found for &quot;{query}&quot;
            </p>
          )}

          {results.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {results.map((movie, i) => (
                <Link
                  key={`${movie.id}-${i}`}
                  href={`/watch/${movie.id}?type=${movie.media_type || "movie"}`}
                  className="group"
                  ref={i === results.length - 1 ? lastElementRef : undefined}
                >
                  <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-mflix-dark transition-transform duration-300 group-hover:scale-105">
                    {movie.poster_path ? (
                      <Image
                        src={getImageUrl(movie.poster_path, "medium")}
                        alt={getTitle(movie)}
                        fill
                        className="object-cover"
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
              ))}
            </div>
          )}

          {loading && results.length > 0 && (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="animate-spin text-mflix-red" />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

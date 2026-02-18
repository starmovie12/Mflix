"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import PosterImage from "@/components/PosterImage";
import { useDebounce } from "@/hooks/useDebounce";
import type { TMDBMovie } from "@/types/tmdb";
import { getTitle, getYear, getMediaType } from "@/lib/tmdb/mappers";

interface SearchResponse {
  results: TMDBMovie[];
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TMDBMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
        if (!query) setExpanded(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [query]);

  useEffect(() => {
    const value = debouncedQuery.trim();
    if (value.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(value)}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) return { results: [] } as SearchResponse;
        return res.json() as Promise<SearchResponse>;
      })
      .then((data) => setResults(data.results ?? []))
      .catch((err) => {
        if ((err as Error).name !== "AbortError") setResults([]);
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [debouncedQuery]);

  const handleExpand = () => {
    setExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div ref={wrapperRef} className="relative">
      {!expanded ? (
        <button
          type="button"
          onClick={handleExpand}
          className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition hover:text-white"
          aria-label="Open search"
        >
          <Search className="h-5 w-5" />
        </button>
      ) : (
        <div className="flex w-[240px] items-center gap-2 rounded-md border border-zinc-700 bg-black/80 px-3 py-1.5 backdrop-blur-md sm:w-[280px]">
          <Search className="h-4 w-4 flex-shrink-0 text-zinc-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Titles, people, genres"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
            aria-label="Search"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults([]);
                setOpen(false);
              }}
              className="text-zinc-400 transition hover:text-white"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {open && expanded && debouncedQuery.trim().length >= 2 && (
        <div className="absolute right-0 z-50 mt-2 max-h-[70vh] w-[320px] overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950/98 p-2 shadow-2xl backdrop-blur-md sm:w-[360px]">
          {isLoading && (
            <div className="space-y-2 p-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="skeleton-shimmer h-[54px] w-[38px] flex-shrink-0 rounded" />
                  <div className="flex-1 space-y-1.5">
                    <div className="skeleton-shimmer h-3.5 w-3/4 rounded" />
                    <div className="skeleton-shimmer h-3 w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && results.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-zinc-400">No matches found.</p>
          )}

          {!isLoading &&
            results.slice(0, 10).map((item) => {
              const mediaType = getMediaType(item);
              return (
                <Link
                  key={item.id}
                  href={`/title/${mediaType}/${item.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-zinc-800/70"
                >
                  <PosterImage
                    path={item.poster_path || item.backdrop_path}
                    alt={getTitle(item)}
                    width={76}
                    height={114}
                    size="w185"
                    className="h-[54px] w-[38px] flex-shrink-0 rounded"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium text-white">{getTitle(item)}</p>
                    <p className="text-xs text-zinc-400">
                      {getYear(item)} · {mediaType === "tv" ? "TV Series" : "Movie"}
                    </p>
                  </div>
                </Link>
              );
            })}
        </div>
      )}
    </div>
  );
}

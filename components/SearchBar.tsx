"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import PosterImage from "@/components/PosterImage";
import { useDebounce } from "@/hooks/useDebounce";
import type { TMDBMovie } from "@/lib/types";
import { getDisplayTitle } from "@/lib/tmdb/image";

interface SearchResponse {
  results: TMDBMovie[];
}

function formatMeta(movie: TMDBMovie) {
  const year = (movie.release_date || movie.first_air_date || "").slice(0, 4) || "N/A";
  const score = Number(movie.vote_average ?? 0).toFixed(1);
  return `${year} • ${score}`;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TMDBMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchValue = debouncedQuery.trim();
    if (searchValue.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchValue)}`, {
          signal: controller.signal
        });

        if (!response.ok) {
          setResults([]);
          return;
        }

        const payload = (await response.json()) as SearchResponse;
        setResults(payload.results ?? []);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("[Search] Failed to fetch results", error);
          setResults([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();

    return () => controller.abort();
  }, [debouncedQuery]);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-sm">
      <div className="flex items-center gap-2 rounded-md border border-zinc-700 bg-black/70 px-3 py-2 backdrop-blur-md">
        <Search className="h-4 w-4 text-zinc-400" />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search movies..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
          aria-label="Search movies"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setOpen(false);
            }}
            className="text-zinc-400 transition hover:text-white"
            aria-label="Clear search input"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {open && (query.trim().length >= 2 || isLoading) ? (
        <div className="absolute right-0 z-50 mt-2 max-h-[70vh] w-full overflow-y-auto rounded-md border border-zinc-800 bg-black/95 p-2 shadow-2xl">
          {isLoading ? (
            <p className="px-2 py-4 text-sm text-zinc-400">Searching...</p>
          ) : null}

          {!isLoading && !results.length ? (
            <p className="px-2 py-4 text-sm text-zinc-400">No matches found.</p>
          ) : null}

          {!isLoading
            ? results.slice(0, 10).map((movie) => (
                <Link
                  key={movie.id}
                  href={`/watch/${movie.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-md p-2 transition hover:bg-zinc-900"
                >
                  <PosterImage
                    path={movie.poster_path || movie.backdrop_path}
                    alt={getDisplayTitle(movie)}
                    width={92}
                    height={138}
                    size="w300"
                    className="h-[60px] w-[42px] rounded object-cover"
                  />
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-sm font-medium text-white">{getDisplayTitle(movie)}</p>
                    <p className="text-xs text-zinc-400">{formatMeta(movie)}</p>
                  </div>
                </Link>
              ))
            : null}
        </div>
      ) : null}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import BrowseGrid from "@/components/BrowseGrid";
import EmptyState from "@/components/ui/EmptyState";
import { useDebounce } from "@/hooks/useDebounce";
import type { TMDBMovie } from "@/types/tmdb";

interface SearchResponse {
  results: TMDBMovie[];
}

export default function SearchClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debouncedQuery = useDebounce(query, 350);

  useEffect(() => {
    const value = debouncedQuery.trim();
    if (value.length < 2) {
      setResults([]);
      setSearched(false);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(value)}`, { signal: controller.signal })
      .then((res) => res.json() as Promise<SearchResponse>)
      .then((data) => {
        setResults(data.results ?? []);
        setSearched(true);
      })
      .catch((err) => {
        if ((err as Error).name !== "AbortError") {
          setResults([]);
          setSearched(true);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [debouncedQuery]);

  return (
    <PageShell>
      <main className="min-h-screen pt-20">
        <div className="mx-auto max-w-[1400px] px-4 pb-16 md:px-12">
          <h1 className="text-fluid-3xl font-bold">Search</h1>

          <div className="mt-6 flex items-center gap-3 rounded-xl border border-zinc-700 bg-surface px-4 py-3 transition focus-within:border-zinc-500">
            <Search className="h-5 w-5 flex-shrink-0 text-zinc-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for movies, TV shows, people..."
              className="w-full bg-transparent text-lg text-white outline-none placeholder:text-zinc-500"
              aria-label="Search"
              autoFocus
            />
            {loading && <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />}
            {query && !loading && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  setSearched(false);
                }}
                className="text-zinc-400 transition hover:text-white"
                aria-label="Clear"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="mt-8">
            {!searched && !loading && (
              <EmptyState
                icon={<Search className="h-8 w-8 text-zinc-500" />}
                title="Find your next watch"
                description="Search by title, actor, genre, or keyword."
              />
            )}

            {loading && (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className="skeleton-shimmer aspect-poster rounded-md" />
                ))}
              </div>
            )}

            {searched && !loading && results.length === 0 && (
              <EmptyState
                title="No results found"
                description={`We couldn't find anything matching "${query}". Try different keywords.`}
              />
            )}

            {searched && !loading && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="mb-4 text-sm text-zinc-400">
                  Found {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{debouncedQuery}&rdquo;
                </p>
                <BrowseGrid items={results} />
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </PageShell>
  );
}

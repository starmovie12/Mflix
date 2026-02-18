"use client";

import { useState, useEffect, useCallback } from "react";
import type { Movie } from "@/lib/types";

const WATCHLIST_KEY = "mflix-watchlist";

function getStoredWatchlist(): Movie[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(WATCHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setWatchlist(getStoredWatchlist());
    setMounted(true);
  }, []);

  const persist = useCallback((items: Movie[]) => {
    try {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items));
    } catch {
      /* storage full */
    }
  }, []);

  const addToWatchlist = useCallback(
    (movie: Movie) => {
      setWatchlist((prev) => {
        if (prev.some((m) => m.id === movie.id)) return prev;
        const next = [movie, ...prev];
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const removeFromWatchlist = useCallback(
    (movieId: number) => {
      setWatchlist((prev) => {
        const next = prev.filter((m) => m.id !== movieId);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const isInWatchlist = useCallback(
    (movieId: number) => watchlist.some((m) => m.id === movieId),
    [watchlist]
  );

  const toggleWatchlist = useCallback(
    (movie: Movie) => {
      if (isInWatchlist(movie.id)) {
        removeFromWatchlist(movie.id);
      } else {
        addToWatchlist(movie);
      }
    },
    [isInWatchlist, removeFromWatchlist, addToWatchlist]
  );

  return {
    watchlist,
    mounted,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
  };
}

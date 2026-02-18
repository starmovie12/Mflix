"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { MediaType, TitleSummary } from "@/lib/tmdb";

const STORAGE_KEY = "mflix_watchlist";

type WatchlistItem = TitleSummary;

function isValidMediaType(value: unknown): value is MediaType {
  return value === "movie" || value === "tv";
}

function isValidWatchlist(value: unknown): value is WatchlistItem[] {
  return (
    Array.isArray(value) &&
    value.every(
      (movie) =>
        movie &&
        typeof movie === "object" &&
        "id" in movie &&
        typeof (movie as WatchlistItem).id === "number" &&
        "mediaType" in movie &&
        isValidMediaType((movie as WatchlistItem).mediaType)
    )
  );
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setHydrated(true);
        return;
      }

      const parsed = JSON.parse(raw) as unknown;
      if (isValidWatchlist(parsed)) {
        setWatchlist(parsed);
      }
    } catch (error) {
      console.error("[Watchlist] Unable to parse localStorage value", error);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
    } catch (error) {
      console.error("[Watchlist] Unable to persist localStorage value", error);
    }
  }, [watchlist, hydrated]);

  const watchlistIds = useMemo(() => new Set(watchlist.map((movie) => movie.id)), [watchlist]);

  const isInWatchlist = useCallback((movieId: number) => watchlistIds.has(movieId), [watchlistIds]);

  const toggleWatchlist = useCallback((movie: TitleSummary) => {
    setWatchlist((previous) => {
      if (previous.some((item) => item.id === movie.id)) {
        return previous.filter((item) => item.id !== movie.id);
      }

      return [movie, ...previous];
    });
  }, []);

  return {
    watchlist,
    watchlistIds,
    hydrated,
    isInWatchlist,
    toggleWatchlist
  };
}

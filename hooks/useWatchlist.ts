"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { TMDBMovie, WatchlistMovie } from "@/lib/types";
import { getMovieTitle } from "@/lib/tmdb";

const STORAGE_KEY = "mflix_watchlist";

function toWatchlistMovie(movie: TMDBMovie): WatchlistMovie {
  return {
    id: movie.id,
    title: getMovieTitle(movie),
    overview: movie.overview ?? "",
    poster_path: movie.poster_path ?? null,
    backdrop_path: movie.backdrop_path ?? null,
    vote_average: movie.vote_average ?? 0,
    release_date: movie.release_date ?? movie.first_air_date ?? ""
  };
}

function isValidWatchlist(value: unknown): value is WatchlistMovie[] {
  return (
    Array.isArray(value) &&
    value.every(
      (movie) =>
        movie &&
        typeof movie === "object" &&
        "id" in movie &&
        typeof (movie as WatchlistMovie).id === "number"
    )
  );
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistMovie[]>([]);
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

  const toggleWatchlist = useCallback((movie: TMDBMovie) => {
    setWatchlist((previous) => {
      if (previous.some((item) => item.id === movie.id)) {
        return previous.filter((item) => item.id !== movie.id);
      }

      return [toWatchlistMovie(movie), ...previous];
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

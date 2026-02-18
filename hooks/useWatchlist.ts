'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Movie } from '@/lib/tmdb';

const WATCHLIST_KEY = 'mflix-watchlist';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      const raw = localStorage.getItem(WATCHLIST_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setWatchlist(Array.isArray(parsed) ? parsed : []);
    } catch {
      setWatchlist([]);
    }
  }, [mounted]);

  const persist = useCallback((items: Movie[]) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items));
      setWatchlist(items);
    } catch {
      setWatchlist(items);
    }
  }, []);

  const add = useCallback(
    (movie: Movie) => {
      const exists = watchlist.some((m) => m.id === movie.id);
      if (exists) return;
      persist([...watchlist, movie]);
    },
    [watchlist, persist]
  );

  const remove = useCallback(
    (id: number) => {
      persist(watchlist.filter((m) => m.id !== id));
    },
    [watchlist, persist]
  );

  const toggle = useCallback(
    (movie: Movie) => {
      const exists = watchlist.some((m) => m.id === movie.id);
      if (exists) remove(movie.id);
      else add(movie);
    },
    [watchlist, add, remove]
  );

  const has = useCallback(
    (id: number) => watchlist.some((m) => m.id === id),
    [watchlist]
  );

  return { watchlist, add, remove, toggle, has, mounted };
}

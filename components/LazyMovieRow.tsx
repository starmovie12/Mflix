'use client';

import { useRef, useState, useEffect } from 'react';
import { MovieRow } from './MovieRow';
import { Skeleton } from './Skeleton';
import type { Movie } from '@/lib/tmdb';

interface LazyMovieRowProps {
  title: string;
  fetchUrl: string;
  id?: string;
}

export function LazyMovieRow({ title, fetchUrl, id }: LazyMovieRowProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasFetched) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || hasFetched) return;
        setHasFetched(true);
        fetch(fetchUrl)
          .then((r) => r.json())
          .then((data) => setMovies(data.results ?? []))
          .catch(() => setMovies([]))
          .finally(() => setLoading(false));
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchUrl, hasFetched]);

  if (!hasFetched) {
    return (
      <div ref={ref} className="space-y-3">
        <Skeleton variant="text" className="w-32 h-6" />
        <Skeleton variant="row" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton variant="text" className="w-32 h-6" />
        <Skeleton variant="row" />
      </div>
    );
  }

  return <MovieRow title={title} movies={movies} id={id} />;
}

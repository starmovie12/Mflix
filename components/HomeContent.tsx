'use client';

import { useState, useEffect } from 'react';
import { MovieRow } from './MovieRow';
import { LazyMovieRow } from './LazyMovieRow';
import { RowSkeleton } from './Skeleton';
import { useWatchlist } from '@/hooks/useWatchlist';
import type { Movie } from '@/lib/tmdb';

const ROW_CONFIG = [
  { key: 'trending', title: 'Trending Now', url: '/api/trending', id: 'movies' },
  { key: 'topRated', title: 'Top Rated', url: '/api/top-rated' },
  { key: 'action', title: 'Action', url: '/api/genre/28' },
  { key: 'comedy', title: 'Comedy', url: '/api/genre/35' },
  { key: 'horror', title: 'Horror', url: '/api/genre/27' },
  { key: 'romance', title: 'Romance', url: '/api/genre/10749' },
  { key: 'docs', title: 'Documentaries', url: '/api/genre/99', id: 'series' },
];

async function fetchInitial() {
  const [trending, topRated] = await Promise.all([
    fetch('/api/trending').then((r) => r.json()),
    fetch('/api/top-rated').then((r) => r.json()),
  ]);
  return {
    trending: trending.results ?? [],
    topRated: topRated.results ?? [],
  };
}

export function HomeContent() {
  const [initial, setInitial] = useState<{ trending: Movie[]; topRated: Movie[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const { watchlist, mounted } = useWatchlist();

  useEffect(() => {
    fetchInitial()
      .then(setInitial)
      .catch(() => setInitial({ trending: [], topRated: [] }))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !initial) return <RowSkeleton count={5} />;

  return (
    <div className="space-y-10 pt-4">
      {initial.trending.length > 0 && (
        <MovieRow title="Trending Now" movies={initial.trending} id="movies" />
      )}
      {initial.topRated.length > 0 && (
        <MovieRow title="Top Rated" movies={initial.topRated} />
      )}
      {mounted && watchlist.length > 0 && (
        <MovieRow title="My List" movies={watchlist} id="mylist" />
      )}
      <LazyMovieRow title="Action" fetchUrl="/api/genre/28" />
      <LazyMovieRow title="Comedy" fetchUrl="/api/genre/35" />
      <LazyMovieRow title="Horror" fetchUrl="/api/genre/27" />
      <LazyMovieRow title="Romance" fetchUrl="/api/genre/10749" />
      <LazyMovieRow title="Documentaries" fetchUrl="/api/genre/99" id="series" />
    </div>
  );
}

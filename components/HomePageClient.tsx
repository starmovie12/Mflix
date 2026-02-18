"use client";

import { useMemo } from "react";
import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import Navbar from "@/components/Navbar";
import Skeleton from "@/components/Skeleton";
import { useWatchlist } from "@/hooks/useWatchlist";
import type { HeroMovie, MovieRowData, TMDBMovie } from "@/lib/types";

interface HomePageClientProps {
  heroMovie: HeroMovie | null;
  rows: MovieRowData[];
}

function toWatchlistAsMovies(watchlist: Array<{
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
}>): TMDBMovie[] {
  return watchlist.map((movie) => ({
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    vote_average: movie.vote_average,
    release_date: movie.release_date
  }));
}

export default function HomePageClient({ heroMovie, rows }: HomePageClientProps) {
  const { watchlist, watchlistIds, toggleWatchlist, hydrated } = useWatchlist();
  const myList = useMemo(() => toWatchlistAsMovies(watchlist), [watchlist]);

  return (
    <div className="min-h-screen bg-pitch text-white">
      <Navbar />
      <Hero movie={heroMovie} />

      <main className="-mt-20 space-y-10 pb-16">
        {!hydrated ? <Skeleton cards={10} /> : null}

        {hydrated && myList.length > 0 ? (
          <MovieRow
            title="My List"
            movies={myList}
            watchlistIds={watchlistIds}
            onToggleWatchlist={toggleWatchlist}
          />
        ) : null}

        {rows.map((row) => (
          <MovieRow
            key={row.id}
            title={row.title}
            movies={row.movies}
            watchlistIds={watchlistIds}
            onToggleWatchlist={toggleWatchlist}
          />
        ))}
      </main>
    </div>
  );
}

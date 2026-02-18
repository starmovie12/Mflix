"use client";

import { useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TitleSummary } from "@/lib/tmdb";
import { useInfiniteVisibleCount } from "@/hooks/useInfiniteVisibleCount";
import MovieCard from "@/components/MovieCard";

interface MovieRowProps {
  title: string;
  movies: TitleSummary[];
  watchlistIds: Set<number>;
  onToggleWatchlist: (movie: TitleSummary) => void;
}

export default function MovieRow({ title, movies, watchlistIds, onToggleWatchlist }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const { visibleCount, setSentinel } = useInfiniteVisibleCount({
    total: movies.length,
    initial: 10,
    step: 8
  });

  const visibleMovies = useMemo(() => movies.slice(0, visibleCount), [movies, visibleCount]);

  if (!movies.length) {
    return null;
  }

  return (
    <section className="space-y-4 px-4 md:px-12">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => rowRef.current?.scrollBy({ left: -500, behavior: "smooth" })}
            aria-label={`Scroll ${title} left`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900/90 text-zinc-100 transition hover:bg-zinc-700"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => rowRef.current?.scrollBy({ left: 500, behavior: "smooth" })}
            aria-label={`Scroll ${title} right`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900/90 text-zinc-100 transition hover:bg-zinc-700"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div ref={rowRef} className="row-scroll flex gap-3 overflow-x-auto pb-4">
        {visibleMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            inWatchlist={watchlistIds.has(movie.id)}
            onToggleWatchlist={onToggleWatchlist}
          />
        ))}
      </div>

      {visibleCount < movies.length ? <div ref={setSentinel} className="h-px w-full" /> : null}
    </section>
  );
}

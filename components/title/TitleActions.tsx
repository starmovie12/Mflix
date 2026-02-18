"use client";

import Link from "next/link";
import { Check, ListPlus, Play, Youtube } from "lucide-react";
import { useWatchlist } from "@/hooks/useWatchlist";
import type { TMDBMediaType, TMDBMovie } from "@/lib/types";
import { getMovieTitle } from "@/lib/tmdb";

interface TitleActionsProps {
  mediaType: TMDBMediaType;
  movie: TMDBMovie;
  trailerKey: string | null;
}

export default function TitleActions({ mediaType, movie, trailerKey }: TitleActionsProps) {
  const { watchlistIds, toggleWatchlist, hydrated } = useWatchlist();
  const inWatchlist = watchlistIds.has(movie.id);

  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href={`/watch/${mediaType}/${movie.id}`}
        className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
      >
        <Play className="h-4 w-4 fill-black" />
        Play
      </Link>

      <button
        type="button"
        onClick={() => toggleWatchlist(movie)}
        className="inline-flex items-center gap-2 rounded-md bg-zinc-700/70 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-600/80"
        aria-label={inWatchlist ? `Remove ${getMovieTitle(movie)} from My List` : `Add ${getMovieTitle(movie)} to My List`}
      >
        {hydrated && inWatchlist ? <Check className="h-4 w-4" /> : <ListPlus className="h-4 w-4" />}
        {hydrated && inWatchlist ? "Added" : "My List"}
      </button>

      {trailerKey ? (
        <a
          href={`https://www.youtube.com/watch?v=${trailerKey}`}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2 rounded-md bg-netflix px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
        >
          <Youtube className="h-4 w-4" />
          Trailer
        </a>
      ) : null}
    </div>
  );
}

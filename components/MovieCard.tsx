"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Plus, Star } from "lucide-react";
import type { TMDBMovie } from "@/lib/types";
import { getMovieTitle } from "@/lib/tmdb";
import PosterImage from "@/components/PosterImage";

interface MovieCardProps {
  movie: TMDBMovie;
  inWatchlist: boolean;
  onToggleWatchlist: (movie: TMDBMovie) => void;
}

function formatYear(movie: TMDBMovie) {
  const date = movie.release_date || movie.first_air_date;
  if (!date) return "N/A";
  return date.slice(0, 4);
}

export default function MovieCard({ movie, inWatchlist, onToggleWatchlist }: MovieCardProps) {
  const title = getMovieTitle(movie);
  const rating = Number(movie.vote_average ?? 0).toFixed(1);
  const year = formatYear(movie);

  return (
    <motion.article
      layout
      whileHover={{ scale: 1.1, zIndex: 25 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="group relative w-[128px] flex-none overflow-visible sm:w-[145px] md:w-[165px]"
    >
      <div className="relative overflow-hidden rounded-md shadow-card">
        <Link
          href={`/title/${(movie.media_type === "tv" ? "tv" : "movie")}/${movie.id}`}
          className="block"
        >
          <PosterImage
            path={movie.poster_path || movie.backdrop_path}
            alt={title}
            width={330}
            height={495}
            size="w500"
            className="h-[180px] w-full object-cover sm:h-[205px] md:h-[235px]"
          />
        </Link>

        <button
          type="button"
          onClick={() => onToggleWatchlist(movie)}
          className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/75 text-white transition hover:bg-netflix"
          aria-label={inWatchlist ? `Remove ${title} from watchlist` : `Add ${title} to watchlist`}
        >
          {inWatchlist ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </button>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 rounded-b-md bg-gradient-to-t from-black/95 via-black/75 to-transparent p-3 opacity-0 transition duration-200 group-hover:opacity-100">
        <p className="line-clamp-1 text-sm font-semibold">{title}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-zinc-300">
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-netflix text-netflix" />
            {rating}
          </span>
          <span>{year}</span>
        </div>
      </div>
    </motion.article>
  );
}

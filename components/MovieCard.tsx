"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Plus, Play, Star } from "lucide-react";
import type { TMDBMovie, WatchlistItem } from "@/types/tmdb";
import { getTitle, getYear, getMediaType, tmdbImage } from "@/lib/tmdb/mappers";
import { useWatchlistStore } from "@/lib/store";
import PosterImage from "@/components/PosterImage";

interface MovieCardProps {
  movie: TMDBMovie;
  index?: number;
  variant?: "poster" | "backdrop" | "top10";
}

function toWatchlistItem(movie: TMDBMovie): WatchlistItem {
  return {
    id: movie.id,
    title: getTitle(movie),
    overview: movie.overview ?? "",
    posterPath: movie.poster_path,
    backdropPath: movie.backdrop_path,
    rating: movie.vote_average ?? 0,
    year: getYear(movie),
    mediaType: getMediaType(movie),
    addedAt: Date.now(),
  };
}

export default function MovieCard({ movie, index, variant = "poster" }: MovieCardProps) {
  const title = getTitle(movie);
  const year = getYear(movie);
  const rating = (movie.vote_average ?? 0).toFixed(1);
  const mediaType = getMediaType(movie);
  const toggle = useWatchlistStore((s) => s.toggle);
  const isInList = useWatchlistStore((s) => s.isInList(movie.id));
  const href = `/title/${mediaType}/${movie.id}`;

  if (variant === "top10" && index !== undefined) {
    return (
      <motion.article
        whileHover={{ scale: 1.05, zIndex: 25 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="group relative flex flex-none items-end"
      >
        <span className="select-none text-[8rem] font-black leading-none text-zinc-800/80 sm:text-[10rem]">
          {index + 1}
        </span>
        <Link href={href} className="-ml-8 block w-[120px] sm:w-[140px]">
          <PosterImage
            path={movie.poster_path}
            alt={title}
            width={280}
            height={420}
            size="w342"
            className="rounded-md shadow-card"
            sizes="140px"
          />
        </Link>
      </motion.article>
    );
  }

  if (variant === "backdrop") {
    return (
      <motion.article
        whileHover={{ scale: 1.05, zIndex: 25 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="group relative w-[260px] flex-none overflow-visible sm:w-[300px] md:w-[340px]"
      >
        <Link href={href} className="block">
          <div className="relative overflow-hidden rounded-md shadow-card">
            <PosterImage
              path={movie.backdrop_path || movie.poster_path}
              alt={title}
              width={680}
              height={383}
              size="w780"
              className="aspect-backdrop"
              sizes="(max-width: 640px) 260px, (max-width: 768px) 300px, 340px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 transition duration-300 group-hover:opacity-100">
              <p className="line-clamp-1 text-sm font-semibold">{title}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-zinc-300">
                <Star className="h-3 w-3 fill-netflix text-netflix" />
                <span>{rating}</span>
                <span className="text-zinc-500">·</span>
                <span>{year}</span>
              </div>
            </div>
          </div>
        </Link>
        <CardActions isInList={isInList} onToggle={() => toggle(toWatchlistItem(movie))} title={title} href={href} />
      </motion.article>
    );
  }

  return (
    <motion.article
      whileHover={{ scale: 1.08, zIndex: 25 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative w-[128px] flex-none overflow-visible sm:w-[145px] md:w-[165px]"
    >
      <Link href={href} className="block">
        <div className="relative overflow-hidden rounded-md shadow-card">
          <PosterImage
            path={movie.poster_path || movie.backdrop_path}
            alt={title}
            width={330}
            height={495}
            size="w342"
            className="aspect-poster"
            sizes="(max-width: 640px) 128px, (max-width: 768px) 145px, 165px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
          <div className="absolute bottom-0 left-0 right-0 p-2.5 opacity-0 transition duration-300 group-hover:opacity-100">
            <p className="line-clamp-1 text-xs font-semibold sm:text-sm">{title}</p>
            <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-zinc-300 sm:text-xs">
              <Star className="h-2.5 w-2.5 fill-netflix text-netflix sm:h-3 sm:w-3" />
              <span>{rating}</span>
              <span>{year}</span>
            </div>
          </div>
        </div>
      </Link>
      <CardActions isInList={isInList} onToggle={() => toggle(toWatchlistItem(movie))} title={title} href={href} />
    </motion.article>
  );
}

function CardActions({
  isInList,
  onToggle,
  title,
  href,
}: {
  isInList: boolean;
  onToggle: () => void;
  title: string;
  href: string;
}) {
  return (
    <div className="absolute right-1.5 top-1.5 z-20 flex flex-col gap-1 opacity-0 transition duration-200 group-hover:opacity-100">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle();
        }}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-black/80 text-white ring-1 ring-white/20 transition hover:bg-netflix hover:ring-netflix"
        aria-label={isInList ? `Remove ${title} from My List` : `Add ${title} to My List`}
      >
        {isInList ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
      </button>
      <Link
        href={href.replace("/title/", "/watch/").replace(/\/(?:movie|tv)\//, "/")}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-black/80 text-white ring-1 ring-white/20 transition hover:bg-white hover:text-black hover:ring-white"
        aria-label={`Play ${title}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Play className="h-3 w-3 fill-current" />
      </Link>
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Plus, ThumbsUp, ChevronDown, Check } from "lucide-react";
import type { Movie } from "@/lib/types";
import { getImageUrl, getBackdropUrl, getTitle, getYear, getGenreNames, formatVoteAverage, cn } from "@/lib/utils";
import { useWatchlist } from "@/hooks/useWatchlist";

interface MovieCardProps {
  movie: Movie;
  isLarge?: boolean;
  index?: number;
}

export default function MovieCard({ movie, isLarge = false, index = 0 }: MovieCardProps) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const inList = isInWatchlist(movie.id);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setHovered(true), 400);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHovered(false);
  };

  const imageSrc = isLarge
    ? imgError ? "" : getImageUrl(movie.poster_path, "large")
    : imgError ? "" : getBackdropUrl(movie.backdrop_path, "small");

  const title = getTitle(movie);
  const year = getYear(movie);
  const genres = getGenreNames(movie.genre_ids);
  const rating = formatVoteAverage(movie.vote_average);
  const matchPercent = Math.min(99, Math.round(movie.vote_average * 10));

  return (
    <div
      className={cn(
        "group relative flex-shrink-0 cursor-pointer",
        isLarge ? "w-[170px] md:w-[270px]" : "w-[250px] md:w-[300px]"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <Link href={`/watch/${movie.id}?type=${movie.media_type || "movie"}`}>
        <div
          className={cn(
            "relative overflow-hidden rounded-md transition-transform duration-300 group-hover:scale-105",
            isLarge ? "aspect-[2/3]" : "aspect-video"
          )}
        >
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={title}
              fill
              sizes={isLarge ? "(max-width: 768px) 170px, 270px" : "(max-width: 768px) 250px, 300px"}
              className="object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-mflix-dark text-sm text-mflix-gray">
              {title}
            </div>
          )}
        </div>
      </Link>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute -left-4 top-0 z-30 hidden w-[320px] overflow-hidden rounded-lg bg-mflix-dark shadow-2xl shadow-black/80 md:block"
          >
            <Link href={`/watch/${movie.id}?type=${movie.media_type || "movie"}`}>
              <div className="relative aspect-video w-full">
                {movie.backdrop_path ? (
                  <Image
                    src={getBackdropUrl(movie.backdrop_path, "small")}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-mflix-dark text-mflix-gray">
                    {title}
                  </div>
                )}
              </div>
            </Link>

            <div className="p-4">
              <div className="mb-3 flex items-center gap-2">
                <Link
                  href={`/watch/${movie.id}?type=${movie.media_type || "movie"}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-110"
                >
                  <Play size={16} fill="black" />
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWatchlist(movie);
                  }}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all hover:scale-110",
                    inList ? "border-white bg-white/20" : "border-mflix-gray/60 hover:border-white"
                  )}
                >
                  {inList ? <Check size={16} /> : <Plus size={16} />}
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-mflix-gray/60 transition-all hover:scale-110 hover:border-white">
                  <ThumbsUp size={16} />
                </button>
                <Link
                  href={`/watch/${movie.id}?type=${movie.media_type || "movie"}`}
                  className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border-2 border-mflix-gray/60 transition-all hover:scale-110 hover:border-white"
                >
                  <ChevronDown size={16} />
                </Link>
              </div>

              <div className="mb-2 flex items-center gap-2 text-sm">
                <span className="font-semibold text-green-400">{matchPercent}% Match</span>
                {year && <span className="text-mflix-gray">{year}</span>}
                <span className="rounded border border-mflix-gray/40 px-1.5 py-0.5 text-xs text-mflix-gray">
                  {rating}
                </span>
              </div>

              {genres.length > 0 && (
                <div className="flex flex-wrap gap-1 text-xs text-mflix-light">
                  {genres.map((g, i) => (
                    <span key={g}>
                      {g}
                      {i < genres.length - 1 && <span className="mx-1 text-mflix-gray">&bull;</span>}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

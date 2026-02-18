"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Info, Play } from "lucide-react";
import type { HeroMovie } from "@/lib/types";
import { getImageUrl, getMovieTitle } from "@/lib/tmdb";

interface HeroProps {
  movie: HeroMovie | null;
}

export default function Hero({ movie }: HeroProps) {
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    if (!movie?.trailerKey) {
      setShowTrailer(false);
      return;
    }

    const timeout = window.setTimeout(() => setShowTrailer(true), 3000);
    return () => window.clearTimeout(timeout);
  }, [movie?.id, movie?.trailerKey]);

  const backgroundImage = useMemo(() => {
    if (!movie) return "/placeholder.svg";
    return getImageUrl(movie.backdrop_path || movie.poster_path, "original");
  }, [movie]);

  const trailerUrl = movie?.trailerKey
    ? `https://www.youtube.com/embed/${movie.trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${movie.trailerKey}&modestbranding=1&rel=0`
    : null;

  if (!movie) {
    return (
      <section className="relative h-[75vh] w-full overflow-hidden bg-pitch">
        <div className="absolute inset-0 skeleton-shimmer" />
      </section>
    );
  }

  return (
    <section className="relative h-[82vh] min-h-[620px] w-full overflow-hidden bg-pitch">
      <div className="absolute inset-0">
        {showTrailer && trailerUrl ? (
          <iframe
            src={trailerUrl}
            title={`${getMovieTitle(movie)} trailer`}
            className="h-full w-full scale-[1.35] object-cover"
            allow="autoplay; fullscreen; encrypted-media"
          />
        ) : (
          <div
            className="h-full w-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImage})`
            }}
          />
        )}
      </div>

      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-pitch to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 flex h-full max-w-2xl flex-col justify-end gap-5 px-4 pb-24 pt-32 md:px-12"
      >
        <h1 className="text-balance text-4xl font-bold sm:text-5xl md:text-6xl">{getMovieTitle(movie)}</h1>
        <p className="line-clamp-3 max-w-2xl text-sm text-zinc-100 sm:text-base">{movie.overview || "Now streaming on MFLIX."}</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/watch/${movie.id}`}
            className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            <Play className="h-4 w-4 fill-black" />
            Play
          </Link>
          <Link
            href={`/watch/${movie.id}`}
            className="inline-flex items-center gap-2 rounded-md bg-zinc-600/70 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-500/80"
          >
            <Info className="h-4 w-4" />
            More Info
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

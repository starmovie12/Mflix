"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, Volume2, VolumeX } from "lucide-react";
import type { Movie } from "@/lib/types";
import { getBackdropUrl, getTitle } from "@/lib/utils";

interface HeroProps {
  movie: Movie;
  trailerKey?: string | null;
}

export default function Hero({ movie, trailerKey }: HeroProps) {
  const [showTrailer, setShowTrailer] = useState(false);
  const [muted, setMuted] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  const title = getTitle(movie);
  const backdropUrl = getBackdropUrl(movie.backdrop_path, "original");

  useEffect(() => {
    if (!trailerKey) return;
    const timer = setTimeout(() => setShowTrailer(true), 3000);
    return () => clearTimeout(timer);
  }, [trailerKey]);

  return (
    <div className="relative h-[70vh] w-full overflow-hidden md:h-[85vh]">
      <AnimatePresence mode="wait">
        {showTrailer && trailerKey ? (
          <motion.div
            key="trailer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&showinfo=0&rel=0&loop=1&playlist=${trailerKey}&modestbranding=1&iv_load_policy=3`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="pointer-events-none absolute inset-0 h-[120%] w-[120%] -translate-x-[8%] -translate-y-[8%] scale-110 object-cover"
              title="Trailer"
            />
          </motion.div>
        ) : (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoaded ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <Image
              src={backdropUrl}
              alt={title}
              fill
              priority
              className="object-cover object-top"
              onLoad={() => setImageLoaded(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

      <div className="absolute bottom-[12%] left-4 z-10 max-w-2xl space-y-4 md:bottom-[15%] md:left-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-shadow text-3xl font-extrabold leading-tight md:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-shadow line-clamp-3 text-sm text-mflix-light/90 md:text-base lg:text-lg"
        >
          {movie.overview}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex items-center gap-3 pt-2"
        >
          <Link
            href={`/watch/${movie.id}?type=${movie.media_type || "movie"}`}
            className="flex items-center gap-2 rounded bg-white px-6 py-2.5 text-sm font-bold text-black transition-all hover:bg-white/80 md:px-8 md:py-3 md:text-base"
          >
            <Play size={20} fill="black" />
            Play
          </Link>
          <Link
            href={`/watch/${movie.id}?type=${movie.media_type || "movie"}`}
            className="flex items-center gap-2 rounded bg-white/20 px-6 py-2.5 text-sm font-semibold backdrop-blur-sm transition-all hover:bg-white/30 md:px-8 md:py-3 md:text-base"
          >
            <Info size={20} />
            More Info
          </Link>
        </motion.div>
      </div>

      {showTrailer && trailerKey && (
        <button
          onClick={() => setMuted(!muted)}
          className="absolute bottom-[12%] right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 transition-all hover:border-white md:bottom-[15%] md:right-12"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}
    </div>
  );
}

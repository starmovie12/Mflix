"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Info, Play } from "lucide-react";
import type { HomePageData } from "@/lib/tmdb";
import { getTmdbImageUrl } from "@/lib/tmdb";

interface HeroProps {
  title: HomePageData["hero"];
  tmdbEnabled: boolean;
}

export default function Hero({ title, tmdbEnabled }: HeroProps) {
  const [showTrailer, setShowTrailer] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!title?.trailerKey || reduceMotion) {
      setShowTrailer(false);
      return;
    }

    const timeout = window.setTimeout(() => setShowTrailer(true), 3000);
    return () => window.clearTimeout(timeout);
  }, [reduceMotion, title?.id, title?.trailerKey]);

  const backgroundImage = useMemo(() => {
    if (!title) return "/placeholder.svg";
    return getTmdbImageUrl(title.backdropPath || title.posterPath, "original");
  }, [title]);

  const trailerUrl = title?.trailerKey
    ? `https://www.youtube.com/embed/${title.trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${title.trailerKey}&modestbranding=1&rel=0`
    : null;

  if (!title) {
    return (
      <section className="relative h-[75vh] w-full overflow-hidden bg-pitch">
        <div className="absolute inset-0 skeleton-shimmer" />
        {!tmdbEnabled ? (
          <div className="absolute inset-x-0 bottom-0 z-10 mx-auto w-full max-w-[980px] px-4 pb-12 md:px-12">
            <div className="rounded-lg border border-netflix/40 bg-black/70 p-4 text-sm text-zinc-200 backdrop-blur">
              <p className="font-semibold text-white">TMDB is not connected.</p>
              <p className="mt-1 text-zinc-300">
                Add <span className="font-mono text-zinc-100">TMDB_API_KEY</span> to <span className="font-mono text-zinc-100">.env.local</span>{" "}
                to unlock the full catalog.
              </p>
            </div>
          </div>
        ) : null}
      </section>
    );
  }

  return (
    <section className="relative h-[82vh] min-h-[620px] w-full overflow-hidden bg-pitch">
      <div className="absolute inset-0">
        {showTrailer && trailerUrl ? (
          <iframe
            src={trailerUrl}
            title={`${title.title} trailer`}
            className="h-full w-full scale-[1.35] object-cover"
            allow="autoplay; fullscreen; encrypted-media"
            referrerPolicy="strict-origin-when-cross-origin"
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
        initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 flex h-full max-w-2xl flex-col justify-end gap-5 px-4 pb-24 pt-32 md:px-12"
      >
        <h1 className="text-balance text-4xl font-bold sm:text-5xl md:text-6xl">{title.title}</h1>
        <p className="line-clamp-3 max-w-2xl text-sm text-zinc-100 sm:text-base">{title.overview || "Now streaming on MFLIX."}</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/title/${title.mediaType}/${title.id}?play=trailer`}
            className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            <Play className="h-4 w-4 fill-black" />
            Play Trailer
          </Link>
          <Link
            href={`/title/${title.mediaType}/${title.id}`}
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

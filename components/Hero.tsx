"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Info, Play, Volume2, VolumeX } from "lucide-react";
import type { HeroContent } from "@/types/tmdb";
import { getYouTubeEmbedUrl } from "@/lib/tmdb/mappers";
import Badge from "@/components/ui/Badge";

interface HeroProps {
  hero: HeroContent | null;
}

export default function Hero({ hero }: HeroProps) {
  const [showTrailer, setShowTrailer] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (!hero?.trailerKey) {
      setShowTrailer(false);
      return;
    }
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const timeout = setTimeout(() => setShowTrailer(true), 3500);
    return () => clearTimeout(timeout);
  }, [hero?.id, hero?.trailerKey]);

  if (!hero) {
    return (
      <section className="relative h-[80vh] min-h-[550px] w-full overflow-hidden bg-pitch" aria-label="Featured content loading">
        <div className="skeleton-shimmer absolute inset-0" />
      </section>
    );
  }

  const trailerUrl = hero.trailerKey
    ? getYouTubeEmbedUrl(hero.trailerKey) + `&mute=${muted ? 1 : 0}`
    : null;

  return (
    <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-pitch" aria-label="Featured content">
      <div className="absolute inset-0">
        {showTrailer && trailerUrl ? (
          <iframe
            src={trailerUrl}
            title={`${hero.title} trailer`}
            className="pointer-events-none h-full w-full scale-[1.35] object-cover"
            allow="autoplay; fullscreen; encrypted-media"
            tabIndex={-1}
          />
        ) : (
          <Image
            src={hero.backdropUrl}
            alt={hero.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}
      </div>

      <div className="absolute inset-0 bg-hero-vignette" />
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-pitch to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex h-full max-w-3xl flex-col justify-end gap-5 px-4 pb-28 pt-32 md:px-12"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="netflix">MFLIX Original</Badge>
          {hero.rating > 0 && (
            <Badge variant="success">{hero.rating}% Match</Badge>
          )}
          {hero.year && <Badge variant="outline">{hero.year}</Badge>}
        </div>

        <h1 className="text-fluid-4xl font-bold leading-tight drop-shadow-lg" style={{ textWrap: "balance" } as React.CSSProperties}>
          {hero.title}
        </h1>

        <p className="line-clamp-3 max-w-2xl text-fluid-base leading-relaxed text-zinc-200 drop-shadow-md">
          {hero.overview || "Now streaming exclusively on MFLIX."}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/watch/${hero.id}`}
            className="inline-flex items-center gap-2 rounded-md bg-white px-7 py-3 text-sm font-bold text-black transition hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-white"
          >
            <Play className="h-5 w-5 fill-black" />
            Play
          </Link>
          <Link
            href={`/title/${hero.mediaType}/${hero.id}`}
            className="inline-flex items-center gap-2 rounded-md bg-zinc-600/60 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-zinc-500/70"
          >
            <Info className="h-5 w-5" />
            More Info
          </Link>
        </div>
      </motion.div>

      {showTrailer && hero.trailerKey && (
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          className="absolute bottom-32 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-500 bg-black/50 text-white transition hover:bg-black/70 md:right-12"
          aria-label={muted ? "Unmute trailer" : "Mute trailer"}
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      )}
    </section>
  );
}

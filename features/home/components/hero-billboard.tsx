"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Info, Play } from "lucide-react";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import type { FeaturedMedia } from "@/types/media";
import { getTmdbImageUrl } from "@/lib/tmdb/image";
import { formatVoteAverage, formatYear } from "@/lib/utils";

interface HeroBillboardProps {
  featured: FeaturedMedia | null;
}

export default function HeroBillboard({ featured }: HeroBillboardProps) {
  const prefersReducedMotion = useReducedMotion();
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    if (!featured?.trailerKey || prefersReducedMotion) {
      setShowTrailer(false);
      return;
    }

    const timer = window.setTimeout(() => setShowTrailer(true), 2800);
    return () => window.clearTimeout(timer);
  }, [featured?.id, featured?.trailerKey, prefersReducedMotion]);

  const trailerUrl = useMemo(() => {
    if (!featured?.trailerKey) {
      return null;
    }

    return `https://www.youtube.com/embed/${featured.trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${featured.trailerKey}&modestbranding=1&rel=0`;
  }, [featured?.trailerKey]);

  const backdropUrl = getTmdbImageUrl(featured?.backdropPath ?? featured?.posterPath ?? null, "original");

  if (!featured) {
    return (
      <section className="relative h-[72vh] min-h-[520px] w-full overflow-hidden bg-pitch">
        <div className="absolute inset-0 skeleton-shimmer" />
      </section>
    );
  }

  return (
    <section className="relative h-[82vh] min-h-[580px] w-full overflow-hidden bg-pitch">
      <div className="absolute inset-0">
        {showTrailer && trailerUrl ? (
          <iframe
            src={trailerUrl}
            title={`${featured.title} trailer`}
            className="h-full w-full scale-[1.28] object-cover"
            allow="autoplay; fullscreen; encrypted-media"
          />
        ) : (
          <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${backdropUrl})` }} />
        )}
      </div>

      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-pitch to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 flex h-full max-w-2xl flex-col justify-end gap-4 px-4 pb-20 pt-24 md:px-10"
      >
        <Badge tone="accent" className="w-fit">
          MFLIX TOP PICK
        </Badge>
        <h1 className="text-balance text-4xl font-bold leading-tight md:text-6xl">{featured.title}</h1>
        <div className="flex items-center gap-2 text-xs text-zinc-300 md:text-sm">
          <span>{formatYear(featured.releaseDate)}</span>
          <span className="text-zinc-500">|</span>
          <span>{featured.mediaType === "movie" ? "Movie" : "Series"}</span>
          <span className="text-zinc-500">|</span>
          <span>{formatVoteAverage(featured.voteAverage)} / 10</span>
        </div>
        <p className="line-clamp-3 max-w-2xl text-sm text-zinc-100 md:text-base">
          {featured.overview || "Now streaming on MFLIX."}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Link href={`/watch/${featured.id}`} prefetch className="focus-visible:outline-none">
            <Button variant="secondary" size="lg" leftIcon={<Play className="h-4 w-4 fill-black" />}>
              Play
            </Button>
          </Link>
          <Link
            href={`/title/${featured.mediaType}/${featured.id}`}
            prefetch
            className="focus-visible:outline-none"
          >
            <Button variant="ghost" size="lg" leftIcon={<Info className="h-4 w-4" />}>
              More Info
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useReducedMotion } from "framer-motion";

type TitleTrailerProps = {
  youtubeKey: string | null;
  title: string;
};

export function TitleTrailer({ youtubeKey, title }: TitleTrailerProps) {
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();
  const playRequested = searchParams.get("play") === "trailer";

  const src = useMemo(() => {
    if (!youtubeKey) return null;
    const autoplay = playRequested && !reduceMotion ? 1 : 0;
    return `https://www.youtube.com/embed/${youtubeKey}?autoplay=${autoplay}&mute=1&controls=1&modestbranding=1&rel=0`;
  }, [playRequested, reduceMotion, youtubeKey]);

  if (!src) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
        <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-zinc-400">
          Trailer unavailable for this title.
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl border border-zinc-800 bg-black shadow-2xl">
      <iframe
        src={src}
        title={`${title} trailer`}
        className="h-full w-full"
        allow="autoplay; fullscreen; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}


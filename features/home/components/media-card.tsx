"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Plus, Star } from "lucide-react";
import TmdbImage from "@/components/ui/tmdb-image";
import { useMyListStore } from "@/features/my-list/store/use-my-list-store";
import type { MediaItem } from "@/types/media";
import { formatVoteAverage, formatYear } from "@/lib/utils";

interface MediaCardProps {
  item: MediaItem;
  rank?: number;
}

export default function MediaCard({ item, rank }: MediaCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const inMyList = useMyListStore((state) => state.has(item.id, item.mediaType));
  const toggle = useMyListStore((state) => state.toggle);

  return (
    <motion.article
      whileHover={prefersReducedMotion ? undefined : { y: -6, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 240, damping: 20 }}
      className="group relative w-[145px] flex-none sm:w-[165px] md:w-[180px]"
    >
      <div className="relative overflow-hidden rounded-md border border-zinc-800 bg-zinc-900 shadow-card">
        <Link href={`/title/${item.mediaType}/${item.id}`} className="block focus-visible:outline-none">
          <TmdbImage
            path={item.posterPath || item.backdropPath}
            alt={item.title}
            width={360}
            height={540}
            size="w500"
            sizes="(max-width: 640px) 42vw, (max-width: 1024px) 26vw, 180px"
            className="h-[205px] w-full object-cover sm:h-[230px] md:h-[250px]"
          />
        </Link>

        <button
          type="button"
          onClick={() => toggle(item)}
          aria-label={inMyList ? `Remove ${item.title} from My List` : `Add ${item.title} to My List`}
          className="absolute right-2 top-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-600 bg-black/70 text-white transition hover:border-netflix hover:bg-netflix"
        >
          {inMyList ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </button>

        {typeof rank === "number" ? (
          <div className="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 text-xs font-semibold text-zinc-100">
            #{rank}
          </div>
        ) : null}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-md bg-gradient-to-t from-black via-black/85 to-transparent p-3 opacity-0 transition duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
        <p className="line-clamp-1 text-sm font-semibold text-zinc-50">{item.title}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-zinc-300">
          <span>{formatYear(item.releaseDate)}</span>
          <span className="text-zinc-500">|</span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-3 w-3 fill-netflix text-netflix" />
            {formatVoteAverage(item.voteAverage)}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

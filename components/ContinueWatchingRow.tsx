"use client";

import Link from "next/link";
import { Play, X } from "lucide-react";
import { usePlaybackStore } from "@/lib/store";
import PosterImage from "@/components/PosterImage";

export default function ContinueWatchingRow() {
  const progress = usePlaybackStore((s) => s.progress);
  const hydrated = usePlaybackStore((s) => s.hydrated);
  const clearProgress = usePlaybackStore((s) => s.clearProgress);

  const active = progress.filter((p) => {
    if (!p.duration || p.duration <= 0) return false;
    const pct = p.currentTime / p.duration;
    return pct > 0.02 && pct < 0.95;
  });

  if (!hydrated || active.length === 0) return null;

  return (
    <section className="space-y-3 px-4 md:px-12">
      <h2 className="text-fluid-lg font-semibold text-white">Continue Watching</h2>
      <div className="row-scroll hide-scrollbar flex gap-3 overflow-x-auto pb-4">
        {active.map((item) => {
          const pct = Math.round((item.currentTime / item.duration) * 100);
          return (
            <div key={`${item.mediaType}-${item.id}`} className="group relative w-[200px] flex-none sm:w-[240px]">
              <Link href={`/watch/${item.id}`} className="block">
                <div className="relative overflow-hidden rounded-lg">
                  <PosterImage
                    path={item.backdropPath || item.posterPath}
                    alt={item.title}
                    width={480}
                    height={270}
                    size="w500"
                    className="aspect-backdrop"
                    sizes="240px"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black">
                      <Play className="h-5 w-5 fill-current" />
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-zinc-800">
                    <div
                      className="h-full bg-netflix transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </Link>
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <p className="line-clamp-1 text-xs font-medium text-zinc-300">{item.title}</p>
                <button
                  onClick={() => clearProgress(item.mediaType, item.id)}
                  className="flex-shrink-0 text-zinc-600 transition hover:text-zinc-300"
                  aria-label={`Remove ${item.title} from continue watching`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import MediaCard from "@/features/home/components/media-card";
import type { MediaItem } from "@/types/media";

interface MediaRailProps {
  title: string;
  items: MediaItem[];
  topTen?: boolean;
}

export default function MediaRail({ title, items, topTen = false }: MediaRailProps) {
  const railRef = useRef<HTMLDivElement | null>(null);

  if (!items.length) {
    return null;
  }

  return (
    <section className="space-y-2 px-4 md:px-10">
      <SectionHeading
        title={title}
        action={
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => railRef.current?.scrollBy({ left: -700, behavior: "smooth" })}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-black/70 text-zinc-200 transition hover:border-zinc-500 hover:text-white"
              aria-label={`Scroll ${title} left`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => railRef.current?.scrollBy({ left: 700, behavior: "smooth" })}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-black/70 text-zinc-200 transition hover:border-zinc-500 hover:text-white"
              aria-label={`Scroll ${title} right`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        }
      />

      <div
        ref={railRef}
        className="row-scroll flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]"
      >
        {items.map((item, index) => (
          <div key={`${item.mediaType}-${item.id}`} className="snap-start">
            <MediaCard item={item} rank={topTen ? index + 1 : undefined} />
          </div>
        ))}
      </div>
    </section>
  );
}

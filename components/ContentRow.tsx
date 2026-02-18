"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import type { TMDBMovie } from "@/types/tmdb";
import type { ContentRow as ContentRowType } from "@/types/tmdb";
import MovieCard from "@/components/MovieCard";

interface ContentRowProps {
  row: ContentRowType;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function ContentRow({ row }: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!row.items.length) return null;

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.75;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative space-y-3 px-4 md:px-12">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-fluid-lg font-semibold text-white">{row.title}</h2>
      </div>

      <div className="group/row relative">
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label={`Scroll ${row.title} left`}
          className="absolute -left-1 top-1/2 z-30 hidden h-full -translate-y-1/2 items-center bg-gradient-to-r from-pitch/90 to-transparent px-2 opacity-0 transition-opacity duration-200 group-hover/row:opacity-100 sm:flex"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white ring-1 ring-white/10 transition hover:bg-zinc-800">
            <ChevronLeft className="h-5 w-5" />
          </div>
        </button>

        <motion.div
          ref={scrollRef}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          className="row-scroll hide-scrollbar flex gap-2.5 overflow-x-auto pb-4 sm:gap-3"
        >
          {row.items.map((movie, idx) => (
            <motion.div key={movie.id} variants={itemVariants}>
              <MovieCard movie={movie} index={idx} variant={row.variant ?? "poster"} />
            </motion.div>
          ))}
        </motion.div>

        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label={`Scroll ${row.title} right`}
          className="absolute -right-1 top-1/2 z-30 hidden h-full -translate-y-1/2 items-center bg-gradient-to-l from-pitch/90 to-transparent px-2 opacity-0 transition-opacity duration-200 group-hover/row:opacity-100 sm:flex"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white ring-1 ring-white/10 transition hover:bg-zinc-800">
            <ChevronRight className="h-5 w-5" />
          </div>
        </button>
      </div>
    </section>
  );
}

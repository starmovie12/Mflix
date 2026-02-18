"use client";

import { motion } from "framer-motion";
import type { TMDBMovie } from "@/types/tmdb";
import MovieCard from "@/components/MovieCard";
import EmptyState from "@/components/ui/EmptyState";
import { Film } from "lucide-react";

interface BrowseGridProps {
  items: TMDBMovie[];
  emptyMessage?: string;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function BrowseGrid({ items, emptyMessage = "No titles found" }: BrowseGridProps) {
  if (!items.length) {
    return (
      <EmptyState
        icon={<Film className="h-8 w-8 text-zinc-500" />}
        title={emptyMessage}
        description="Try adjusting your filters or check back later."
      />
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7"
    >
      {items.map((movie) => (
        <motion.div key={movie.id} variants={itemVariants}>
          <MovieCard movie={movie} variant="poster" />
        </motion.div>
      ))}
    </motion.div>
  );
}

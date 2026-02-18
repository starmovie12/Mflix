'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Plus, Info } from 'lucide-react';
import type { Movie } from '@/lib/tmdb';
import { getPosterUrl, getMovieTitle } from '@/lib/tmdb';
import { useWatchlist } from '@/hooks/useWatchlist';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  id?: string;
}

function MovieCard({ movie, index }: { movie: Movie; index: number }) {
  const { toggle, has, mounted } = useWatchlist();
  const inList = mounted && has(movie.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="group flex-shrink-0 w-[180px] md:w-[220px]"
    >
      <Link href={`/watch/${movie.id}?type=${movie.media_type || 'movie'}`}>
        <motion.div
          whileHover={{ scale: 1.1, zIndex: 10 }}
          className="relative rounded-md overflow-hidden bg-neutral-900 cursor-pointer shadow-xl"
        >
          <div className="aspect-[2/3] relative">
            <Image
              src={getPosterUrl(movie.poster_path)}
              alt={getMovieTitle(movie)}
              fill
              sizes="220px"
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-poster.svg';
              }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-200" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
              <button
                onClick={(ev) => {
                  ev.preventDefault();
                  ev.stopPropagation();
                }}
                className="p-2 rounded-full bg-white/90 hover:bg-white text-black transition"
              >
                <Play className="w-5 h-5 fill-current" />
              </button>
              <button
                onClick={(ev) => {
                  ev.preventDefault();
                  ev.stopPropagation();
                  toggle(movie);
                }}
                className={`p-2 rounded-full border-2 transition ${
                  inList ? 'bg-white text-black border-white' : 'border-white/80 text-white hover:bg-white/20'
                }`}
              >
                <Plus className={`w-5 h-5 ${inList ? 'rotate-45' : ''} transition-transform`} />
              </button>
              <Link
                href={`/watch/${movie.id}?type=${movie.media_type || 'movie'}`}
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-full border-2 border-white/80 text-white hover:bg-white/20 transition"
              >
                <Info className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <p className="text-sm font-medium truncate">{getMovieTitle(movie)}</p>
            <p className="text-xs text-gray-400">
              {movie.vote_average > 0 ? `${movie.vote_average.toFixed(1)} ★` : '—'}
            </p>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export function MovieRow({ title, movies, id }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 400;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (!movies.length) return null;

  return (
    <section id={id} className="space-y-3">
      <h2 className="text-xl md:text-2xl font-bold px-4 md:px-8">{title}</h2>
      <div className="relative group/row">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-full bg-gradient-to-r from-pitch/90 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-start pl-2"
          aria-label="Scroll left"
        >
          <span className="text-white text-2xl">‹</span>
        </button>
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto overflow-y-hidden scroll-smooth px-4 md:px-8 py-2 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie, i) => (
            <MovieCard key={`${movie.id}-${i}`} movie={movie} index={i} />
          ))}
        </div>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-full bg-gradient-to-l from-pitch/90 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-end pr-2"
          aria-label="Scroll right"
        >
          <span className="text-white text-2xl">›</span>
        </button>
      </div>
    </section>
  );
}

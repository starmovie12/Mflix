'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Info } from 'lucide-react';
import type { Movie } from '@/lib/tmdb';
import { getBackdropUrl, getMovieTitle } from '@/lib/tmdb';
import { HeroSkeleton } from './Skeleton';

export function Hero() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const trailerStarted = useRef(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/trending');
        const data = await res.json();
        const list = data.results ?? [];
        const featured = list.find((m: Movie) => m.backdrop_path && (m.media_type === 'movie' || m.media_type === 'tv')) ?? list[0];
        setMovie(featured ?? null);

        if (featured?.id) {
          const type = featured.media_type || 'movie';
          const vidRes = await fetch(`/api/videos?id=${featured.id}&type=${type}`);
          const vidData = await vidRes.json();
          const trailer = (vidData.results ?? []).find(
            (v: { site: string; type: string }) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
          );
          if (trailer?.key) setTrailerKey(trailer.key);
        }
      } catch {
        setMovie(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!trailerKey || trailerStarted.current) return;
    const t = setTimeout(() => {
      trailerStarted.current = true;
      setShowTrailer(true);
    }, 3000);
    return () => clearTimeout(t);
  }, [trailerKey]);

  if (loading) return <HeroSkeleton />;
  if (!movie) return null;

  const title = getMovieTitle(movie);
  const backdrop = getBackdropUrl(movie.backdrop_path);

  return (
    <section className="relative h-[85vh] min-h-[500px] w-full">
      {/* Background: Trailer or Backdrop */}
      {showTrailer && trailerKey ? (
        <div className="absolute inset-0 z-0">
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${trailerKey}`}
            title="Trailer"
            className="absolute inset-0 w-full h-full pointer-events-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ) : (
        <>
          <Image
            src={backdrop}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-backdrop.svg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pitch via-pitch/40 to-transparent" />
        </>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">{title}</h1>
          <p className="text-lg text-gray-300 mb-6 line-clamp-3 drop-shadow">{movie.overview || ''}</p>
          <div className="flex gap-3">
            <Link
              href={`/watch/${movie.id}?type=${movie.media_type || 'movie'}`}
              className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-md hover:bg-gray-200 transition"
            >
              <Play className="w-5 h-5 fill-current" />
              Play
            </Link>
            <Link
              href={`/watch/${movie.id}?type=${movie.media_type || 'movie'}`}
              className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white font-semibold rounded-md hover:bg-white/30 transition backdrop-blur"
            >
              <Info className="w-5 h-5" />
              More Info
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

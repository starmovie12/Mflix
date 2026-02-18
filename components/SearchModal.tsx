'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { getPosterUrl, getMovieTitle } from '@/lib/tmdb';
import type { Movie } from '@/lib/tmdb';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setQuery('');
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data.results ?? []);
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/90 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4 mt-24">
        <div className="flex items-center gap-3 border-b border-white/20 pb-4">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies and TV shows..."
            className="flex-1 bg-transparent text-white text-lg outline-none placeholder:text-gray-500"
          />
          <button
            onClick={onClose}
            className="p-2 text-white hover:text-gray-300 transition"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <p className="text-gray-400 py-8 text-center">Searching...</p>
          ) : results.length === 0 && debouncedQuery ? (
            <p className="text-gray-400 py-8 text-center">No results found</p>
          ) : (
            <div className="space-y-2">
              {results.map((movie) => (
                <Link
                  key={movie.id}
                  href={`/watch/${movie.id}?type=${movie.media_type || 'movie'}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition"
                >
                  <div className="relative w-12 h-18 flex-shrink-0 rounded overflow-hidden">
                    <Image
                      src={getPosterUrl(movie.poster_path, 'w92')}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="48px"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-poster.svg';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{getMovieTitle(movie)}</p>
                    <p className="text-sm text-gray-400">
                      {movie.media_type === 'tv' ? 'TV Show' : 'Movie'}
                      {movie.release_date || movie.first_air_date
                        ? ` • ${(movie.release_date || movie.first_air_date || '').slice(0, 4)}`
                        : ''}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

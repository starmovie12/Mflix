"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Play,
  Share2,
  ThumbsUp,
} from "lucide-react";
import type { TMDBMovieDetails } from "@/lib/tmdb/types";
import { getImageUrl, getMovieTitle, getDirector, getTopCast } from "@/lib/tmdb";
import Navbar from "@/components/Navbar";
import PosterImage from "@/components/PosterImage";
import MovieRow from "@/components/MovieRow";
import { useWatchlist } from "@/hooks/useWatchlist";

interface TitleDetailClientProps {
  details: TMDBMovieDetails;
  mediaType: "movie" | "tv";
}

function formatYear(details: TMDBMovieDetails): string {
  const date = details.release_date ?? details.first_air_date;
  if (!date) return "";
  return date.slice(0, 4);
}

function formatRuntime(runtime?: number): string {
  if (!runtime) return "";
  const h = Math.floor(runtime / 60);
  const m = runtime % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function formatMatchScore(voteAverage?: number): string {
  if (voteAverage == null) return "";
  const pct = Math.round(voteAverage * 10);
  return `${Math.min(pct, 99)}% Match`;
}

export default function TitleDetailClient({ details, mediaType }: TitleDetailClientProps) {
  const { watchlistIds, toggleWatchlist, hydrated } = useWatchlist();
  const title = getMovieTitle(details);
  const backdropUrl = getImageUrl(details.backdrop_path ?? details.poster_path, "original");
  const director = getDirector(details.credits?.crew);
  const cast = getTopCast(details.credits?.cast, 12);
  const similar = (details.similar?.results ?? []).slice(0, 12).map((m) => ({
    ...m,
    media_type: (m.media_type ?? mediaType) as "movie" | "tv",
  }));
  const recommendations = (details.recommendations?.results ?? []).slice(0, 12).map((m) => ({
    ...m,
    media_type: (m.media_type ?? mediaType) as "movie" | "tv",
  }));
  const inWatchlist = watchlistIds.has(details.id);

  const movieForWatchlist = {
    id: details.id,
    title: details.title ?? details.name ?? "Untitled",
    name: details.name ?? details.title ?? "Untitled",
    overview: details.overview ?? "",
    backdrop_path: details.backdrop_path ?? null,
    poster_path: details.poster_path ?? null,
    release_date: details.release_date ?? details.first_air_date ?? "",
    first_air_date: details.first_air_date ?? details.release_date ?? "",
    vote_average: details.vote_average ?? 0,
    vote_count: details.vote_count ?? 0,
    popularity: details.popularity ?? 0,
    genre_ids: details.genre_ids ?? [],
    media_type: details.media_type ?? mediaType,
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      await navigator.share({
        title,
        text: details.overview ?? "",
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className="min-h-screen bg-pitch text-white">
      <Navbar />

      {/* Hero backdrop */}
      <section className="relative h-[56vh] min-h-[400px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pitch via-pitch/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-pitch/90 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-6 px-4 pb-8 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-4"
          >
            <h1 className="text-4xl font-bold drop-shadow-lg sm:text-5xl md:text-6xl">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-300">
              {formatMatchScore(details.vote_average) ? (
                <span className="flex items-center gap-1 font-semibold text-green-400">
                  <ThumbsUp className="h-4 w-4" />
                  {formatMatchScore(details.vote_average)}
                </span>
              ) : null}
              {formatYear(details) ? (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatYear(details)}
                </span>
              ) : null}
              {details.runtime ? (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatRuntime(details.runtime)}
                </span>
              ) : null}
              {details.genres?.map((g) => (
                <span key={g.id} className="rounded border border-zinc-500 px-2 py-0.5">
                  {g.name}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <main className="-mt-16 space-y-10 pb-20">
        <div className="mx-auto max-w-[1600px] px-4 md:px-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
            {/* Poster + actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex-shrink-0"
            >
              <div className="relative w-[200px] sm:w-[240px]">
                <PosterImage
                  path={details.poster_path ?? details.backdrop_path}
                  alt={title}
                  width={240}
                  height={360}
                  size="w500"
                  className="rounded-lg shadow-2xl"
                />
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href={`/watch/${mediaType}/${details.id}`}
                    className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
                  >
                    <Play className="h-4 w-4 fill-black" />
                    Play
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleWatchlist(movieForWatchlist)}
                    className={`inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold transition ${
                      inWatchlist
                        ? "bg-netflix text-white hover:bg-netflix/90"
                        : "border border-zinc-500 bg-zinc-800/80 text-white hover:border-zinc-400"
                    }`}
                  >
                    {inWatchlist ? "In My List" : "Add to My List"}
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 rounded-full border border-zinc-500 bg-zinc-800/80 p-3 text-white transition hover:border-zinc-400"
                    aria-label="Share"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex-1 space-y-6"
            >
              <p className="text-base leading-relaxed text-zinc-200">
                {details.overview || "No overview available."}
              </p>

              {director ? (
                <div>
                  <p className="mb-1 text-sm font-semibold text-zinc-400">Director</p>
                  <p className="text-white">{director.name}</p>
                </div>
              ) : null}

              {cast.length > 0 ? (
                <div>
                  <p className="mb-2 text-sm font-semibold text-zinc-400">Cast</p>
                  <div className="flex flex-wrap gap-2">
                    {cast.map((member) => (
                      <span key={member.id} className="text-sm text-zinc-300">
                        {member.name}
                        {member.character ? (
                          <span className="text-zinc-500"> as {member.character}</span>
                        ) : null}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {details.genres && details.genres.length > 0 ? (
                <div>
                  <p className="mb-2 text-sm font-semibold text-zinc-400">Genres</p>
                  <div className="flex flex-wrap gap-2">
                    {details.genres.map((g) => (
                      <span
                        key={g.id}
                        className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-200"
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </motion.div>
          </div>
        </div>

        {/* Similar & Recommendations */}
        {hydrated && (similar.length > 0 || recommendations.length > 0) ? (
          <div className="space-y-8">
            {similar.length > 0 ? (
              <MovieRow
                title="More Like This"
                movies={similar}
                watchlistIds={watchlistIds}
                onToggleWatchlist={toggleWatchlist}
              />
            ) : null}
            {recommendations.length > 0 ? (
              <MovieRow
                title="Recommendations"
                movies={recommendations}
                watchlistIds={watchlistIds}
                onToggleWatchlist={toggleWatchlist}
              />
            ) : null}
          </div>
        ) : null}
      </main>

      {/* Breadcrumb */}
      <div className="fixed left-4 top-20 z-40 md:left-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Browse
        </Link>
      </div>
    </div>
  );
}

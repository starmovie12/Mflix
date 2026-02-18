import Link from "next/link";
import Image from "next/image";
import type { TMDBMediaType, TMDBMovie } from "@/lib/types";
import { getImageUrl, getMovieTitle } from "@/lib/tmdb";

interface TitleRecommendationsProps {
  heading: string;
  fallbackMediaType: TMDBMediaType;
  movies: TMDBMovie[];
}

function getMediaType(movie: TMDBMovie, fallbackMediaType: TMDBMediaType) {
  return movie.media_type === "tv" ? "tv" : fallbackMediaType;
}

function formatYear(movie: TMDBMovie) {
  const date = movie.release_date || movie.first_air_date || "";
  return date.slice(0, 4) || "N/A";
}

export default function TitleRecommendations({
  heading,
  fallbackMediaType,
  movies
}: TitleRecommendationsProps) {
  if (!movies.length) {
    return null;
  }

  return (
    <section className="space-y-4 px-4 md:px-12">
      <h2 className="text-xl font-semibold text-white">{heading}</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {movies.slice(0, 12).map((movie) => {
          const mediaType = getMediaType(movie, fallbackMediaType);
          const title = getMovieTitle(movie);

          return (
            <Link
              key={movie.id}
              href={`/title/${mediaType}/${movie.id}`}
              className="group overflow-hidden rounded-md border border-zinc-800 bg-zinc-950/60 transition hover:border-zinc-600"
            >
              <div className="relative aspect-[2/3] w-full">
                <Image
                  src={getImageUrl(movie.poster_path || movie.backdrop_path, "w500")}
                  alt={title}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="space-y-1 p-3">
                <p className="line-clamp-1 text-sm font-semibold text-zinc-100">{title}</p>
                <p className="text-xs text-zinc-400">
                  {formatYear(movie)} • {Number(movie.vote_average ?? 0).toFixed(1)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

import Image from "next/image";
import TitleActions from "@/components/title/TitleActions";
import type { TMDBMediaType, TMDBMovieDetails } from "@/lib/types";
import { getImageUrl, getMovieTitle } from "@/lib/tmdb";

interface TitleHeroProps {
  mediaType: TMDBMediaType;
  titleData: TMDBMovieDetails;
  trailerKey: string | null;
}

function formatYear(titleData: TMDBMovieDetails) {
  const releaseDate = titleData.release_date || titleData.first_air_date || "";
  return releaseDate.slice(0, 4) || "N/A";
}

function formatRuntime(titleData: TMDBMovieDetails, mediaType: TMDBMediaType) {
  if (mediaType === "tv") {
    const runtime = titleData.episode_run_time?.[0];
    if (!runtime) {
      return "Episode duration unavailable";
    }
    return `${runtime}m / episode`;
  }

  if (!titleData.runtime) {
    return "Runtime unavailable";
  }

  const hours = Math.floor(titleData.runtime / 60);
  const minutes = titleData.runtime % 60;
  return `${hours}h ${minutes}m`;
}

export default function TitleHero({ mediaType, titleData, trailerKey }: TitleHeroProps) {
  const title = getMovieTitle(titleData);
  const imagePath = titleData.backdrop_path || titleData.poster_path;
  const year = formatYear(titleData);
  const runtime = formatRuntime(titleData, mediaType);
  const rating = Number(titleData.vote_average ?? 0).toFixed(1);
  const genres = titleData.genres?.slice(0, 4).map((genre) => genre.name).join(" • ");

  return (
    <section className="relative min-h-[76vh] overflow-hidden bg-pitch">
      <Image
        src={getImageUrl(imagePath, "original")}
        alt={title}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-pitch via-pitch/75 to-black/35" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-pitch to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[76vh] w-full max-w-[1600px] flex-col justify-end gap-5 px-4 pb-16 pt-32 md:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-netflix">MFLIX Original</p>
        <h1 className="max-w-4xl text-balance text-4xl font-extrabold sm:text-5xl md:text-6xl">{title}</h1>

        <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-200">
          <span className="rounded border border-zinc-500/70 px-2 py-1 text-xs font-semibold uppercase text-zinc-100">{mediaType}</span>
          <span>{year}</span>
          <span>{runtime}</span>
          <span className="rounded bg-netflix px-2 py-1 text-xs font-semibold text-white">{rating} ★</span>
        </div>

        {genres ? <p className="text-sm text-zinc-300">{genres}</p> : null}

        <p className="max-w-2xl text-pretty text-sm leading-6 text-zinc-100 sm:text-base">
          {titleData.overview || "No synopsis available for this title."}
        </p>

        <TitleActions mediaType={mediaType} movie={titleData} trailerKey={trailerKey} />
      </div>
    </section>
  );
}

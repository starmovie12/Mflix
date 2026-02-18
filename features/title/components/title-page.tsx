import Link from "next/link";
import { Play } from "lucide-react";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import TmdbImage from "@/components/ui/tmdb-image";
import MediaRail from "@/features/home/components/media-rail";
import TitleActions from "@/features/title/components/title-actions";
import { getTmdbImageUrl } from "@/lib/tmdb/image";
import { formatRuntime, formatVoteAverage } from "@/lib/utils";
import type { TitleDetails } from "@/types/media";

interface TitlePageProps {
  details: TitleDetails;
}

function formatReleaseDate(date: string | null) {
  if (!date) {
    return "TBA";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(parsed);
}

function buildYoutubeUrl(key: string | null) {
  if (!key) {
    return null;
  }

  return `https://www.youtube.com/watch?v=${key}`;
}

export default function TitlePage({ details }: TitlePageProps) {
  const backdropUrl = getTmdbImageUrl(details.backdropPath || details.posterPath, "original");
  const trailer = details.videos.find((video) => video.site === "YouTube" && video.type === "Trailer");
  const trailerUrl = buildYoutubeUrl(trailer?.key ?? null);

  return (
    <div className="min-h-screen bg-pitch text-white">
      <section className="relative isolate min-h-[72vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backdropUrl})` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-pitch via-pitch/80 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[72vh] w-full max-w-[1500px] items-end px-4 pb-14 pt-28 md:px-10">
          <div className="grid w-full gap-8 md:grid-cols-[280px_1fr] md:items-end">
            <div className="hidden md:block">
              <TmdbImage
                path={details.posterPath || details.backdropPath}
                alt={details.title}
                width={560}
                height={840}
                sizes="280px"
                size="w500"
                className="h-auto w-full rounded-lg border border-zinc-700 object-cover shadow-2xl"
                priority
              />
            </div>

            <div className="max-w-4xl space-y-5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-200 md:text-sm">
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
                <span className="text-zinc-500">/</span>
                <span className="text-zinc-300">{details.mediaType === "movie" ? "Movie" : "Series"}</span>
                <span className="text-zinc-500">/</span>
                <span className="line-clamp-1 max-w-[300px] text-zinc-100">{details.title}</span>
              </div>

              <h1 className="text-balance text-4xl font-bold md:text-6xl">{details.title}</h1>
              {details.tagline ? <p className="text-sm italic text-zinc-200 md:text-base">{details.tagline}</p> : null}

              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="accent">{details.mediaType === "movie" ? "Movie" : "Series"}</Badge>
                <Badge>{formatReleaseDate(details.releaseDate)}</Badge>
                <Badge>{formatRuntime(details.runtimeMinutes)}</Badge>
                <Badge>{formatVoteAverage(details.voteAverage)} / 10</Badge>
                {details.status ? <Badge tone="muted">{details.status}</Badge> : null}
              </div>

              <p className="max-w-3xl text-sm leading-7 text-zinc-100 md:text-base">
                {details.overview || "No synopsis is currently available."}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                {details.mediaType === "movie" ? (
                  <Link href={`/watch/${details.id}`} prefetch className="focus-visible:outline-none">
                    <Button variant="secondary" size="lg" leftIcon={<Play className="h-4 w-4 fill-black" />}>
                      Play
                    </Button>
                  </Link>
                ) : null}

                {trailerUrl ? (
                  <Link href={trailerUrl} target="_blank" rel="noreferrer" className="focus-visible:outline-none">
                    <Button variant="ghost" size="lg">
                      Watch Trailer
                    </Button>
                  </Link>
                ) : null}
              </div>

              <TitleActions item={details} />
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto flex w-full max-w-[1500px] flex-col gap-10 px-4 pb-20 pt-8 md:px-10">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Genres</h2>
          <div className="flex flex-wrap gap-2">
            {details.genres.length ? (
              details.genres.map((genre) => (
                <Badge key={genre.id} tone="muted">
                  {genre.name}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-zinc-400">Genres unavailable.</p>
            )}
          </div>
        </section>

        <section className="grid gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Cast</h2>
            {details.cast.length ? (
              <ul className="space-y-2">
                {details.cast.slice(0, 10).map((person) => (
                  <li key={`cast-${person.id}`} className="text-sm text-zinc-300">
                    <span className="font-medium text-zinc-100">{person.name}</span>
                    {person.character ? <span className="text-zinc-500"> as {person.character}</span> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-zinc-400">Cast data unavailable.</p>
            )}
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Crew Highlights</h2>
            {details.crewHighlights.length ? (
              <ul className="space-y-2">
                {details.crewHighlights.slice(0, 10).map((person) => (
                  <li key={`crew-${person.id}`} className="text-sm text-zinc-300">
                    <span className="font-medium text-zinc-100">{person.name}</span>
                    {person.job ? <span className="text-zinc-500"> · {person.job}</span> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-zinc-400">Crew data unavailable.</p>
            )}
          </div>
        </section>

        {details.videos.length ? (
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Trailers & Videos</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {details.videos
                .filter((video) => video.site === "YouTube")
                .slice(0, 6)
                .map((video) => (
                  <Link
                    key={video.id}
                    href={`https://www.youtube.com/watch?v=${video.key}`}
                    target="_blank"
                    rel="noreferrer"
                    className="group rounded-lg border border-zinc-800 bg-zinc-900/70 p-4 transition hover:border-zinc-600"
                  >
                    <p className="line-clamp-1 text-sm font-medium text-zinc-100 group-hover:text-white">{video.name}</p>
                    <p className="mt-1 text-xs text-zinc-400">{video.type}</p>
                  </Link>
                ))}
            </div>
          </section>
        ) : null}

        {details.backdrops.length ? (
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Gallery</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {details.backdrops.slice(0, 6).map((image, index) => (
                <TmdbImage
                  key={`${image.filePath}-${index}`}
                  path={image.filePath}
                  alt={`${details.title} backdrop ${index + 1}`}
                  width={960}
                  height={540}
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  size="w780"
                  className="h-auto w-full rounded-md border border-zinc-800 object-cover"
                />
              ))}
            </div>
          </section>
        ) : null}

        <MediaRail title="More Like This" items={details.similar.slice(0, 20)} />
        <MediaRail title="Recommended for You" items={details.recommendations.slice(0, 20)} />
      </main>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { getTmdbImageUrl, type TitleDetails } from "@/lib/tmdb";

type TitleHeroProps = {
  details: TitleDetails;
};

function formatRuntime(details: TitleDetails): string | null {
  if (!details.runtimeMinutes) return null;
  const hours = Math.floor(details.runtimeMinutes / 60);
  const minutes = details.runtimeMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

export function TitleHero({ details }: TitleHeroProps) {
  const runtime = formatRuntime(details);
  const year = details.year;
  const score = details.voteAverage > 0 ? details.voteAverage.toFixed(1) : null;
  const backdrop = getTmdbImageUrl(details.backdropPath || details.posterPath, "original");
  const poster = getTmdbImageUrl(details.posterPath || details.backdropPath, "w500");

  return (
    <section className="relative overflow-hidden bg-pitch">
      <div className="absolute inset-0">
        <Image
          src={backdrop}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pitch via-pitch/65 to-black/30" />
      </div>

      <div className="relative mx-auto w-full max-w-[1600px] px-4 pb-10 pt-24 md:px-12 md:pb-16">
        <div className="mb-6 flex items-center gap-3 text-sm text-zinc-300">
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="capitalize">{details.mediaType === "tv" ? "TV" : "Movie"}</span>
          <span className="text-zinc-600">/</span>
          <span className="line-clamp-1 text-white">{details.title}</span>
        </div>

        <div className="grid items-end gap-8 md:grid-cols-[240px_1fr]">
          <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-card">
            <Image
              src={poster}
              alt={`${details.title} poster`}
              width={500}
              height={750}
              sizes="(max-width: 768px) 40vw, 240px"
              className="h-auto w-full object-cover"
            />
          </div>

          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.25em] text-netflix">MFLIX</p>
            <h1 className="mt-2 text-balance text-4xl font-bold sm:text-5xl md:text-6xl">{details.title}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-zinc-300">
              {year ? <Badge>{year}</Badge> : null}
              {runtime ? <Badge>{runtime}</Badge> : null}
              {score ? <Badge variant="netflix">{score} ★</Badge> : null}
              {details.genres.slice(0, 3).map((genre) => (
                <Badge key={genre.id} variant="muted">
                  {genre.name}
                </Badge>
              ))}
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-6 text-zinc-200 sm:text-base">
              {details.overview || "No overview is available for this title yet."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


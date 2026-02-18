import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import TitleCastRow from "@/components/title/TitleCastRow";
import TitleHero from "@/components/title/TitleHero";
import TitleRecommendations from "@/components/title/TitleRecommendations";
import { getImageUrl, getMovieTitle, pickBestTrailerKey } from "@/lib/tmdb";
import { getTitleDetails } from "@/lib/tmdb/server";
import type { TMDBMediaType } from "@/lib/types";

interface TitleDetailPageProps {
  params: {
    mediaType: string;
    id: string;
  };
}

function isMediaType(value: string): value is TMDBMediaType {
  return value === "movie" || value === "tv";
}

function parseId(rawId: string) {
  const id = Number(rawId);
  return Number.isFinite(id) ? id : null;
}

export async function generateMetadata({ params }: TitleDetailPageProps): Promise<Metadata> {
  const { mediaType, id: rawId } = params;
  if (!isMediaType(mediaType)) {
    return {
      title: "MFLIX | Title Not Found"
    };
  }

  const id = parseId(rawId);
  if (!id) {
    return {
      title: "MFLIX | Title Not Found"
    };
  }

  const titleData = await getTitleDetails(mediaType, id);
  if (!titleData) {
    return {
      title: "MFLIX | Title Not Found"
    };
  }

  const title = getMovieTitle(titleData);
  const image = getImageUrl(titleData.backdrop_path || titleData.poster_path, "w780");

  return {
    title: `${title} | MFLIX`,
    description: titleData.overview || `Watch ${title} on MFLIX.`,
    openGraph: {
      title: `${title} | MFLIX`,
      description: titleData.overview || `Watch ${title} on MFLIX.`,
      images: [{ url: image }]
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | MFLIX`,
      description: titleData.overview || `Watch ${title} on MFLIX.`,
      images: [image]
    }
  };
}

export default async function TitleDetailPage({ params }: TitleDetailPageProps) {
  const { mediaType, id: rawId } = params;
  if (!isMediaType(mediaType)) {
    notFound();
  }

  const id = parseId(rawId);
  if (!id) {
    notFound();
  }

  const titleData = await getTitleDetails(mediaType, id);
  if (!titleData) {
    notFound();
  }

  const trailerKey = pickBestTrailerKey(titleData.videos?.results ?? []);
  const cast = titleData.credits?.cast ?? [];
  const crew = (titleData.credits?.crew ?? []).slice(0, 6);
  const similar = titleData.similar?.results ?? [];
  const recommendations = titleData.recommendations?.results ?? [];
  const relatedTitles = recommendations.length ? recommendations : similar;

  return (
    <div className="min-h-screen bg-pitch text-white">
      <Navbar />
      <TitleHero mediaType={mediaType} titleData={titleData} trailerKey={trailerKey} />

      <main className="-mt-4 space-y-10 pb-14">
        <section className="grid gap-6 px-4 md:grid-cols-[1fr_320px] md:px-12">
          <article className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
            <h2 className="text-xl font-semibold">Synopsis</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              {titleData.overview || "No synopsis available for this title."}
            </p>
          </article>

          <aside className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
            <h2 className="text-base font-semibold text-white">Title Facts</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-zinc-400">Status</dt>
                <dd className="text-zinc-100">{titleData.status || "Unknown"}</dd>
              </div>
              <div>
                <dt className="text-zinc-400">Genres</dt>
                <dd className="text-zinc-100">
                  {titleData.genres?.map((genre) => genre.name).join(", ") || "N/A"}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-400">TMDB Score</dt>
                <dd className="text-zinc-100">{Number(titleData.vote_average ?? 0).toFixed(1)} / 10</dd>
              </div>
            </dl>
          </aside>
        </section>

        {crew.length ? (
          <section className="space-y-4 px-4 md:px-12">
            <h2 className="text-xl font-semibold text-white">Crew Highlights</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {crew.map((member) => (
                <article key={`${member.id}-${member.job}`} className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
                  <p className="font-medium text-zinc-100">{member.name}</p>
                  <p className="text-sm text-zinc-400">{member.job || member.department || "Crew"}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <TitleCastRow cast={cast} />
        <TitleRecommendations heading="More Like This" fallbackMediaType={mediaType} movies={relatedTitles} />
      </main>
    </div>
  );
}

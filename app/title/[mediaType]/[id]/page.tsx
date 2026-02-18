import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getAppEnv } from "@/lib/env";
import { getTitleDetails, type TitleDetails, type TitleVideo } from "@/lib/tmdb";
import { TitleHero } from "@/features/title/components/TitleHero";
import { TitleTrailer } from "@/features/title/components/TitleTrailer";
import { PeopleStrip } from "@/features/title/components/PeopleStrip";
import { RelatedRails } from "@/features/title/components/RelatedRails";
import { isMediaTypeParam, type TitleRouteParams } from "@/types/routes";

export const dynamic = "force-dynamic";

type PageParams = TitleRouteParams;

function pickTrailerKey(videos: ReadonlyArray<TitleVideo>): string | null {
  const youtube = videos.filter((v) => v.site === "YouTube");
  if (youtube.length === 0) return null;

  const score = (v: TitleVideo) => {
    const type = v.type.toLowerCase();
    if (type === "trailer" && v.official) return 5;
    if (type === "trailer") return 4;
    if (type === "teaser") return 3;
    if (type === "clip") return 2;
    return 1;
  };

  return youtube.slice().sort((a, b) => score(b) - score(a))[0]?.key ?? null;
}

async function loadDetails(params: PageParams): Promise<TitleDetails | null> {
  if (!isMediaTypeParam(params.mediaType)) return null;
  const id = Number(params.id);
  if (!Number.isFinite(id)) return null;
  return await getTitleDetails(params.mediaType, id);
}

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const env = getAppEnv();
  if (!env.tmdbApiKey) {
    return {
      title: "MFLIX | Title",
      description: "Add TMDB_API_KEY to enable title details."
    };
  }

  const details = await loadDetails(params);
  if (!details) {
    return {
      title: "MFLIX | Title not found",
      description: "We could not find this title."
    };
  }

  const image = details.backdropPath || details.posterPath;
  const images = image ? [`${env.tmdbImageBaseUrl}/w1280${image}`] : undefined;

  return {
    title: `${details.title} | MFLIX`,
    description: details.overview || `Watch ${details.title} on MFLIX.`,
    openGraph: {
      title: `${details.title} | MFLIX`,
      description: details.overview || `Watch ${details.title} on MFLIX.`,
      images
    },
    twitter: {
      card: "summary_large_image",
      title: `${details.title} | MFLIX`,
      description: details.overview || `Watch ${details.title} on MFLIX.`,
      images
    }
  };
}

export default async function TitlePage({ params }: { params: PageParams }) {
  const env = getAppEnv();

  if (!isMediaTypeParam(params.mediaType)) {
    notFound();
  }

  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    notFound();
  }

  if (!env.tmdbApiKey) {
    return (
      <main className="min-h-screen bg-pitch text-white">
        <Navbar />
        <div className="mx-auto w-full max-w-[980px] px-4 pb-16 pt-28 md:px-12">
          <div className="rounded-xl border border-netflix/40 bg-black/70 p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.2em] text-netflix">Setup Required</p>
            <h1 className="mt-2 text-2xl font-bold">Connect TMDB to view title pages</h1>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Add <span className="font-mono text-zinc-100">TMDB_API_KEY</span> to{" "}
              <span className="font-mono text-zinc-100">.env.local</span>, then restart the dev server.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const details = await getTitleDetails(params.mediaType, id);
  if (!details) {
    notFound();
  }

  const trailerKey = pickTrailerKey(details.videos);

  return (
    <main className="min-h-screen bg-pitch text-white">
      <Navbar />
      <TitleHero details={details} />

      <div className="mx-auto w-full max-w-[1600px] space-y-12 px-4 pb-20 md:px-12">
        <section className="-mt-10 space-y-5">
          <h2 className="text-xl font-semibold text-white">Trailer</h2>
          <TitleTrailer youtubeKey={trailerKey} title={details.title} />
        </section>

        <div className="space-y-10">
          <PeopleStrip title="Cast" people={details.cast} />
          <PeopleStrip title="Crew Highlights" people={details.crewHighlights} />
        </div>

        <RelatedRails similar={details.similar} recommendations={details.recommendations} />
      </div>
    </main>
  );
}


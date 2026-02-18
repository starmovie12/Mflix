import { Suspense } from "react";
import { getMovieDetails } from "@/lib/tmdb";
import WatchPlayer from "./WatchPlayer";
import MovieRow from "@/components/MovieRow";
import type { Metadata } from "next";
import { getTitle } from "@/lib/utils";
import { DEMO_HLS_STREAMS } from "@/lib/constants";

interface PageProps {
  params: { id: string };
  searchParams: { type?: string };
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const type = (searchParams.type === "tv" ? "tv" : "movie") as "movie" | "tv";
  const details = await getMovieDetails(Number(params.id), type);
  const title = details ? getTitle(details) : "Watch";
  return { title: `${title} - MFLIX` };
}

export default async function WatchPage({ params, searchParams }: PageProps) {
  const type = (searchParams.type === "tv" ? "tv" : "movie") as "movie" | "tv";
  const details = await getMovieDetails(Number(params.id), type);

  if (!details) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-white">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">Content Not Found</h1>
          <p className="text-mflix-gray">The requested content could not be loaded.</p>
          <a href="/" className="mt-6 inline-block rounded bg-mflix-red px-6 py-3 font-semibold transition-colors hover:bg-mflix-red-hover">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  const movieTitle = getTitle(details);
  const trailer = details.videos?.results?.find(
    (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  );

  const streamIndex = details.id % DEMO_HLS_STREAMS.length;
  const hlsUrl = DEMO_HLS_STREAMS[streamIndex];

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="aspect-video w-full animate-shimmer" />}>
        <WatchPlayer
          title={movieTitle}
          hlsUrl={hlsUrl}
          trailerKey={trailer?.key ?? null}
          posterPath={details.backdrop_path}
          movieDetails={details}
        />
      </Suspense>

      {details.similar && details.similar.results.length > 0 && (
        <div className="pb-12 pt-4">
          <MovieRow title="More Like This" movies={details.similar.results} />
        </div>
      )}
    </div>
  );
}

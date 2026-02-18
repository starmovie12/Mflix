import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { getMovieDetails } from "@/lib/tmdb/endpoints";
import { getTitle, tmdbBackdrop } from "@/lib/tmdb/mappers";

const WatchPlayer = dynamic(() => import("@/components/WatchPlayer"), {
  ssr: false,
  loading: () => (
    <div className="mx-auto max-w-[1600px] px-4 pb-12 pt-24 md:px-12">
      <div className="skeleton-shimmer h-8 w-72 rounded-md" />
      <div className="skeleton-shimmer mt-5 aspect-video w-full rounded-lg" />
    </div>
  ),
});

const MOCK_HLS_STREAMS = [
  "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  "https://test-streams.mux.dev/test_001/stream.m3u8",
  "https://bitdash-a.akamaihd.net/content/MI201109210084_1/hls/master.m3u8",
];

interface WatchPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: WatchPageProps): Promise<Metadata> {
  const movieId = parseInt(params.id, 10);
  if (!Number.isFinite(movieId)) return { title: "Watch | MFLIX" };

  const movie = await getMovieDetails(movieId);
  if (!movie) return { title: "Watch | MFLIX" };

  const title = getTitle(movie);
  return {
    title: `Watch ${title}`,
    description: movie.overview?.slice(0, 160) || `Now playing: ${title}`,
  };
}

export default async function WatchPage({ params }: WatchPageProps) {
  const movieId = parseInt(params.id, 10);
  if (!Number.isFinite(movieId)) notFound();

  const movie = await getMovieDetails(movieId);
  if (!movie) notFound();

  const streamUrl = MOCK_HLS_STREAMS[Math.abs(movieId) % MOCK_HLS_STREAMS.length];

  return (
    <main className="min-h-screen bg-pitch text-white">
      <WatchPlayer movieId={movieId} movie={movie} streamUrl={streamUrl} />
    </main>
  );
}

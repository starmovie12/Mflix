import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { getMovieDetails } from "@/lib/tmdb";

const WatchPlayer = dynamic(() => import("@/components/WatchPlayer"), {
  ssr: false,
  loading: () => <div className="h-[56.25vw] min-h-[420px] w-full animate-pulse rounded-lg bg-zinc-900" />
});

const MOCK_HLS_STREAMS = [
  "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  "https://test-streams.mux.dev/test_001/stream.m3u8",
  "https://bitdash-a.akamaihd.net/content/MI201109210084_1/hls/master.m3u8"
];

interface WatchPageProps {
  params: {
    id: string;
  };
}

function pickMockStream(movieId: number) {
  const index = Math.abs(movieId) % MOCK_HLS_STREAMS.length;
  return MOCK_HLS_STREAMS[index];
}

export default async function WatchPage({ params }: WatchPageProps) {
  const movieId = Number(params.id);

  if (!Number.isFinite(movieId)) {
    notFound();
  }

  const movie = await getMovieDetails(movieId);
  if (!movie) {
    notFound();
  }

  const streamUrl = pickMockStream(movieId);

  return (
    <main className="min-h-screen bg-pitch text-white">
      <WatchPlayer movieId={movieId} movie={movie} streamUrl={streamUrl} />
    </main>
  );
}

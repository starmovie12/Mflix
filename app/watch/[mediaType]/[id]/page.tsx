import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { getTitleDetails } from "@/lib/tmdb";

const WatchPlayer = dynamic(() => import("@/components/WatchPlayer"), {
  ssr: false,
  loading: () => (
    <div className="h-[56.25vw] min-h-[420px] w-full animate-pulse rounded-lg bg-zinc-900" />
  ),
});

const MOCK_HLS_STREAMS = [
  "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  "https://test-streams.mux.dev/test_001/stream.m3u8",
  "https://bitdash-a.akamaihd.net/content/MI201109210084_1/hls/master.m3u8",
];

type MediaType = "movie" | "tv";

interface WatchPageProps {
  params: Promise<{ mediaType: string; id: string }>;
}

function pickMockStream(id: number): string {
  const index = Math.abs(id) % MOCK_HLS_STREAMS.length;
  return MOCK_HLS_STREAMS[index];
}

function isValidMediaType(value: string): value is MediaType {
  return value === "movie" || value === "tv";
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { mediaType, id } = await params;
  const numericId = Number(id);

  if (!isValidMediaType(mediaType) || !Number.isFinite(numericId)) {
    notFound();
  }

  const movie = await getTitleDetails(mediaType, numericId);
  if (!movie) {
    notFound();
  }

  const streamUrl = pickMockStream(numericId);

  return (
    <main className="min-h-screen bg-pitch text-white">
      <WatchPlayer movieId={numericId} movie={movie} streamUrl={streamUrl} />
    </main>
  );
}

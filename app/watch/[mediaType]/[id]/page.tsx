import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { getTitleDetails } from "@/lib/tmdb/server";
import type { TMDBMediaType } from "@/lib/types";

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
    mediaType: string;
    id: string;
  };
}

function isMediaType(value: string): value is TMDBMediaType {
  return value === "movie" || value === "tv";
}

function pickMockStream(titleId: number) {
  const index = Math.abs(titleId) % MOCK_HLS_STREAMS.length;
  return MOCK_HLS_STREAMS[index];
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { mediaType, id: rawId } = params;
  if (!isMediaType(mediaType)) {
    notFound();
  }

  const id = Number(rawId);
  if (!Number.isFinite(id)) {
    notFound();
  }

  const titleData = await getTitleDetails(mediaType, id);
  if (!titleData) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-pitch text-white">
      <WatchPlayer movieId={id} movie={titleData} streamUrl={pickMockStream(id)} />
    </main>
  );
}

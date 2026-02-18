"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FastForward, PlayCircle } from "lucide-react";
import { MediaCommunitySkin, MediaOutlet, MediaPlayer } from "@vidstack/react";
import type { MediaPlayerElement } from "vidstack";
import type { TMDBMovieDetails } from "@/lib/types";
import { getImageUrl, getMovieTitle } from "@/lib/tmdb";

interface WatchPlayerProps {
  movieId: number;
  movie: TMDBMovieDetails;
  streamUrl: string;
}

function formatDuration(runtime?: number) {
  if (!runtime) {
    return "Runtime unavailable";
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return `${hours}h ${minutes}m`;
}

export default function WatchPlayer({ movieId, movie, streamUrl }: WatchPlayerProps) {
  const router = useRouter();
  const playerRef = useRef<MediaPlayerElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const title = useMemo(() => getMovieTitle(movie), [movie]);
  const nextEpisodeId = movieId + 1;
  const nextEpisodeCountdown = Math.max(Math.ceil(duration - currentTime), 0);
  const showSkipIntro = currentTime >= 0 && currentTime <= 30;
  const showNextEpisode = duration > 0 && nextEpisodeCountdown <= 10;

  useEffect(() => {
    const interval = window.setInterval(() => {
      const player = playerRef.current;
      if (!player) return;

      setCurrentTime(player.currentTime || 0);
      const durationValue = Number((player as unknown as { duration?: number }).duration ?? 0);
      setDuration(durationValue);
    }, 250);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditable =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        Boolean(target?.isContentEditable);

      if (isEditable) {
        return;
      }

      const player = playerRef.current;
      if (!player) {
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();
        if (player.paused) {
          void player.play();
        } else {
          void player.pause();
        }
      }

      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        void player.enterFullscreen("media");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (showNextEpisode && nextEpisodeCountdown === 0) {
      router.push(`/watch/${nextEpisodeId}`);
    }
  }, [nextEpisodeCountdown, nextEpisodeId, router, showNextEpisode]);

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 pb-12 pt-24 md:px-12">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-netflix">Now Playing</p>
          <h1 className="mt-1 text-2xl font-bold md:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-zinc-400">{formatDuration(movie.runtime)}</p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-black/70 px-4 py-2 text-sm transition hover:border-zinc-500 hover:bg-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Browse
        </Link>
      </div>

      <div className="relative overflow-hidden rounded-lg border border-zinc-800 bg-black shadow-2xl">
        <MediaPlayer
          ref={playerRef}
          src={streamUrl}
          poster={getImageUrl(movie.backdrop_path || movie.poster_path, "original")}
          controls
          crossOrigin
          title={title}
          className="aspect-video w-full bg-black"
        >
          <MediaOutlet />
          <MediaCommunitySkin />
        </MediaPlayer>

        {showSkipIntro ? (
          <button
            type="button"
            onClick={() => {
              if (playerRef.current) {
                playerRef.current.currentTime = 90;
              }
            }}
            className="absolute bottom-20 right-5 z-20 inline-flex items-center gap-2 rounded-md bg-netflix px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
          >
            <FastForward className="h-4 w-4" />
            Skip Intro
          </button>
        ) : null}

        {showNextEpisode ? (
          <button
            type="button"
            onClick={() => router.push(`/watch/${nextEpisodeId}`)}
            className="absolute bottom-5 right-5 z-20 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-black shadow-lg transition hover:bg-zinc-200"
          >
            <PlayCircle className="h-4 w-4" />
            Next Episode in {nextEpisodeCountdown}s
          </button>
        ) : null}
      </div>

      <div className="grid gap-4 rounded-lg border border-zinc-800 bg-zinc-950/70 p-5 md:grid-cols-[1fr_auto]">
        <p className="text-sm leading-6 text-zinc-300">{movie.overview || "No description available for this title."}</p>
        <div className="text-sm text-zinc-400">
          <p className="font-medium text-white">Shortcuts</p>
          <p>Space: Play/Pause</p>
          <p>F: Fullscreen</p>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FastForward, PlayCircle } from "lucide-react";
import { MediaCommunitySkin, MediaOutlet, MediaPlayer } from "@vidstack/react";
import type { TMDBMovieDetails } from "@/types/tmdb";
import { getTitle, tmdbBackdrop, formatRuntime } from "@/lib/tmdb/mappers";
import Navbar from "@/components/Navbar";

interface WatchPlayerProps {
  movieId: number;
  movie: TMDBMovieDetails;
  streamUrl: string;
}

export default function WatchPlayer({ movieId, movie, streamUrl }: WatchPlayerProps) {
  const router = useRouter();
  const playerRef = useRef<Record<string, unknown> | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const title = useMemo(() => getTitle(movie), [movie]);
  const nextEpisodeId = movieId + 1;
  const nextEpisodeCountdown = Math.max(Math.ceil(duration - currentTime), 0);
  const showSkipIntro = currentTime >= 0 && currentTime <= 30;
  const showNextEpisode = duration > 0 && nextEpisodeCountdown <= 10;

  useEffect(() => {
    const interval = setInterval(() => {
      const player = playerRef.current as Record<string, unknown> | null;
      if (!player) return;
      setCurrentTime(Number(player.currentTime ?? 0));
      setDuration(Number(player.duration ?? 0));
    }, 250);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;

      const player = playerRef.current as Record<string, unknown> | null;
      if (!player) return;

      if (e.code === "Space") {
        e.preventDefault();
        const paused = player.paused as boolean;
        if (paused) {
          (player.play as () => void)?.();
        } else {
          (player.pause as () => void)?.();
        }
      }

      if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        (player.enterFullscreen as (target: string) => void)?.("media");
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
    <>
      <Navbar />
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 pb-12 pt-20 md:px-12">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-netflix">Now Playing</p>
            <h1 className="mt-1 text-2xl font-bold md:text-3xl">{title}</h1>
            <p className="mt-1 text-sm text-zinc-400">{formatRuntime(movie.runtime)}</p>
          </div>
          <Link
            href={`/title/movie/${movieId}`}
            className="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-black/70 px-4 py-2 text-sm transition hover:border-zinc-500 hover:bg-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Details
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-black shadow-2xl">
          <MediaPlayer
            ref={playerRef as React.Ref<never>}
            src={streamUrl}
            poster={tmdbBackdrop(movie.backdrop_path || movie.poster_path)}
            controls
            crossOrigin
            title={title}
            className="aspect-video w-full bg-black"
          >
            <MediaOutlet />
            <MediaCommunitySkin />
          </MediaPlayer>

          {showSkipIntro && (
            <button
              type="button"
              onClick={() => {
                const player = playerRef.current as Record<string, unknown> | null;
                if (player) {
                  (player as Record<string, number>).currentTime = 90;
                }
              }}
              className="absolute bottom-20 right-5 z-20 inline-flex items-center gap-2 rounded-md bg-netflix px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
            >
              <FastForward className="h-4 w-4" />
              Skip Intro
            </button>
          )}

          {showNextEpisode && (
            <button
              type="button"
              onClick={() => router.push(`/watch/${nextEpisodeId}`)}
              className="absolute bottom-5 right-5 z-20 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-black shadow-lg transition hover:bg-zinc-200"
            >
              <PlayCircle className="h-4 w-4" />
              Next Episode in {nextEpisodeCountdown}s
            </button>
          )}
        </div>

        <div className="grid gap-4 rounded-xl border border-zinc-800 bg-surface p-5 md:grid-cols-[1fr_auto]">
          <p className="text-sm leading-6 text-zinc-300">
            {movie.overview || "No description available for this title."}
          </p>
          <div className="text-sm text-zinc-400">
            <p className="font-medium text-white">Keyboard Shortcuts</p>
            <p>Space &mdash; Play / Pause</p>
            <p>F &mdash; Fullscreen</p>
          </div>
        </div>
      </div>
    </>
  );
}

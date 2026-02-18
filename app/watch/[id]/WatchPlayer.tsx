"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipForward,
  Settings,
  Star,
  Calendar,
  Clock,
  Users,
} from "lucide-react";
import type { MovieDetails } from "@/lib/types";
import { getBackdropUrl, getTitle, getYear, formatRuntime, formatVoteAverage, getProfileUrl } from "@/lib/utils";

interface WatchPlayerProps {
  title: string;
  hlsUrl: string;
  trailerKey: string | null;
  posterPath: string | null;
  movieDetails: MovieDetails;
}

export default function WatchPlayer({ title, hlsUrl, trailerKey, posterPath, movieDetails }: WatchPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSkipIntro, setShowSkipIntro] = useState(true);
  const [showNextEpisode, setShowNextEpisode] = useState(false);
  const [nextCountdown, setNextCountdown] = useState(10);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [useTrailer, setUseTrailer] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  const hideControlsTimer = useCallback(() => {
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    setShowControls(true);
    controlsTimeout.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  }, [playing]);

  useEffect(() => {
    hideControlsTimer();
    return () => {
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    };
  }, [hideControlsTimer]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTime = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration || 0);
      setShowSkipIntro(video.currentTime < 30);
      if (video.duration && video.currentTime > video.duration - 15) {
        setShowNextEpisode(true);
      }
    };

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    video.addEventListener("timeupdate", onTime);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [useTrailer]);

  useEffect(() => {
    if (!showNextEpisode) return;
    const timer = setInterval(() => {
      setNextCountdown((p) => {
        if (p <= 1) {
          clearInterval(timer);
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showNextEpisode]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") toggleFullscreen();
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === "m" || e.key === "M") toggleMute();
      if (e.key === "ArrowRight") skip(10);
      if (e.key === "ArrowLeft") skip(-10);
      if (e.key === "Escape" && showDetails) setShowDetails(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setShowDetails(false);
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
      setFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setFullscreen(false);
    }
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + seconds));
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    video.currentTime = percent * duration;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (videoRef.current) {
      videoRef.current.volume = v;
      videoRef.current.muted = v === 0;
      setMuted(v === 0);
    }
  };

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const year = getYear(movieDetails);
  const runtime = movieDetails.runtime ? formatRuntime(movieDetails.runtime) : null;
  const rating = formatVoteAverage(movieDetails.vote_average);
  const cast = movieDetails.credits?.cast?.slice(0, 6) ?? [];
  const genres = movieDetails.genres?.map((g) => g.name) ?? [];

  return (
    <div
      ref={containerRef}
      className="group relative aspect-video w-full bg-black"
      onMouseMove={hideControlsTimer}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button, a, input")) return;
        togglePlay();
      }}
    >
      {useTrailer && trailerKey ? (
        <iframe
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=0&controls=0&showinfo=0&rel=0&modestbranding=1`}
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
          title={title}
        />
      ) : (
        <video
          ref={videoRef}
          src={hlsUrl}
          poster={posterPath ? getBackdropUrl(posterPath, "original") : undefined}
          className="h-full w-full object-contain"
          playsInline
          crossOrigin="anonymous"
        />
      )}

      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50" />

            <div className="absolute left-4 top-4 z-20 flex items-center gap-4 md:left-8 md:top-6">
              <Link
                href="/"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 transition-colors hover:bg-black/80"
              >
                <ArrowLeft size={20} />
              </Link>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-4 md:px-8 md:pb-6">
              <div
                className="group/seek mb-3 h-1 w-full cursor-pointer rounded-full bg-white/30 transition-all hover:h-2"
                onClick={handleSeek}
              >
                <div
                  className="relative h-full rounded-full bg-mflix-red transition-all"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute -right-1.5 -top-1 h-3 w-3 scale-0 rounded-full bg-mflix-red transition-transform group-hover/seek:scale-100" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={togglePlay} className="transition-transform hover:scale-110" aria-label={playing ? "Pause" : "Play"}>
                    {playing ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}
                  </button>
                  <button onClick={() => skip(10)} className="transition-transform hover:scale-110" aria-label="Skip 10s">
                    <SkipForward size={22} />
                  </button>

                  <div className="group/vol flex items-center gap-2">
                    <button onClick={toggleMute} className="transition-transform hover:scale-110" aria-label={muted ? "Unmute" : "Mute"}>
                      {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={muted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="hidden h-1 w-20 cursor-pointer appearance-none rounded-full bg-white/30 accent-white group-hover/vol:block [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                    />
                  </div>

                  <span className="ml-2 text-sm text-mflix-light">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="mr-2 hidden text-sm font-medium md:block">{title}</span>
                  {trailerKey && (
                    <button
                      onClick={() => setUseTrailer(!useTrailer)}
                      className="rounded border border-white/30 px-3 py-1 text-xs transition-colors hover:bg-white/10"
                    >
                      {useTrailer ? "HLS Stream" : "Trailer"}
                    </button>
                  )}
                  <button className="transition-transform hover:scale-110" aria-label="Settings">
                    <Settings size={20} />
                  </button>
                  <button onClick={toggleFullscreen} className="transition-transform hover:scale-110" aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}>
                    {fullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSkipIntro && playing && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={() => skip(30)}
            className="absolute bottom-24 right-4 z-30 rounded border border-white/40 bg-black/60 px-6 py-2 text-sm font-semibold backdrop-blur-sm transition-all hover:bg-white/20 md:right-8"
          >
            Skip Intro
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNextEpisode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-24 right-4 z-30 flex items-center gap-3 rounded-lg bg-mflix-dark/90 p-4 backdrop-blur-sm md:right-8"
          >
            <div>
              <p className="text-xs text-mflix-gray">Next Episode</p>
              <p className="text-sm font-semibold">Playing in {nextCountdown}s</p>
            </div>
            <button
              onClick={() => setShowNextEpisode(false)}
              className="rounded bg-white px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-white/80"
            >
              <Play size={14} className="mr-1 inline" fill="black" />
              Play Now
            </button>
            <button
              onClick={() => setShowNextEpisode(false)}
              className="text-xs text-mflix-gray hover:text-white"
            >
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDetails && !playing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-end bg-gradient-to-t from-black via-black/60 to-transparent p-6 md:p-12"
          >
            <div className="max-w-3xl space-y-4">
              <h1 className="text-shadow text-3xl font-extrabold md:text-5xl">{title}</h1>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="flex items-center gap-1 text-green-400">
                  <Star size={14} fill="currentColor" /> {rating}
                </span>
                {year && (
                  <span className="flex items-center gap-1 text-mflix-gray">
                    <Calendar size={14} /> {year}
                  </span>
                )}
                {runtime && (
                  <span className="flex items-center gap-1 text-mflix-gray">
                    <Clock size={14} /> {runtime}
                  </span>
                )}
                {movieDetails.number_of_seasons && (
                  <span className="text-mflix-gray">
                    {movieDetails.number_of_seasons} Season{movieDetails.number_of_seasons > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {genres.map((g) => (
                    <span key={g} className="rounded-full bg-white/10 px-3 py-1 text-xs text-mflix-light">
                      {g}
                    </span>
                  ))}
                </div>
              )}

              {movieDetails.tagline && (
                <p className="text-sm italic text-mflix-gray">&ldquo;{movieDetails.tagline}&rdquo;</p>
              )}

              <p className="line-clamp-4 text-sm text-mflix-light/80 md:text-base">
                {movieDetails.overview}
              </p>

              {cast.length > 0 && (
                <div className="flex items-center gap-1 text-sm text-mflix-gray">
                  <Users size={14} className="mr-1" />
                  {cast.map((c) => c.name).join(", ")}
                </div>
              )}

              <button
                onClick={togglePlay}
                className="mt-2 flex items-center gap-2 rounded bg-white px-8 py-3 text-base font-bold text-black transition-all hover:bg-white/80"
              >
                <Play size={20} fill="black" /> Play
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

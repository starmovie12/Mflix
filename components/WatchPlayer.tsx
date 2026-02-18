'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MediaPlayer, MediaProvider, useMediaPlayer } from '@vidstack/react';
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

// Mock HLS stream - Big Buck Bunny public domain
const MOCK_HLS_URL = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

interface WatchPlayerProps {
  id: string;
  type: 'movie' | 'tv';
}

function PlayerOverlays({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const player = useMediaPlayer();
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [showNextEpisode, setShowNextEpisode] = useState(false);
  const [nextEpisodeCountdown, setNextEpisodeCountdown] = useState(10);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const skipIntro = useCallback(() => {
    if (player) {
      player.currentTime = 30;
      setShowSkipIntro(false);
    }
  }, [player]);

  const skipNextEpisode = useCallback(() => {
    setShowNextEpisode(false);
    setNextEpisodeCountdown(10);
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, []);

  useEffect(() => {
    if (!player) return;
    const onTimeUpdate = () => {
      const t = player.currentTime;
      if (t >= 0 && t <= 30) setShowSkipIntro(true);
      else setShowSkipIntro(false);
      const duration = player.duration;
      if (duration > 0 && duration - t <= 60 && duration - t > 0) setShowNextEpisode(true);
      else setShowNextEpisode(false);
    };
    player.addEventListener('time-update', onTimeUpdate);
    return () => player.removeEventListener('time-update', onTimeUpdate);
  }, [player]);

  useEffect(() => {
    if (!showNextEpisode) return;
    setNextEpisodeCountdown(10);
    countdownRef.current = setInterval(() => {
      setNextEpisodeCountdown((prev) => (prev <= 1 ? 10 : prev - 1));
    }, 1000);
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [showNextEpisode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!player || !containerRef.current) return;
      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        player.paused ? player.play() : player.pause();
      }
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        document.fullscreenElement ? document.exitFullscreen() : containerRef.current.requestFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [player, containerRef]);

  return (
    <>
      {showSkipIntro && (
        <div className="absolute bottom-24 right-8 z-20">
          <button
            onClick={skipIntro}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur rounded-md text-white font-semibold transition"
          >
            Skip Intro
          </button>
        </div>
      )}
      {showNextEpisode && (
        <div className="absolute bottom-24 right-8 z-20 flex items-center gap-4">
          <span className="text-white/90 text-sm">Next episode in</span>
          <button
            onClick={skipNextEpisode}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-md text-white font-semibold transition"
          >
            Cancel
          </button>
          <span className="text-white font-bold text-lg w-8 text-center">{nextEpisodeCountdown}</span>
        </div>
      )}
    </>
  );
}

export function WatchPlayer({ id, type }: WatchPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative w-full aspect-video bg-black">
      <MediaPlayer
        src={MOCK_HLS_URL}
        controls
        playsInline
        viewType="video"
        streamType="on-demand"
      >
        <MediaProvider />
        <DefaultVideoLayout icons={defaultLayoutIcons} />
        <PlayerOverlays containerRef={containerRef} />
      </MediaPlayer>

      <Link
        href="/"
        className="absolute top-4 left-4 z-30 flex items-center gap-2 px-4 py-2 rounded-md bg-black/60 hover:bg-black/80 transition text-white"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </Link>
    </div>
  );
}

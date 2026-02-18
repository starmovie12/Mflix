"use client";

import { useEffect } from "react";
import Hero from "@/components/Hero";
import ContentRow from "@/components/ContentRow";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastContainer from "@/components/ui/Toast";
import { useWatchlistStore } from "@/lib/store";
import { usePlaybackStore } from "@/lib/store";
import { useToastStore } from "@/lib/store";
import type { HeroContent, ContentRow as ContentRowType } from "@/types/tmdb";

interface HomeClientProps {
  hero: HeroContent | null;
  rows: ContentRowType[];
}

export default function HomeClient({ hero, rows }: HomeClientProps) {
  const hydrateWatchlist = useWatchlistStore((s) => s.hydrate);
  const hydratePlayback = usePlaybackStore((s) => s.hydrate);
  const toasts = useToastStore((s) => s.toasts);
  const dismissToast = useToastStore((s) => s.dismissToast);

  useEffect(() => {
    hydrateWatchlist();
    hydratePlayback();
  }, [hydrateWatchlist, hydratePlayback]);

  return (
    <div className="min-h-screen bg-pitch text-white">
      <Navbar />
      <Hero hero={hero} />

      <main className="relative z-10 -mt-24 space-y-8 pb-16 sm:space-y-10">
        {rows.map((row) => (
          <ContentRow key={row.id} row={row} />
        ))}
      </main>

      <Footer />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

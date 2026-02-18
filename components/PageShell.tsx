"use client";

import { useEffect, type ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastContainer from "@/components/ui/Toast";
import { useWatchlistStore, useToastStore, usePlaybackStore } from "@/lib/store";

interface PageShellProps {
  children: ReactNode;
}

export default function PageShell({ children }: PageShellProps) {
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
      {children}
      <Footer />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

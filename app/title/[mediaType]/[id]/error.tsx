"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[Title Page] error boundary", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-pitch px-4 text-white">
      <p className="text-xs uppercase tracking-[0.2em] text-netflix">Something went wrong</p>
      <h1 className="text-center text-3xl font-bold">We couldn’t load this title</h1>
      <p className="max-w-md text-center text-sm text-zinc-400">Try again, or go back to browsing.</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-md bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
        >
          Retry
        </button>
        <Link
          href="/"
          className="rounded-md border border-zinc-700 bg-black/60 px-5 py-2 text-sm font-semibold text-white transition hover:border-zinc-500 hover:bg-zinc-900"
        >
          Back Home
        </Link>
      </div>
    </main>
  );
}


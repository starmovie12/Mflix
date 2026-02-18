"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[Global] error boundary", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-pitch text-white">
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
          <p className="text-xs uppercase tracking-[0.2em] text-netflix">MFLIX</p>
          <h1 className="text-center text-3xl font-bold">Something went wrong</h1>
          <p className="max-w-md text-center text-sm text-zinc-400">
            We hit an unexpected error. You can retry, or return to the homepage.
          </p>
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
      </body>
    </html>
  );
}


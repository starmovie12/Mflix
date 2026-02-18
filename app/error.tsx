"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-pitch px-4 text-white">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-900/30">
        <AlertTriangle className="h-10 w-10 text-red-400" />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 max-w-md text-sm text-zinc-400">
          We encountered an unexpected error. Please try again or return to the homepage.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-md bg-zinc-800 px-5 py-2.5 text-sm font-semibold transition hover:bg-zinc-700"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md bg-netflix px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-netflix-dark"
        >
          Back Home
        </Link>
      </div>
    </main>
  );
}

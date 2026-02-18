"use client";

import Link from "next/link";
import { useEffect } from "react";
import Button from "@/components/ui/button";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-pitch text-white">
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-netflix">Something went wrong</p>
          <h1 className="max-w-2xl text-3xl font-bold">MFLIX failed to load this page</h1>
          <p className="max-w-xl text-sm text-zinc-300">
            Please retry the action. If this persists, refresh the browser or return to the homepage.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button type="button" variant="primary" onClick={reset}>
              Try Again
            </Button>
            <Link href="/">
              <Button type="button" variant="ghost">
                Back Home
              </Button>
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}

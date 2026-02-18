"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="mb-2 text-6xl font-extrabold text-mflix-red">Oops!</h1>
      <h2 className="mb-4 text-xl font-bold text-white">Something went wrong</h2>
      <p className="mb-8 max-w-md text-mflix-gray">
        We&apos;re having trouble loading this page. Please try again.
      </p>
      <button
        onClick={reset}
        className="rounded bg-mflix-red px-8 py-3 font-bold text-white transition-all hover:bg-mflix-red-hover"
      >
        Try Again
      </button>
    </div>
  );
}

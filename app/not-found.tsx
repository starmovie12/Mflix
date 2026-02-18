import Link from "next/link";
import { Search } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-pitch px-4 text-white">
      <div className="text-center">
        <p className="text-8xl font-black text-netflix">404</p>
        <h1 className="mt-4 text-2xl font-bold">Lost your way?</h1>
        <p className="mt-2 max-w-md text-sm text-zinc-400">
          Sorry, we can&apos;t find that page. You&apos;ll find loads to explore on the homepage.
        </p>
      </div>
      <div className="flex gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
        >
          MFLIX Home
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-transparent px-6 py-2.5 text-sm font-semibold text-white transition hover:border-zinc-500"
        >
          <Search className="h-4 w-4" />
          Search
        </Link>
      </div>
      <p className="mt-4 text-xs text-zinc-600">
        Error Code: <span className="text-zinc-400">NSES-404</span>
      </p>
    </main>
  );
}

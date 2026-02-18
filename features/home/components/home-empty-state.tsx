import Link from "next/link";
import Button from "@/components/ui/button";

export default function HomeEmptyState() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-pitch px-4 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-netflix">MFLIX</p>
      <h1 className="text-3xl font-bold text-white">Unable to load streaming catalog</h1>
      <div className="max-w-md space-y-3 text-sm text-zinc-300">
        <p>TMDB data is currently unavailable or not configured.</p>
        <p>
          Add <code>TMDB_API_KEY</code> in your host environment variables (or <code>.env.local</code> for local
          development), then redeploy or refresh.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button variant="primary">Try Again</Button>
        </Link>
        <Link href="/api/health/tmdb" target="_blank" rel="noreferrer">
          <Button variant="ghost">TMDB Health Check</Button>
        </Link>
      </div>
    </main>
  );
}

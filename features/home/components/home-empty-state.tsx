import Link from "next/link";
import Button from "@/components/ui/button";

export default function HomeEmptyState() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-pitch px-4 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-netflix">MFLIX</p>
      <h1 className="text-3xl font-bold text-white">Unable to load streaming catalog</h1>
      <p className="max-w-md text-sm text-zinc-300">
        TMDB data is currently unavailable or not configured. Add your TMDB key in <code>.env.local</code> and
        refresh.
      </p>
      <Link href="/">
        <Button variant="primary">Try Again</Button>
      </Link>
    </main>
  );
}

import Link from "next/link";
import Button from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-pitch px-4 text-white">
      <p className="text-sm uppercase tracking-[0.2em] text-netflix">404</p>
      <h1 className="text-center text-3xl font-bold">Page not found</h1>
      <p className="max-w-md text-center text-zinc-400">
        The page or title you requested does not exist. Continue browsing the MFLIX catalog from the homepage.
      </p>
      <Link href="/">
        <Button variant="primary">Back Home</Button>
      </Link>
    </main>
  );
}

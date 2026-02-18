import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-pitch px-4 text-white">
      <p className="text-sm uppercase tracking-[0.2em] text-netflix">404</p>
      <h1 className="text-center text-3xl font-bold">Title not found</h1>
      <p className="max-w-md text-center text-zinc-400">
        We could not find the title you are looking for. Browse the catalog and continue streaming on MFLIX.
      </p>
      <Link href="/" className="rounded-md bg-netflix px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110">
        Back Home
      </Link>
    </main>
  );
}

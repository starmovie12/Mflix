import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="mb-2 text-8xl font-extrabold text-mflix-red">404</h1>
      <h2 className="mb-4 text-2xl font-bold text-white">Lost your way?</h2>
      <p className="mb-8 max-w-md text-mflix-gray">
        Sorry, we can&apos;t find that page. You&apos;ll find lots to explore on the home page.
      </p>
      <Link
        href="/"
        className="rounded bg-white px-8 py-3 font-bold text-black transition-all hover:bg-white/80"
      >
        MFLIX Home
      </Link>
    </div>
  );
}

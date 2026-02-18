import Link from "next/link";

const FOOTER_LINKS = [
  { label: "FAQ", href: "#" },
  { label: "Help Center", href: "#" },
  { label: "Terms of Use", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Cookie Preferences", href: "#" },
  { label: "Corporate Information", href: "#" },
];

export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-[1800px] border-t border-zinc-800/50 px-4 py-12 md:px-12">
      <div className="space-y-6">
        <p className="text-sm text-zinc-500">Questions? Contact us.</p>
        <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4" aria-label="Footer navigation">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs text-zinc-500 transition hover:text-zinc-300 hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-zinc-600">
          MFLIX &mdash; A demo streaming platform. Not affiliated with any streaming service. Powered by{" "}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 underline"
          >
            TMDB
          </a>
          .
        </p>
      </div>
    </footer>
  );
}

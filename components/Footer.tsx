import Link from "next/link";

const FOOTER_LINKS = [
  "Audio Description", "Help Center", "Gift Cards", "Media Center",
  "Investor Relations", "Jobs", "Terms of Use", "Privacy",
  "Legal Notices", "Cookie Preferences", "Corporate Information", "Contact Us",
];

export default function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-4 pb-12 pt-20 md:px-12">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {FOOTER_LINKS.map((link) => (
          <Link
            key={link}
            href="#"
            className="text-xs text-mflix-gray underline-offset-2 transition-colors hover:text-mflix-light hover:underline"
          >
            {link}
          </Link>
        ))}
      </div>
      <p className="mt-8 text-xs text-mflix-gray/60">
        &copy; {new Date().getFullYear()} MFLIX. This is a demo project. Not affiliated with Netflix.
      </p>
    </footer>
  );
}

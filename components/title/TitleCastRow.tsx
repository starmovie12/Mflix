import Image from "next/image";
import type { TMDBCreditPerson } from "@/lib/types";
import { getImageUrl } from "@/lib/tmdb";

interface TitleCastRowProps {
  cast: TMDBCreditPerson[];
}

export default function TitleCastRow({ cast }: TitleCastRowProps) {
  if (!cast.length) {
    return null;
  }

  return (
    <section className="space-y-4 px-4 md:px-12">
      <h2 className="text-xl font-semibold text-white">Top Cast</h2>
      <div className="row-scroll flex gap-3 overflow-x-auto pb-3">
        {cast.slice(0, 14).map((person) => (
          <article
            key={person.id}
            className="w-[132px] flex-none overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/70"
          >
            <div className="relative h-[160px] w-full">
              <Image
                src={getImageUrl(person.profile_path, "w300")}
                alt={person.name}
                fill
                sizes="132px"
                className="object-cover"
              />
            </div>
            <div className="space-y-1 p-3">
              <p className="line-clamp-1 text-sm font-semibold text-zinc-100">{person.name}</p>
              <p className="line-clamp-1 text-xs text-zinc-400">{person.character || person.job || "Cast"}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

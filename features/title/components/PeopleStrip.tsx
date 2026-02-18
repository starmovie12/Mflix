import Image from "next/image";
import { getTmdbImageUrl, type TitleCreditPerson } from "@/lib/tmdb";

type PeopleStripProps = {
  title: string;
  people: ReadonlyArray<TitleCreditPerson>;
};

export function PeopleStrip({ title, people }: PeopleStripProps) {
  if (people.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="row-scroll flex gap-3 overflow-x-auto pb-2">
        {people.map((person) => {
          const src = getTmdbImageUrl(person.profilePath, "w185");
          return (
            <article
              key={person.id}
              className="w-[132px] flex-none overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/60"
            >
              <Image
                src={src}
                alt={person.name}
                width={185}
                height={278}
                sizes="132px"
                className="h-[160px] w-full object-cover"
              />
              <div className="space-y-1 p-3">
                <p className="line-clamp-1 text-sm font-semibold text-white">{person.name}</p>
                {person.role ? <p className="line-clamp-2 text-xs text-zinc-400">{person.role}</p> : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}


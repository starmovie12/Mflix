export default function Loading() {
  return (
    <main className="min-h-screen bg-pitch text-white">
      <div className="h-[62vh] w-full bg-zinc-950">
        <div className="absolute inset-x-0 top-0 h-[62vh] skeleton-shimmer" />
      </div>
      <div className="mx-auto w-full max-w-[1600px] space-y-10 px-4 pb-16 pt-10 md:px-12">
        <div className="skeleton-shimmer h-7 w-64 rounded-md" />
        <div className="skeleton-shimmer aspect-video w-full rounded-xl" />
        <div className="skeleton-shimmer h-7 w-44 rounded-md" />
        <div className="row-scroll flex gap-3 overflow-x-auto pb-2">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="skeleton-shimmer h-[220px] w-[132px] flex-none rounded-xl" />
          ))}
        </div>
      </div>
    </main>
  );
}


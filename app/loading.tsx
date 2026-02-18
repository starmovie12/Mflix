export default function Loading() {
  return (
    <main className="min-h-screen bg-pitch">
      {/* Hero skeleton */}
      <div className="relative h-[85vh] min-h-[600px] w-full">
        <div className="skeleton-shimmer absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-pitch via-pitch/50 to-transparent" />
        <div className="absolute bottom-28 left-4 space-y-4 md:left-12">
          <div className="skeleton-shimmer h-12 w-96 max-w-[80vw] rounded-lg" />
          <div className="skeleton-shimmer h-5 w-[480px] max-w-[70vw] rounded" />
          <div className="flex gap-3">
            <div className="skeleton-shimmer h-12 w-28 rounded-md" />
            <div className="skeleton-shimmer h-12 w-36 rounded-md" />
          </div>
        </div>
      </div>

      {/* Row skeletons */}
      <div className="-mt-24 space-y-10 pb-16">
        {Array.from({ length: 4 }).map((_, rowIdx) => (
          <div key={rowIdx} className="space-y-3 px-4 md:px-12">
            <div className="skeleton-shimmer h-6 w-48 rounded-md" />
            <div className="flex gap-3 overflow-hidden">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="skeleton-shimmer h-[200px] w-[135px] flex-none rounded-md sm:h-[220px] sm:w-[148px]"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

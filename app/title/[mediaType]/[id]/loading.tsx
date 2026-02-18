export default function TitleLoading() {
  return (
    <main className="min-h-screen bg-pitch">
      <div className="relative h-[60vh] min-h-[400px] w-full">
        <div className="skeleton-shimmer absolute inset-0" />
      </div>

      <div className="mx-auto max-w-[1400px] space-y-8 px-4 pb-16 md:px-12">
        <div className="-mt-32 relative z-10 space-y-4">
          <div className="skeleton-shimmer h-10 w-96 max-w-full rounded-md" />
          <div className="flex gap-3">
            <div className="skeleton-shimmer h-6 w-20 rounded-md" />
            <div className="skeleton-shimmer h-6 w-20 rounded-md" />
            <div className="skeleton-shimmer h-6 w-20 rounded-md" />
          </div>
          <div className="space-y-2">
            <div className="skeleton-shimmer h-4 w-full max-w-2xl rounded" />
            <div className="skeleton-shimmer h-4 w-3/4 max-w-xl rounded" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="skeleton-shimmer h-6 w-32 rounded-md" />
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex-none space-y-2">
                <div className="skeleton-shimmer h-[150px] w-[110px] rounded-md" />
                <div className="skeleton-shimmer h-3 w-20 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

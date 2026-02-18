export default function WatchLoading() {
  return (
    <main className="min-h-screen bg-pitch px-4 pb-12 pt-24 md:px-12">
      <div className="mx-auto max-w-[1600px] space-y-5">
        <div className="skeleton-shimmer h-8 w-72 rounded-md" />
        <div className="skeleton-shimmer aspect-video w-full rounded-lg" />
        <div className="skeleton-shimmer h-24 w-full rounded-lg" />
      </div>
    </main>
  );
}

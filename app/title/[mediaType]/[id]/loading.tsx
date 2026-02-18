export default function TitleDetailLoading() {
  return (
    <main className="min-h-screen bg-pitch pb-12 pt-24">
      <div className="skeleton-shimmer h-[52vh] w-full" />
      <div className="-mt-8 space-y-6 px-4 md:px-12">
        <div className="skeleton-shimmer h-8 w-72 rounded-md" />
        <div className="skeleton-shimmer h-24 w-full rounded-lg" />
        <div className="skeleton-shimmer h-24 w-full rounded-lg" />
      </div>
    </main>
  );
}

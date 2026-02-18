export default function TitleLoading() {
  return (
    <div className="min-h-screen bg-pitch">
      <div className="skeleton-shimmer h-[56vh] w-full" />
      <div className="mx-auto max-w-[1600px] px-4 py-8 md:px-12">
        <div className="skeleton-shimmer mb-6 h-12 w-2/3 max-w-md rounded-lg" />
        <div className="skeleton-shimmer mb-4 h-4 w-full max-w-2xl rounded" />
        <div className="skeleton-shimmer mb-4 h-4 w-3/4 max-w-xl rounded" />
        <div className="skeleton-shimmer mb-8 h-4 w-1/2 max-w-md rounded" />
        <div className="skeleton-shimmer h-32 w-full rounded-lg" />
      </div>
    </div>
  );
}

import Skeleton from "@/components/Skeleton";

export default function NewPopularLoading() {
  return (
    <main className="min-h-screen bg-pitch pt-20">
      <div className="px-4 pb-4 md:px-12">
        <div className="skeleton-shimmer h-10 w-56 rounded-lg" />
        <div className="skeleton-shimmer mt-2 h-4 w-80 rounded" />
      </div>
      <div className="space-y-10 pb-16">
        <Skeleton cards={8} variant="backdrop" />
        <Skeleton cards={8} variant="backdrop" />
        <Skeleton cards={8} />
        <Skeleton cards={8} />
      </div>
    </main>
  );
}

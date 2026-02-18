import Skeleton from "@/components/Skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen space-y-10 bg-pitch py-24">
      <Skeleton cards={12} />
      <Skeleton cards={12} />
      <Skeleton cards={12} />
    </main>
  );
}

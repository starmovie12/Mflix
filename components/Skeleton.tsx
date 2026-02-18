import { cn } from "@/lib/utils";

export function SkeletonCard({ isLarge = false }: { isLarge?: boolean }) {
  return (
    <div
      className={cn(
        "flex-shrink-0 rounded-md animate-shimmer",
        isLarge ? "h-[250px] w-[170px] md:h-[400px] md:w-[270px]" : "h-[140px] w-[250px] md:h-[160px] md:w-[300px]"
      )}
    />
  );
}

export function SkeletonRow({ isLarge = false }: { isLarge?: boolean }) {
  return (
    <div className="mb-8 space-y-3 px-4 md:px-12">
      <div className="h-6 w-48 rounded animate-shimmer" />
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} isLarge={isLarge} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="relative h-[70vh] w-full animate-shimmer md:h-[85vh]">
      <div className="absolute bottom-[15%] left-4 space-y-4 md:left-12">
        <div className="h-10 w-72 rounded animate-shimmer md:h-14 md:w-96" />
        <div className="h-4 w-96 rounded animate-shimmer md:w-[500px]" />
        <div className="h-4 w-64 rounded animate-shimmer md:w-80" />
        <div className="flex gap-3 pt-2">
          <div className="h-11 w-32 rounded animate-shimmer" />
          <div className="h-11 w-40 rounded animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

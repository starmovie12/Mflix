import Skeleton from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <main className="min-h-screen space-y-8 bg-pitch px-4 pb-12 pt-24 md:px-10">
      <Skeleton className="h-[52vh] w-full rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-7 w-52" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={`loading-row-${index}`} className="h-[230px] w-[165px] flex-none rounded-md" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-7 w-44" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={`loading-row-b-${index}`} className="h-[230px] w-[165px] flex-none rounded-md" />
          ))}
        </div>
      </div>
    </main>
  );
}

import Skeleton from "@/components/ui/skeleton";

export default function TitleLoading() {
  return (
    <main className="min-h-screen bg-pitch px-4 pb-16 pt-24 md:px-10">
      <div className="mx-auto max-w-[1500px] space-y-8">
        <Skeleton className="h-[48vh] w-full rounded-2xl" />
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    </main>
  );
}

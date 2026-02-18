export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <span className="text-4xl font-extrabold tracking-tight text-mflix-red">MFLIX</span>
        <div className="h-1 w-48 overflow-hidden rounded-full bg-mflix-dark">
          <div className="h-full w-1/3 animate-[shimmer_1s_ease-in-out_infinite] rounded-full bg-mflix-red" />
        </div>
      </div>
    </div>
  );
}

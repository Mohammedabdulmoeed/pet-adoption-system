export default function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border bg-white/70 shadow-sm backdrop-blur">
      <div className="aspect-[4/3] w-full bg-slate-200/70" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-2/3 rounded bg-slate-200/70" />
        <div className="h-4 w-1/2 rounded bg-slate-200/70" />
        <div className="h-9 w-full rounded-xl bg-slate-200/70" />
      </div>
    </div>
  );
}


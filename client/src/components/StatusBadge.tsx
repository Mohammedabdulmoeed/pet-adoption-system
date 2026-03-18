const styles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
  rejected: "bg-rose-100 text-rose-800 border-rose-200",
  available: "bg-sky-100 text-sky-800 border-sky-200",
  adopted: "bg-slate-200 text-slate-800 border-slate-300"
};

export default function StatusBadge({ status }: { status: string }) {
  const cls = styles[status] || "bg-slate-100 text-slate-800 border-slate-200";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
}


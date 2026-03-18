import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
      <div className="text-2xl font-extrabold tracking-tight">404</div>
      <div className="mt-2 text-sm text-slate-600">That page doesn’t exist.</div>
      <Link className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800" to="/">
        Go home
      </Link>
    </div>
  );
}


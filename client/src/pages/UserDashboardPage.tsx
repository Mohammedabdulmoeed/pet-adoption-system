import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import StatusBadge from "../components/StatusBadge";

type Item = {
  _id: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  petId: {
    _id: string;
    name: string;
    species: string;
    breed: string;
    age: number;
    status: "available" | "adopted";
    image?: string;
  };
};

export default function UserDashboardPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    api
      .get("/adoptions/mine")
      .then((res) => {
        if (!alive) return;
        setItems((res.data as { items: Item[] }).items);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.response?.data?.message || "Failed to load your applications");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">My adoption applications</h1>
      <p className="mt-1 text-sm text-slate-600">Track your application statuses (pending/approved/rejected).</p>

      <div className="mt-6 rounded-xl border bg-white shadow-sm">
        {loading && <div className="p-5 text-sm text-slate-600">Loading…</div>}
        {error && <div className="p-5 text-sm text-rose-800">{error}</div>}
        {!loading && !error && items.length === 0 && (
          <div className="p-5 text-sm text-slate-600">
            No applications yet. <Link className="font-semibold text-slate-900 underline" to="/">Browse pets</Link>.
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-4 py-3">Pet</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a._id} className="border-b last:border-b-0">
                    <td className="px-4 py-3">
                      <Link className="font-semibold text-slate-900 underline" to={`/pets/${a.petId._id}`}>
                        {a.petId.name}
                      </Link>
                      <div className="text-xs text-slate-600">
                        {a.petId.species} • {a.petId.breed} • {a.petId.age} yrs
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-600">{new Date(a.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


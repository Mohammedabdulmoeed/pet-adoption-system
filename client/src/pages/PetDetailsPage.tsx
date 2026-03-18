import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";
import type { Pet } from "../components/PetCard";

type AdoptionItem = {
  _id: string;
  status: "pending" | "approved" | "rejected";
  petId: { _id: string };
};

export default function PetDetailsPage() {
  const { id = "" } = useParams();
  const { isAuthenticated, user } = useAuth();

  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [myAdoptions, setMyAdoptions] = useState<AdoptionItem[]>([]);
  const [adoptLoading, setAdoptLoading] = useState(false);

  const myApplication = useMemo(() => {
    return myAdoptions.find((a) => a.petId?._id === id) || null;
  }, [myAdoptions, id]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");

    api
      .get(`/pets/${id}`)
      .then((res) => {
        if (!alive) return;
        setPet((res.data as { pet: Pet }).pet);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.response?.data?.message || "Failed to load pet");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "user") return;
    api
      .get("/adoptions/mine")
      .then((res) => setMyAdoptions((res.data as { items: AdoptionItem[] }).items))
      .catch(() => {
        // ignore
      });
  }, [isAuthenticated, user?.role]);

  async function adopt() {
    if (!pet) return;
    setAdoptLoading(true);
    try {
      await api.post("/adoptions", { petId: pet._id });
      toast.success("Adoption request submitted!");
      const res = await api.get("/adoptions/mine");
      setMyAdoptions((res.data as { items: AdoptionItem[] }).items);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to submit request");
    } finally {
      setAdoptLoading(false);
    }
  }

  if (loading) return <div className="rounded-xl border bg-white p-6 text-sm text-slate-600">Loading pet…</div>;
  if (error) return <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</div>;
  if (!pet) return null;

  const isAdopted = pet.status === "adopted";
  const alreadyApplied = !!myApplication;
  const canApply = isAuthenticated && user?.role === "user" && !isAdopted && !alreadyApplied;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="aspect-[4/3] w-full bg-slate-100">
          {pet.image ? (
            <img className="h-full w-full object-cover" src={pet.image} alt={pet.name} />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-400">No image</div>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{pet.name}</h1>
            <p className="mt-2 text-slate-600">
              {pet.species} • {pet.breed} • {pet.age} yrs
            </p>
          </div>
          <StatusBadge status={pet.status} />
        </div>

        {pet.description && <p className="mt-4 leading-relaxed text-slate-700">{pet.description}</p>}

        <div className="mt-6 rounded-xl border bg-white p-4">
          <div className="text-sm font-semibold text-slate-700">Adoption</div>

          {!isAuthenticated && (
            <div className="mt-2 text-sm text-slate-600">
              Please <Link className="font-semibold text-slate-900 underline" to="/login">login</Link> to apply.
            </div>
          )}

          {isAuthenticated && user?.role !== "user" && (
            <div className="mt-2 text-sm text-slate-600">Only normal users can submit adoption applications.</div>
          )}

          {isAuthenticated && user?.role === "user" && alreadyApplied && (
            <div className="mt-2 text-sm text-slate-600">
              You already applied. Status: <span className="font-semibold text-slate-900">{myApplication?.status}</span>
            </div>
          )}

          {isAdopted && <div className="mt-2 text-sm text-slate-600">This pet is already adopted.</div>}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={adopt}
              disabled={!canApply || adoptLoading}
            >
              {alreadyApplied ? "Applied" : isAdopted ? "Adopted" : adoptLoading ? "Submitting..." : "Apply to adopt"}
            </button>
            <Link className="rounded-lg border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50" to="/">
              Back to list
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import StatusBadge from "../components/StatusBadge";
import type { Pet } from "../components/PetCard";

type Adoption = {
  _id: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  userId: { _id: string; name: string; email: string; role: string };
  petId: { _id: string; name: string; species: string; breed: string; age: number; status: string };
};

type PetFormState = {
  _id?: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  description: string;
  status: "available" | "adopted";
  image: string;
};

const emptyPet: PetFormState = {
  name: "",
  species: "",
  breed: "",
  age: "0",
  description: "",
  status: "available",
  image: ""
};

function Modal({
  open,
  title,
  children,
  onClose
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="text-sm font-extrabold tracking-tight">{title}</div>
          <button className="rounded-md px-2 py-1 text-sm font-semibold hover:bg-slate-100" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<"pets" | "adoptions">("pets");

  const [pets, setPets] = useState<Pet[]>([]);
  const [petsLoading, setPetsLoading] = useState(true);

  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [adoptionsLoading, setAdoptionsLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PetFormState>(emptyPet);

  const isEditing = useMemo(() => !!form._id, [form._id]);

  function openCreate() {
    setForm(emptyPet);
    setModalOpen(true);
  }

  function openEdit(p: Pet) {
    setForm({
      _id: p._id,
      name: p.name,
      species: p.species,
      breed: p.breed,
      age: String(p.age),
      description: p.description || "",
      status: p.status,
      image: p.image || ""
    });
    setModalOpen(true);
  }

  async function loadPets() {
    setPetsLoading(true);
    try {
      const res = await api.get("/pets", { params: { page: 1, limit: 50 } });
      setPets((res.data as { items: Pet[] }).items);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to load pets");
    } finally {
      setPetsLoading(false);
    }
  }

  async function loadAdoptions() {
    setAdoptionsLoading(true);
    try {
      const res = await api.get("/adoptions");
      setAdoptions((res.data as { items: Adoption[] }).items);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to load adoptions");
    } finally {
      setAdoptionsLoading(false);
    }
  }

  useEffect(() => {
    loadPets();
    loadAdoptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function savePet(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        species: form.species.trim(),
        breed: form.breed.trim(),
        age: Number(form.age),
        description: form.description,
        status: form.status,
        image: form.image
      };
      if (isEditing) {
        await api.put(`/pets/${form._id}`, payload);
        toast.success("Pet updated");
      } else {
        await api.post("/pets", payload);
        toast.success("Pet created");
      }
      setModalOpen(false);
      await loadPets();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to save pet");
    } finally {
      setSaving(false);
    }
  }

  async function deletePet(id: string) {
    if (!confirm("Delete this pet?")) return;
    try {
      await api.delete(`/pets/${id}`);
      toast.success("Pet deleted");
      await loadPets();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to delete pet");
    }
  }

  async function setStatus(id: string, status: "approved" | "rejected") {
    try {
      await api.patch(`/adoptions/${id}/status`, { status });
      toast.success(`Application ${status}`);
      await loadAdoptions();
      await loadPets();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to update status");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Admin dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">Manage pets and review adoption applications.</p>
        </div>
        {tab === "pets" && (
          <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800" onClick={openCreate}>
            Add pet
          </button>
        )}
      </div>

      <div className="mt-6 flex gap-2">
        <button
          className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === "pets" ? "bg-slate-900 text-white" : "border bg-white hover:bg-slate-50"}`}
          onClick={() => setTab("pets")}
        >
          Pets
        </button>
        <button
          className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === "adoptions" ? "bg-slate-900 text-white" : "border bg-white hover:bg-slate-50"}`}
          onClick={() => setTab("adoptions")}
        >
          Adoption applications
        </button>
      </div>

      {tab === "pets" && (
        <div className="mt-4 rounded-xl border bg-white shadow-sm">
          {petsLoading ? (
            <div className="p-5 text-sm text-slate-600">Loading pets…</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
                  <tr>
                    <th className="px-4 py-3">Pet</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pets.map((p) => (
                    <tr key={p._id} className="border-b last:border-b-0">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{p.name}</div>
                        <div className="text-xs text-slate-600">
                          {p.species} • {p.breed} • {p.age} yrs
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button className="rounded-md border bg-white px-3 py-1.5 text-sm font-semibold hover:bg-slate-50" onClick={() => openEdit(p)}>
                            Edit
                          </button>
                          <button
                            className="rounded-md border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                            onClick={() => deletePet(p._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pets.length === 0 && (
                    <tr>
                      <td className="px-4 py-5 text-sm text-slate-600" colSpan={3}>
                        No pets found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === "adoptions" && (
        <div className="mt-4 rounded-xl border bg-white shadow-sm">
          {adoptionsLoading ? (
            <div className="p-5 text-sm text-slate-600">Loading applications…</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
                  <tr>
                    <th className="px-4 py-3">Applicant</th>
                    <th className="px-4 py-3">Pet</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adoptions.map((a) => (
                    <tr key={a._id} className="border-b last:border-b-0">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{a.userId?.name}</div>
                        <div className="text-xs text-slate-600">{a.userId?.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{a.petId?.name}</div>
                        <div className="text-xs text-slate-600">
                          {a.petId?.species} • {a.petId?.breed} • {a.petId?.age} yrs
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={a.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                            disabled={a.status !== "pending"}
                            onClick={() => setStatus(a._id, "approved")}
                          >
                            Approve
                          </button>
                          <button
                            className="rounded-md border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                            disabled={a.status !== "pending"}
                            onClick={() => setStatus(a._id, "rejected")}
                          >
                            Reject
                          </button>
                        </div>
                        <div className="mt-2 text-xs text-slate-500">{new Date(a.createdAt).toLocaleString()}</div>
                      </td>
                    </tr>
                  ))}
                  {adoptions.length === 0 && (
                    <tr>
                      <td className="px-4 py-5 text-sm text-slate-600" colSpan={4}>
                        No adoption applications.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <Modal
        open={modalOpen}
        title={isEditing ? "Edit pet" : "Add pet"}
        onClose={() => {
          if (saving) return;
          setModalOpen(false);
        }}
      >
        <form onSubmit={savePet} className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-600">Name</label>
              <input className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} required />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Species</label>
              <input className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" value={form.species} onChange={(e) => setForm((s) => ({ ...s, species: e.target.value }))} required />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-600">Breed</label>
              <input className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" value={form.breed} onChange={(e) => setForm((s) => ({ ...s, breed: e.target.value }))} required />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Age (years)</label>
              <input className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" value={form.age} onChange={(e) => setForm((s) => ({ ...s, age: e.target.value }))} inputMode="numeric" required />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">Image URL (optional)</label>
            <input className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" value={form.image} onChange={(e) => setForm((s) => ({ ...s, image: e.target.value }))} placeholder="https://..." />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">Description</label>
            <textarea className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" rows={4} value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-600">Status</label>
              <select className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as any }))}>
                <option value="available">available</option>
                <option value="adopted">adopted</option>
              </select>
            </div>
          </div>

          <button disabled={saving} className="mt-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50">
            {saving ? "Saving..." : isEditing ? "Save changes" : "Create pet"}
          </button>
        </form>
      </Modal>
    </div>
  );
}


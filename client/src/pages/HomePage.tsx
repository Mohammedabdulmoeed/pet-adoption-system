// import { useEffect, useMemo, useState } from "react";
// import { api } from "../lib/api";
// import PetCard from "../components/PetCard";
// import type { Pet } from "../components/PetCard";
// import Pagination from "../components/Pagination";
// import SkeletonCard from "../components/SkeletonCard";
// import { motion } from "framer-motion";
// import { Filter, Search, SlidersHorizontal } from "lucide-react";

// type PetsResponse = {
//   items: Pet[];
//   page: number;
//   limit: number;
//   total: number;
//   totalPages: number;
// };

// export default function HomePage() {
//   const [search, setSearch] = useState("");
//   const [species, setSpecies] = useState("");
//   const [breed, setBreed] = useState("");
//   const [ageMin, setAgeMin] = useState<string>("");
//   const [ageMax, setAgeMax] = useState<string>("");
//   const [page, setPage] = useState(1);

//   const [data, setData] = useState<PetsResponse | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string>("");

//   const params = useMemo(() => {
//     const p: Record<string, string | number> = { page, limit: 12 };
//     if (search.trim()) p.search = search.trim();
//     if (species.trim()) p.species = species.trim();
//     if (breed.trim()) p.breed = breed.trim();
//     if (ageMin !== "") p.ageMin = Number(ageMin);
//     if (ageMax !== "") p.ageMax = Number(ageMax);
//     return p;
//   }, [page, search, species, breed, ageMin, ageMax]);

//   useEffect(() => {
//     let alive = true;
//     setLoading(true);
//     setError("");
//     api
//       .get("/pets", { params })
//       .then((res) => {
//         if (!alive) return;
//         setData(res.data as PetsResponse);
//       })
//       .catch((e) => {
//         if (!alive) return;
//         setError(e?.response?.data?.message || "Failed to load pets");
//       })
//       .finally(() => {
//         if (!alive) return;
//         setLoading(false);
//       });

//     return () => {
//       alive = false;
//     };
//   }, [params]);

//   function applyFilters(e: React.FormEvent) {
//     e.preventDefault();
//     setPage(1);
//   }

//   return (
//     <div>
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.25, ease: "easeOut" }}
//         className="relative overflow-hidden rounded-3xl border bg-white/60 p-6 shadow-sm backdrop-blur"
//       >
//         <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-sky-200/40 blur-2xl" />
//         <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-200/30 blur-2xl" />

//         <div className="relative flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
//           <div>
//             <div className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700">
//               <Search size={14} />
//               Search • Filter • Adopt
//             </div>
//             <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
//               Find your next <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">best friend</span>
//             </h1>
//             <p className="mt-2 max-w-2xl text-sm text-slate-600">
//               Browse pets with pagination, search by name or breed, filter by species and age, then apply to adopt in one click.
//             </p>
//           </div>
//           <div className="text-sm font-semibold text-slate-700">{data ? `${data.total} pets` : ""}</div>
//         </div>
//       </motion.div>

//       <form onSubmit={applyFilters} className="mt-6 rounded-2xl border bg-white/70 p-4 shadow-sm backdrop-blur">
//         <div className="grid gap-3 md:grid-cols-6">
//           <div className="md:col-span-2">
//             <label className="text-xs font-semibold text-slate-600">Search (name/breed)</label>
//             <div className="mt-1 flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm shadow-sm">
//               <Search size={16} className="text-slate-400" />
//               <input
//                 className="w-full outline-none"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="e.g. Buddy, Labrador"
//               />
//             </div>
//           </div>
//           <div>
//             <label className="text-xs font-semibold text-slate-600">Species</label>
//             <input
//               className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-slate-900/10"
//               value={species}
//               onChange={(e) => setSpecies(e.target.value)}
//               placeholder="Dog, Cat..."
//             />
//           </div>
//           <div>
//             <label className="text-xs font-semibold text-slate-600">Breed</label>
//             <input
//               className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-slate-900/10"
//               value={breed}
//               onChange={(e) => setBreed(e.target.value)}
//               placeholder="Labrador..."
//             />
//           </div>
//           <div>
//             <label className="text-xs font-semibold text-slate-600">Age min</label>
//             <input
//               className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-slate-900/10"
//               value={ageMin}
//               onChange={(e) => setAgeMin(e.target.value)}
//               placeholder="0"
//               inputMode="numeric"
//             />
//           </div>
//           <div>
//             <label className="text-xs font-semibold text-slate-600">Age max</label>
//             <input
//               className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-slate-900/10"
//               value={ageMax}
//               onChange={(e) => setAgeMax(e.target.value)}
//               placeholder="15"
//               inputMode="numeric"
//             />
//           </div>
//         </div>
//         <div className="mt-3 flex flex-wrap items-center gap-2">
//           <button
//             className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
//             type="submit"
//           >
//             <Filter size={16} />
//             Apply
//           </button>
//           <button
//             type="button"
//             className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-slate-50"
//             onClick={() => {
//               setSearch("");
//               setSpecies("");
//               setBreed("");
//               setAgeMin("");
//               setAgeMax("");
//               setPage(1);
//             }}
//           >
//             <SlidersHorizontal size={16} />
//             Clear
//           </button>
//         </div>
//       </form>

//       <div className="mt-6">
//         {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}

//         {!loading && !error && data && data.items.length === 0 && (
//           <div className="rounded-2xl border bg-white/70 p-6 text-sm text-slate-600 shadow-sm backdrop-blur">
//             No pets match your filters.
//           </div>
//         )}

//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {loading &&
//             Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
//           {!loading &&
//             !error &&
//             data?.items?.map((pet) => <PetCard key={pet._id} pet={pet} />)}
//         </div>

//         {!loading && !error && data && data.items.length > 0 && (
//           <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
//         )}
//       </div>
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import PetCard from "../components/PetCard";
import type { Pet } from "../components/PetCard";
import Pagination from "../components/Pagination";
import SkeletonCard from "../components/SkeletonCard";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

type PetsResponse = {
  items: Pet[];
  page: number;
  totalPages: number;
  total: number;
};

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [page, setPage] = useState(1);

  const [data, setData] = useState<PetsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const params = useMemo(() => {
    const p: any = { page, limit: 12 };
    if (search) p.search = search;
    if (species) p.species = species;
    if (breed) p.breed = breed;
    return p;
  }, [page, search, species, breed]);

  useEffect(() => {
    setLoading(true);
    api
      .get("/pets", { params })
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [params]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-4 sm:px-8 py-6"
    >
      {/* 🔥 HERO */}
      <div className="relative h-[380px] rounded-[30px] overflow-hidden mb-10 shadow-xl">
        <img
          src="https://images.unsplash.com/photo-1537151625747-768eb6cf92b2"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

        <div className="absolute bottom-10 left-10 text-white max-w-xl">
          <h1 className="text-5xl font-extrabold">
            Find your forever friend 🐾
          </h1>
          <p className="mt-2 text-lg opacity-90">
            Discover pets waiting for a loving home
          </p>
        </div>
      </div>

      {/* 🔍 FLOATING SEARCH */}
      <form className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl rounded-2xl p-4 mb-10 sticky top-4 z-50">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm flex-1">
            <Search size={18} className="text-gray-400" />
            <input
              className="w-full outline-none text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pets..."
            />
          </div>

          <input
            className="px-4 py-2 rounded-full bg-white shadow-sm"
            placeholder="Species"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
          />

          <input
            className="px-4 py-2 rounded-full bg-white shadow-sm"
            placeholder="Breed"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
          />
        </div>
      </form>

      {/* ⏳ LOADING */}
      {loading && (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* 🐶 GRID */}
      {!loading && data && (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data.items.map((pet) => (
            <PetCard key={pet._id} pet={pet} />
          ))}
        </div>
      )}

      {/* 😢 EMPTY */}
      {!loading && data && data.items.length === 0 && (
        <div className="text-center py-10">
          <img
            src="https://source.unsplash.com/300x200/?sad-dog"
            className="mx-auto rounded-xl mb-4"
          />
          <p className="text-slate-600">No pets found 😢</p>
        </div>
      )}

      {/* 📄 PAGINATION */}
      {!loading && data && data.totalPages > 1 && (
        <div className="mt-10">
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onChange={setPage}
          />
        </div>
      )}
    </motion.div>
  );
}
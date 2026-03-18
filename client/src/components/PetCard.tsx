import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import StatusBadge from "./StatusBadge";

export type Pet = {
  _id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  description?: string;
  status: "available" | "adopted";
  image?: string;
};

export default function PetCard({ pet }: { pet: Pet }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
      className="group overflow-hidden rounded-2xl border bg-white/70 shadow-sm backdrop-blur hover:shadow-md"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {pet.image ? (
          <img
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            src={pet.image}
            alt={pet.name}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">No image</div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold leading-tight">{pet.name}</h3>
            <p className="mt-1 text-sm text-slate-600">
              {pet.species} • {pet.breed} • {pet.age} yrs
            </p>
          </div>
          <StatusBadge status={pet.status} />
        </div>
        <div className="mt-4">
          <Link
            to={`/pets/${pet._id}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            View details <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}


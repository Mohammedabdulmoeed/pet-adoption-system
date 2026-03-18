const { Pet } = require("../models/Pet");
const { ApiError } = require("../utils/ApiError");

function toNumber(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

async function listPets(req, res) {
  const page = Math.max(1, toNumber(req.query.page, 1));
  const limit = Math.min(50, Math.max(1, toNumber(req.query.limit, 12)));
  const skip = (page - 1) * limit;

  const { search, species, breed, status, ageMin, ageMax } = req.query;

  const filter = {};
  if (species) filter.species = species;
  if (breed) filter.breed = breed;
  if (status) filter.status = status;
  if (ageMin !== undefined || ageMax !== undefined) {
    filter.age = {};
    if (ageMin !== undefined) filter.age.$gte = toNumber(ageMin, 0);
    if (ageMax !== undefined) filter.age.$lte = toNumber(ageMax, 50);
  }
  if (search) {
    const q = String(search).trim();
    if (q) {
      filter.$or = [{ name: { $regex: q, $options: "i" } }, { breed: { $regex: q, $options: "i" } }];
    }
  }

  const [items, total] = await Promise.all([
    Pet.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Pet.countDocuments(filter)
  ]);

  res.json({
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  });
}

async function getPet(req, res) {
  const pet = await Pet.findById(req.params.id);
  if (!pet) throw new ApiError(404, "Pet not found");
  res.json({ pet });
}

async function createPet(req, res) {
  const pet = await Pet.create(req.body);
  res.status(201).json({ pet });
}

async function updatePet(req, res) {
  const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!pet) throw new ApiError(404, "Pet not found");
  res.json({ pet });
}

async function deletePet(req, res) {
  const pet = await Pet.findByIdAndDelete(req.params.id);
  if (!pet) throw new ApiError(404, "Pet not found");
  res.json({ ok: true });
}

module.exports = { listPets, getPet, createPet, updatePet, deletePet };


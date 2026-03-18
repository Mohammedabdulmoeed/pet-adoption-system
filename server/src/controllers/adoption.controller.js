const mongoose = require("mongoose");
const { Adoption } = require("../models/Adoption");
const { Pet } = require("../models/Pet");
const { ApiError } = require("../utils/ApiError");

async function applyToAdopt(req, res) {
  const userId = req.user.id;
  const { petId } = req.body;

  const pet = await Pet.findById(petId).select("status");
  if (!pet) throw new ApiError(404, "Pet not found");
  if (pet.status === "adopted") throw new ApiError(409, "Pet already adopted");

  const existing = await Adoption.findOne({ userId, petId }).select("_id status");
  if (existing) throw new ApiError(409, `You already applied (${existing.status})`);

  const adoption = await Adoption.create({ userId, petId, status: "pending" });
  res.status(201).json({ adoption });
}

async function listMyAdoptions(req, res) {
  const userId = req.user.id;
  const items = await Adoption.find({ userId })
    .sort({ createdAt: -1 })
    .populate("petId", "name species breed age status image");
  res.json({ items });
}

async function listAllAdoptions(req, res) {
  const items = await Adoption.find({})
    .sort({ createdAt: -1 })
    .populate("userId", "name email role")
    .populate("petId", "name species breed age status image");
  res.json({ items });
}

async function setAdoptionStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body; // approved | rejected

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const adoption = await Adoption.findById(id).session(session);
    if (!adoption) throw new ApiError(404, "Adoption not found");

    if (adoption.status !== "pending") {
      throw new ApiError(409, `Adoption already ${adoption.status}`);
    }

    if (status === "approved") {
      const pet = await Pet.findById(adoption.petId).session(session);
      if (!pet) throw new ApiError(404, "Pet not found");
      if (pet.status === "adopted") throw new ApiError(409, "Pet already adopted");

      adoption.status = "approved";
      await adoption.save({ session });

      pet.status = "adopted";
      await pet.save({ session });

      // Reject other pending applications for same pet (common real-world rule)
      await Adoption.updateMany(
        { petId: pet._id, _id: { $ne: adoption._id }, status: "pending" },
        { $set: { status: "rejected" } },
        { session }
      );
    } else if (status === "rejected") {
      adoption.status = "rejected";
      await adoption.save({ session });
    } else {
      throw new ApiError(400, "Invalid status");
    }

    await session.commitTransaction();
    await session.endSession();

    const populated = await Adoption.findById(adoption._id)
      .populate("userId", "name email role")
      .populate("petId", "name species breed age status image");

    res.json({ adoption: populated });
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
}

module.exports = { applyToAdopt, listMyAdoptions, listAllAdoptions, setAdoptionStatus };


const mongoose = require("mongoose");

const ADOPTION_STATUSES = ["pending", "approved", "rejected"];

const adoptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    petId: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true, index: true },
    status: { type: String, enum: ADOPTION_STATUSES, default: "pending", index: true }
  },
  { timestamps: true }
);

// Prevent duplicate adoption request per user+pet
adoptionSchema.index({ userId: 1, petId: 1 }, { unique: true });

const Adoption = mongoose.model("Adoption", adoptionSchema);

module.exports = { Adoption, ADOPTION_STATUSES };


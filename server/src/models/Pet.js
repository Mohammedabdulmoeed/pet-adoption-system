const mongoose = require("mongoose");

const PET_STATUSES = ["available", "adopted"];

const petSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100, index: true },
    species: { type: String, required: true, trim: true, maxlength: 50, index: true },
    breed: { type: String, required: true, trim: true, maxlength: 80, index: true },
    age: { type: Number, required: true, min: 0, max: 50, index: true },
    description: { type: String, default: "", maxlength: 2000 },
    status: { type: String, enum: PET_STATUSES, default: "available", index: true },
    image: { type: String, default: "" }
  },
  { timestamps: true }
);

petSchema.index({ name: "text", breed: "text", species: "text" });

const Pet = mongoose.model("Pet", petSchema);

module.exports = { Pet, PET_STATUSES };


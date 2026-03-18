const { z } = require("zod");
const { objectId } = require("./common");

const listPetsQuery = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  search: z.string().trim().optional(),
  species: z.string().trim().optional(),
  breed: z.string().trim().optional(),
  status: z.enum(["available", "adopted"]).optional(),
  ageMin: z.coerce.number().min(0).optional(),
  ageMax: z.coerce.number().min(0).optional()
});

const petParams = z.object({ id: objectId });

const createPetBody = z.object({
  name: z.string().trim().min(1).max(100),
  species: z.string().trim().min(1).max(50),
  breed: z.string().trim().min(1).max(80),
  age: z.coerce.number().min(0).max(50),
  description: z.string().max(2000).optional().default(""),
  status: z.enum(["available", "adopted"]).optional().default("available"),
  image: z.string().url().optional().or(z.literal("")).default("")
});

const updatePetBody = createPetBody.partial();

module.exports = { listPetsQuery, petParams, createPetBody, updatePetBody };


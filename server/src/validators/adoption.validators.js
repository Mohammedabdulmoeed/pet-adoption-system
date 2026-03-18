const { z } = require("zod");
const { objectId } = require("./common");

const applyBody = z.object({
  petId: objectId
});

const adoptionParams = z.object({
  id: objectId
});

const setStatusBody = z.object({
  status: z.enum(["approved", "rejected"])
});

module.exports = { applyBody, adoptionParams, setStatusBody };


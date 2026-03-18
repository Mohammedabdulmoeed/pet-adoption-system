const router = require("express").Router();
const { asyncHandler } = require("../utils/asyncHandler");
const { validate } = require("../middleware/validate");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const { listPets, getPet, createPet, updatePet, deletePet } = require("../controllers/pet.controller");
const { listPetsQuery, petParams, createPetBody, updatePetBody } = require("../validators/pet.validators");

router.get("/", validate({ query: listPetsQuery }), asyncHandler(listPets));
router.get("/:id", validate({ params: petParams }), asyncHandler(getPet));

router.post(
  "/",
  authenticate,
  authorizeRoles("admin"),
  validate({ body: createPetBody }),
  asyncHandler(createPet)
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  validate({ params: petParams, body: updatePetBody }),
  asyncHandler(updatePet)
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  validate({ params: petParams }),
  asyncHandler(deletePet)
);

module.exports = router;


const router = require("express").Router();
const { asyncHandler } = require("../utils/asyncHandler");
const { validate } = require("../middleware/validate");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const { applyToAdopt, listMyAdoptions, listAllAdoptions, setAdoptionStatus } = require("../controllers/adoption.controller");
const { applyBody, adoptionParams, setStatusBody } = require("../validators/adoption.validators");

router.post("/", authenticate, validate({ body: applyBody }), asyncHandler(applyToAdopt));
router.get("/mine", authenticate, asyncHandler(listMyAdoptions));

router.get("/", authenticate, authorizeRoles("admin"), asyncHandler(listAllAdoptions));
router.patch(
  "/:id/status",
  authenticate,
  authorizeRoles("admin"),
  validate({ params: adoptionParams, body: setStatusBody }),
  asyncHandler(setAdoptionStatus)
);

module.exports = router;


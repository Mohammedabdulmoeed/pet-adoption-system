const router = require("express").Router();
const { asyncHandler } = require("../utils/asyncHandler");
const { validate } = require("../middleware/validate");
const { authenticate } = require("../middleware/auth");
const { register, login, me } = require("../controllers/auth.controller");
const { registerBody, loginBody } = require("../validators/auth.validators");

router.post("/register", validate({ body: registerBody }), asyncHandler(register));
router.post("/login", validate({ body: loginBody }), asyncHandler(login));
router.get("/me", authenticate, asyncHandler(me));

module.exports = router;


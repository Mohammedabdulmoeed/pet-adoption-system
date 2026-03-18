const { User } = require("../models/User");
const { ApiError } = require("../utils/ApiError");
const { signAccessToken } = require("../utils/jwt");

async function register(req, res) {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email }).select("_id");
  if (existing) throw new ApiError(409, "Email already registered");

  const user = await User.create({ name, email, password, role: "user" });
  const token = signAccessToken(user);
  res.status(201).json({
    token,
    user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role }
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password name email role");
  if (!user) throw new ApiError(401, "Invalid credentials");
  const ok = await user.comparePassword(password);
  if (!ok) throw new ApiError(401, "Invalid credentials");

  const token = signAccessToken(user);
  res.json({
    token,
    user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role }
  });
}

async function me(req, res) {
  res.json({ user: req.user });
}

module.exports = { register, login, me };


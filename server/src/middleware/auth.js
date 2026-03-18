const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const { ApiError } = require("../utils/ApiError");
const { User } = require("../models/User");

async function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const [, token] = header.split(" ");
  if (!token) return next(new ApiError(401, "Missing Authorization token"));

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(payload.sub).select("name email role");
    if (!user) return next(new ApiError(401, "Invalid token (user not found)"));
    req.user = { id: user._id.toString(), role: user.role, name: user.name, email: user.email };
    return next();
  } catch (e) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
}

function authorizeRoles(...roles) {
  return function roleGuard(req, res, next) {
    if (!req.user) return next(new ApiError(401, "Unauthenticated"));
    if (!roles.includes(req.user.role)) return next(new ApiError(403, "Forbidden"));
    return next();
  };
}

module.exports = { authenticate, authorizeRoles };


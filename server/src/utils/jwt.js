const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

function signAccessToken(user) {
  return jwt.sign(
    {
      role: user.role
    },
    env.JWT_SECRET,
    {
      subject: user._id.toString(),
      expiresIn: env.JWT_EXPIRES_IN
    }
  );
}

module.exports = { signAccessToken };


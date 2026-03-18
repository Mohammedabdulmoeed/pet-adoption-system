const { z } = require("zod");

const registerBody = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(6).max(100)
});

const loginBody = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1).max(100)
});

module.exports = { registerBody, loginBody };


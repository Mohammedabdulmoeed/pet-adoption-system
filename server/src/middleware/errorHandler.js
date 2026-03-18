const { ApiError } = require("../utils/ApiError");
const { ZodError } = require("zod");

function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  if (process.env.NODE_ENV !== "test") console.error(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation error",
      details: err.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message
      }))
    });
  }

  if (err && err.code === 11000) {
    return res.status(409).json({
      message: "Duplicate key error",
      details: err.keyValue
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message,
      details: err.details
    });
  }

  return res.status(500).json({
    message: "Internal server error"
  });
}

module.exports = { errorHandler };


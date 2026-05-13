const { ApiError } = require("../utils/ApiError");

const validate = (schema) => {
  return (req, res, next) => {
    // Basic validation implementation (could be hooked up with Joi/Zod later)
    // Since there wasn't a specific validation library mentioned in the tech stack,
    // we'll leave this as a wrapper.
    next();
  };
};

module.exports = { validate };

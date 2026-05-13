const { ApiError } = require("../utils/ApiError");

const validateUpdateProfile = (req, res, next) => {
  const { name } = req.body;
  if (name && name.trim() === "") {
    throw new ApiError(400, "Name cannot be empty");
  }
  next();
};

module.exports = { validateUpdateProfile };

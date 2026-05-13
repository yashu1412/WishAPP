const { ApiError } = require("../utils/ApiError");

const validateTemplate = (req, res, next) => {
  const { title, category, imageURL } = req.body;
  if (!title || !category || !imageURL) {
    throw new ApiError(400, "Title, category ID, and imageURL are required");
  }
  next();
};

module.exports = { validateTemplate };

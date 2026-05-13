const { asyncHandler } = require("../utils/asyncHandler");
const { ApiResponse } = require("../utils/ApiResponse");
const Category = require("../models/Category");

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  return res.status(200).json(new ApiResponse(200, categories, "Categories retrieved"));
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, description, coverImage } = req.body;
  const category = await Category.create({ name, slug, description, coverImage });
  return res.status(201).json(new ApiResponse(201, category, "Category created"));
});

module.exports = { getCategories, createCategory };

const { asyncHandler } = require("../utils/asyncHandler");
const { ApiResponse } = require("../utils/ApiResponse");
const Template = require("../models/Template");

const getTemplates = asyncHandler(async (req, res) => {
  const { categoryId } = req.query;
  const filter = categoryId ? { category: categoryId } : {};

  const templates = await Template.find(filter).populate("category", "name slug");
  return res.status(200).json(new ApiResponse(200, templates, "Templates fetched"));
});

const getTemplateById = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id).populate("category", "name slug");
  if (!template) {
    throw new ApiError(404, "Template not found");
  }
  return res.status(200).json(new ApiResponse(200, template, "Template fetched"));
});

const createTemplate = asyncHandler(async (req, res) => {
  const template = await Template.create(req.body);
  return res.status(201).json(new ApiResponse(201, template, "Template created"));
});

module.exports = { getTemplates, getTemplateById, createTemplate };

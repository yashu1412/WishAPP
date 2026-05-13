const { asyncHandler } = require("../utils/asyncHandler");
const { ApiResponse } = require("../utils/ApiResponse");
const ShareHistory = require("../models/ShareHistory");

const recordShare = asyncHandler(async (req, res) => {
  const { templateId, platform, generatedImageURL } = req.body;
  const userId = req.user ? req.user._id : null;

  const history = await ShareHistory.create({
    userId,
    templateId,
    platform,
    generatedImageURL,
  });

  return res.status(201).json(new ApiResponse(201, history, "Share recorded"));
});

const getShareHistory = asyncHandler(async (req, res) => {
  const history = await ShareHistory.find({ userId: req.user._id }).populate("templateId");
  return res.status(200).json(new ApiResponse(200, history, "Share history fetched"));
});

module.exports = { recordShare, getShareHistory };

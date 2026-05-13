const { asyncHandler } = require("../utils/asyncHandler");
const { ApiResponse } = require("../utils/ApiResponse");
const User = require("../models/User");
const { uploadOnCloudinary } = require("../services/cloudinary.service");

const getProfile = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, req.user, "User profile fetched successfully")
  );
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { name } },
    { new: true }
  ).select("-passwordHash");

  return res.status(200).json(
    new ApiResponse(200, updatedUser, "Profile updated successfully")
  );
});

const updatePhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Photo is required");
  }

  // File is available in memory req.file.buffer
  const cloudinaryRes = await uploadOnCloudinary(req.file.buffer, "profile_photos");

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { photoURL: cloudinaryRes.url } },
    { new: true }
  ).select("-passwordHash");

  return res.status(200).json(
    new ApiResponse(200, updatedUser, "Photo updated successfully")
  );
});

module.exports = { getProfile, updateProfile, updatePhoto };

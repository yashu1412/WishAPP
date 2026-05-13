const { asyncHandler } = require("../utils/asyncHandler");
const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/ApiError");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const registerWithEmail = asyncHandler(async (req, res) => {
  const { email, password, name, role } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const validRoles = ["user", "admin", "editor"];
  const userRole = validRoles.includes(role) ? role : "user";

  const user = await User.create({
    authMethod: "email",
    email,
    passwordHash,
    name: name || "User",
    role: userRole,
    isProfileComplete: !!name,
  });

  const token = generateToken(user._id);

  return res
    .status(201)
    .json(new ApiResponse(201, { user, token }, "User registered successfully"));
});

const loginWithEmail = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email, authMethod: "email" });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = generateToken(user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, { user, token }, "Login successful"));
});

const loginWithGoogle = asyncHandler(async (req, res) => {
  const { googleId, email, name, photoURL } = req.body;

  if (!googleId) {
    throw new ApiError(400, "Google ID is required");
  }

  let user = await User.findOne({ googleId });

  if (!user) {
    user = await User.create({
      authMethod: "google",
      googleId,
      email,
      name,
      photoURL,
      isProfileComplete: !!name,
    });
  }

  const token = generateToken(user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, { user, token }, "Google login successful"));
});

const loginAsGuest = asyncHandler(async (req, res) => {
  const user = await User.create({
    authMethod: "guest",
    name: "Guest User",
    isProfileComplete: false,
  });

  const token = generateToken(user._id);

  return res
    .status(201)
    .json(new ApiResponse(201, { user, token }, "Guest login successful"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, photoURL } = req.body;

  if (!name) {
    throw new ApiError(400, "Name is required");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        name,
        photoURL: photoURL || req.user.photoURL,
        isProfileComplete: true,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile updated successfully"));
});

module.exports = {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  loginAsGuest,
  updateProfile,
};

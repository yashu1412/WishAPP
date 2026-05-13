const { asyncHandler } = require("../utils/asyncHandler");
const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/ApiError");
const { createRazorpayOrder, verifyRazorpayPayment } = require("../services/subscription.service");
const Subscription = require("../models/Subscription");

const createOrder = asyncHandler(async (req, res) => {
  const order = await createRazorpayOrder(req.user);
  return res.status(200).json(new ApiResponse(200, order, "Razorpay order created"));
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new ApiError(400, "Missing payment details");
  }

  await verifyRazorpayPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  return res.status(200).json(new ApiResponse(200, null, "Payment verified successfully"));
});

const getStatus = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findOne({ userId: req.user._id });
  return res.status(200).json(new ApiResponse(200, subscription, "Subscription status fetched"));
});

module.exports = { createOrder, verifyPayment, getStatus };

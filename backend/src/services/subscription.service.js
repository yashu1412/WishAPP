const Razorpay = require("razorpay");
const crypto = require("crypto");
const Subscription = require("../models/Subscription");
const { ApiError } = require("../utils/ApiError");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createRazorpayOrder = async (user) => {
  const options = {
    amount: 500 * 100, // 500 INR in paise
    currency: "INR",
    receipt: `receipt_${user._id}`,
    notes: {
      userId: user._id.toString(),
      email: user.email,
    },
  };

  try {
    const order = await razorpay.orders.create(options);
    
    // Create a pending subscription record for the order
    await Subscription.findOneAndUpdate(
      { userId: user._id },
      {
        razorpayOrderId: order.id,
        status: "inactive",
      },
      { upsert: true }
    );

    return order;
  } catch (error) {
    throw new ApiError(500, "Error creating Razorpay order");
  }
};

const verifyRazorpayPayment = async (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  const body = razorpayOrderId + "|" + razorpayPaymentId;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpaySignature;

  if (isAuthentic) {
    // Payment is successful, update subscription
    await Subscription.findOneAndUpdate(
      { razorpayOrderId },
      {
        razorpayPaymentId,
        status: "active",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      }
    );
    return true;
  } else {
    throw new ApiError(400, "Payment verification failed");
  }
};

module.exports = { createRazorpayOrder, verifyRazorpayPayment };

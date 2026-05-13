const express = require("express");
const { createOrder, verifyPayment, getStatus } = require("../controllers/subscription.controller");

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.get("/status", getStatus);

module.exports = router;

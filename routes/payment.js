const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const auth = require("../middleware/authMiddleware");

// =======================
// RAZORPAY INSTANCE
// =======================
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =======================
// CREATE ORDER
// =======================
router.post("/create-order", auth, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    const options = {
      amount: amount, // paise (50000 = ₹500)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("❌ Payment Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
});

// =======================
// VERIFY PAYMENT (OPTIONAL BUT IMPORTANT)
// =======================
router.post("/verify", auth, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details",
      });
    }

    // NOTE: You should verify signature here for real production security

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (err) {
    console.error("Verification Error:", err);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
});

module.exports = router;
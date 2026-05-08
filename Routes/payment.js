const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const auth = require("../middleware/authMiddleware");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =======================
// CREATE ORDER
// =======================
router.post("/create-order", auth, async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Razorpay keys missing",
      });
    }

    const amount = req.body.amount || 49900;

    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({
      success: false,
      message: "Order creation failed",
      error: error.message,
    });
  }
});

module.exports = router;
const express = require("express");
const Stripe = require("stripe");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// CREATE CHECKOUT SESSION
router.post("/create-checkout-session", auth, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "TaskMatrix Pro Upgrade"
            },
            unit_amount: 50000 // ₹500
          },
          quantity: 1
        }
      ],
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/dashboard"
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
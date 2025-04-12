const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Initialize Stripe with secret key
const stripe = require("stripe")(process.env.STRIPE_KEY);

// Initialize Express app
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Health check or root route
app.get("/", (req, res) => {
  res.status(200).json({ message: "success" });
});

// Payment route
app.post("/payment/create", async (req, res) => {
  const total = req.query.total;

  if (total > 0) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: parseInt(total),
        currency: "usd",
      });

      res.status(201).json({
        client_secret: paymentIntent.client_secret,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(403).json({
      message: "total must be greater than 0",
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
  if (err) {
    throw err;
  } else {
    console.log(`Amazon clone is up and running on port ${PORT}`);
  }
});

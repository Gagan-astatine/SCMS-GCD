const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const crypto = require("crypto");
require("dotenv").config();

// ✅ ADD THIS (Supabase)
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // IMPORTANT
);

const app = express();
app.use(cors());
app.use(express.json());

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ CREATE ORDER
app.post("/api/payment/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json(order);
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).send("Error creating order");
  }
});

// ✅ VERIFY PAYMENT
app.post("/api/payment/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user_id,
      amount
    } = req.body;

    // 🔥 STEP 1: VERIFY SIGNATURE
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    // 🔥 STEP 2: SAVE TO DB
    const { error } = await supabase.from("payments").insert([
      {
        user_id,
        razorpay_order_id,
        razorpay_payment_id,
        amount,
        status: "success"
      }
    ]);

    if (error) {
      console.error("DB ERROR:", error);
      return res.status(500).json({ error });
    }

    res.json({ success: true });

  } catch (err) {
    console.error("VERIFY ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// START SERVER
app.listen(5000, () => console.log("Server running on port 5000"));
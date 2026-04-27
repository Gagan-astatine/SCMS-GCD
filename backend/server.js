const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

let genAI = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

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

app.post("/ai-dispatch", async (req, res) => {
  try {
    const { fleet, loads, drivers, warehouse, query } = req.body

    if (!genAI) {
      return res.json({ reply: "Error: AI is not configured. Please add your GEMINI_API_KEY to the backend/.env file and restart the server." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
You are a smart logistics AI assistant.

DATA:
Fleet: ${JSON.stringify(fleet)}
Loads: ${JSON.stringify(loads)}
Drivers: ${JSON.stringify(drivers)}
Warehouse: ${JSON.stringify(warehouse)}

USER QUERY:
${query}

TASK:
1. Identify problems
2. Explain reasons
3. Suggest actions
4. Keep answer short and structured

FORMAT:
Problems:
- ...

Reasons:
- ...

Actions:
- ...
`

    const result = await model.generateContent(prompt)
    const reply = result.response.text()

    res.json({ reply })

  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "AI failed" })
  }
})

// START SERVER
app.listen(5000, () => console.log("Server running on port 5000"));

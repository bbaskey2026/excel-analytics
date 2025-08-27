import express from "express";
import Subscriber from "../models/Subscriber.js"; // Mongoose model

const router = express.Router();

// POST /api/subscribe subribe that pages by any user to the get the latest features are updated
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Save to DB
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    res.json({ message: "Thanks for subscribing!" });
  } catch (err) {
    console.error("Subscribe error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

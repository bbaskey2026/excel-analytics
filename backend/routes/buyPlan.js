import express from "express";
import User from "../models/User.js";
import  {verifyToken} from "../middleware/auth.js";

const router = express.Router();

// Buy/Upgrade plan (fake payment)
router.post("/buy-plan", verifyToken, async (req, res) => {
  try {
    const { id, name, price } = req.body; // plan details from frontend
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update plan info and save logged-in user ID
    user.plan = {
      id,
      name,
      price,
      status: "success",
      purchasedAt: new Date(),
      userId: user._id, // store logged-in user id
    };

    await user.save();

    res.json({ message: "Plan purchased successfully", plan: user.plan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

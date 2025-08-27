// routes/user.js
import express from "express";
import User from "../models/User.js";
import { verifyToken } from "../middleware/auth.js"; // your JWT auth middleware

const router = express.Router();

// GET /api/user/me
router.get("/me", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // set by verifyToken middleware
    const user = await User.findById(userId).select("-password -__v"); // exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

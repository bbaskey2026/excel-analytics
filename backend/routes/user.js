import express from "express";
import { verifyToken } from "../middleware/auth.js";
import Upload from "../models/ExcelFile.js"; 

const router = express.Router();

// Get all uploads for the logged-in user this  fetches  alll login user withh latest that are login
router.get("/uploads", verifyToken, async (req, res) => {
  try {
    const uploads = await Upload.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(uploads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

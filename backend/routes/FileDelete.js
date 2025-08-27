// routes/file.js
import express from "express";
import ExcelFile from "../models/ExcelFile.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const file = await ExcelFile.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    // Only allow owner or admin
    if (file.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this file" });
    }

    await file.deleteOne();
    res.json({ message: "File deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

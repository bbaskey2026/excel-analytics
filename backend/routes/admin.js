import express from "express";
import User from "../models/User.js";
import File from "../models/ExcelFile.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

/**
 * @desc   Get all users
 * @route  GET /api/admin/users
 * @access Admin
 */
router.get("/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password").lean(); // hide password
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error while fetching users" });
  }
});



router.get("/files", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const files = await File.find();
    res.json(files);
  } catch (err) {
    console.error("Error fetching files:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * @desc   Get all uploaded files with user info
 * @route  GET /api/admin/files
 * @access Admin
 * 
 



 * @desc   Get analytics for all users (files + usage stats)
 * @route  GET /api/admin/analytics
 * @access Admin
 */
// Utility to format file size
const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  else if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(2) + " MB";
  else return (bytes / 1024 / 1024 / 1024).toFixed(2) + " GB";
};

router.get("/analytics", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().lean();

    const analytics = await Promise.all(
      users.map(async (user) => {
        const files = await File.find({ userId: user._id });
        const totalSize = files.reduce((acc, file) => acc + (file.size || 0), 0);

        const formattedTotalSize = formatSize(totalSize);

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          blocked: user.blocked,
          fileCount: files.length,
          totalFileSize: formattedTotalSize, // use the formatted value here
          createdAt: user.createdAt,
          lastLogin: user.lastLogin || null,
        };
      })
    );

    res.json(analytics);
  } catch (err) {
    console.error("Error fetching analytics:", err);
    res.status(500).json({ message: "Server error while fetching analytics" });
  }
});


/**
 * @desc   Delete a user and their files
 * @route  DELETE /api/admin/user/:id
 * @access Admin
 */
router.delete("/user/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    await File.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    res.json({ message: "User and their files deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Server error while deleting user" });
  }
});

/**
 * @desc   Block or Unblock a user
 * @route  PATCH /api/admin/user/block/:id
 * @access Admin
 */
router.patch("/user/block/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const { block } = req.body;

    if (typeof block !== "boolean") {
      return res.status(400).json({ message: "block must be true or false" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { blocked: block },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: block ? "User blocked successfully" : "User unblocked successfully",
      blocked: user.blocked,
    });
  } catch (err) {
    console.error("Error blocking/unblocking user:", err);
    res.status(500).json({ message: "Server error while updating user status" });
  }
});

export default router;

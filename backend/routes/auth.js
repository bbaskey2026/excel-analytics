import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * Generate JWT Token
 */
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in environment variables");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

/**
 * @route   GET /api/auth/status
 * @desc    Check if user is logged in
 */
router.get("/status", verifyToken, (req, res) => {
  if (req.user) {
    return res.json({ isLoggedIn: true, user: req.user });
  }
  res.json({ isLoggedIn: false });
});

/**
 * @route   POST /api/auth/signup
 * @desc    Register new user
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Determine role
    let userRole = "user";
    if (
      process.env.ADMIN_EMAIL &&
      email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()
    ) {
      userRole = "admin";
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    const token = generateToken(newUser._id);

    // ✅ Log signup to server
    console.log(`[INFO] New user registered: ${newUser.email} (Role: ${newUser.role})`);

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Ensure admin role if email matches
    if (
      process.env.ADMIN_EMAIL &&
      email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase() &&
      user.role !== "admin"
    ) {
      user.role = "admin";
      await user.save();
    }

    const token = generateToken(user._id);

    // ✅ Log login to server
    console.log(`[INFO] User logged in: ${user.email} (Role: ${user.role})`);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   POST /api/auth/google-auth
 * @desc    Login/Register user with Google
 */
router.post("/google-auth", async (req, res) => {
  try {
    const { email, name, googleId } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({ message: "Invalid Google data" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      let role = "user";
      if (
        process.env.ADMIN_EMAIL &&
        email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()
      ) {
        role = "admin";
      }

      user = await User.create({ name, email, googleId, role });

      // ✅ Log Google signup
      console.log(`[INFO] New user registered via Google: ${user.email} (Role: ${user.role})`);
    } else {
      // Ensure admin role if email matches
      if (
        process.env.ADMIN_EMAIL &&
        email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase() &&
        user.role !== "admin"
      ) {
        user.role = "admin";
        await user.save();
      }

      // ✅ Log Google login
      console.log(`[INFO] User logged in via Google: ${user.email} (Role: ${user.role})`);
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Google auth error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

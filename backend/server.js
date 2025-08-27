import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Filedelet from "./routes/FileDelete.js";
import rateLimit from "express-rate-limit";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";
import uploadRoutes from "./routes/upload.js";
import me from "./routes/me.js";
import buyPlan from "./routes/buyPlan.js";
import subscriber from "./routes/subscriber.js";
dotenv.config();
const app = express();

// ------------------- SECURITY MIDDLEWARE -------------------


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later"
});
app.use(limiter);

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));

// ------------------- DATABASE -------------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(" MongoDB Connected Successfully");
  } catch (error) {
    console.error(" MongoDB connection error:", error.message);
    process.exit(1);
  }
};
connectDB(); // call directly here

// ------------------- ROUTES -------------------

app.use("/api/auth", authRoutes);
app.use("/api", uploadRoutes);
app.use("/api", Filedelet);
app.use("/api/admin", adminRoutes);
app.use("/api",buyPlan);
app.use("/api",me);
app.use("/api/subscriber",subscriber);
// ------------------- ERROR HANDLING -------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// ------------------- START SERVER -------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(` Server running on port ${PORT}`));

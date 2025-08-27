import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
    },
    blocked: { type: Boolean, default: false },
    lastLogin: { type: Date },
    createdAt: { type: Date, default: Date.now },

    role: { type: String, enum: ["user", "admin"], default: "user" },
    googleId: { type: String }, // optional for Google Auth

    // --- Plan Subdocument ---
    plan: {
      id: { type: String, enum: ["free", "pro", "enterprise"], default: "free" },
      name: { type: String, default: "Free" },
      price: { type: Number, default: 0 },
      status: { type: String, enum: ["pending", "success"], default: "success" }, // payment status
      purchasedAt: { type: Date, default: Date.now },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // save logged-in user ID
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

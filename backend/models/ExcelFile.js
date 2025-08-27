// models/ExcelFile.js
import mongoose from "mongoose";

const ExcelFileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    // Optional: data for Excel/CSV
    data: { type: Array, required: false, default: undefined },
    // Optional: raw buffer for non-spreadsheet uploads
    raw: { type: Buffer, required: false },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
    versionKey: false, // remove __v
  }
);

// Index for faster queries by user and latest uploaded
ExcelFileSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("ExcelFile", ExcelFileSchema);

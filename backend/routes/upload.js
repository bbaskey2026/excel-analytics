// routes/upload.js
import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import ExcelFile from "../models/ExcelFile.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Multer in-memory storage for uploads and this can suuport upto 50mb files that send from the frontend via form data/application/json/multi-part/formdata etc
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

// ==================== Upload Files ====================
router.post("/upload", verifyToken, upload.array("file"), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const savedFiles = [];

    for (const f of req.files) {
      const isSpreadsheet = /\.(xlsx|csv)$/i.test(f.originalname);
      let parsedData = [];


      if (isSpreadsheet) {
        try {
          const workbook = xlsx.read(f.buffer, { type: "buffer" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          parsedData = xlsx.utils.sheet_to_json(sheet);
        } catch (parseError) {
          console.error(`Error parsing file ${f.originalname}:`, parseError);
        }
      }

      const doc = await ExcelFile.create({
        user: req.user.id,
        fileName: f.originalname,
        mimeType: f.mimetype,
        size: f.size,
        data: parsedData,
        raw: f.buffer,
        analysis: parsedData, // save parsed data as initial analysis
      });

      savedFiles.push(doc);
    }

    res.json({ message: "Files uploaded successfully", files: savedFiles });
  } catch (err) {
    console.error("Upload error:", err);
    next(err);
  }
});

// ==================== Analyze Single File ====================

router.post("/analyze", verifyToken, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    if (!/\.(xlsx|csv)$/i.test(req.file.originalname)) {
      return res.status(400).json({ message: "Only Excel/CSV files are supported" });
    }

    // Parse Excel/CSV file
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    // Return parsed JSON directly
    res.json({
      message: "File analyzed successfully",
      fileName: req.file.originalname,
      data: jsonData,
    });
  } catch (err) {
    console.error("Analysis error:", err);
    res.status(500).json({ message: "Failed to analyze file" });
  }
});


// Just return existing analysis data from DB
router.post("/analyze/:fileId", verifyToken, async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const file = await ExcelFile.findOne({ _id: fileId, user: req.user.id });

    if (!file) return res.status(404).json({ message: "File not found" });

    if (!file.data || file.data.length === 0) {
      return res.status(400).json({ message: "No data available to analyze" });
    }

    // Return existing parsed JSON data as analysis
    res.json({
      message: "File analysis fetched successfully",
      data: file.data, // send JSON content of the uploaded file
      fileName: file.fileName,
    });
  } catch (err) {
    console.error("Analysis error:", err);
    next(err);
  }
});

// ==================== List User Files ====================
router.get("/list", verifyToken, async (req, res) => {
  try {
    const files = await ExcelFile.find({ user: req.user.id }).select("-__v");
    const formattedFiles = files.map(file => ({
      _id: file._id,
      fileName: file.fileName,
      fileType: file.mimeType || "unknown",
      uploadDate: file.createdAt,
      data: file.data || null,
      analysis: file.analysis || null,
      size: file.size,
      raw: file.raw,
    }));

    res.json(formattedFiles);
  } catch (err) {
    console.error("Error fetching files:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== Delete File ====================
router.delete("/file/:id", verifyToken, async (req, res) => {
  try {
    const file = await ExcelFile.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!file) return res.status(404).json({ message: "File not found" });

    res.json({ message: "File deleted successfully" });
  } catch (err) {
    console.error("Error deleting file:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Multer/other error handler
router.use((err, req, res, next) => {
  if (err && err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File too large. Maximum size is 10MB." });
    }
    return res.status(400).json({ message: err.message });
  }
  console.error("Upload route error:", err);
  res.status(500).json({ message: "Failed to process request" });
});

export default router;
//her i create a two section of xlxs parsing section one is for upload and another is for the uploaded files that are recent 
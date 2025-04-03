import fs from "fs";
import path from "path";
import multer from "multer";

// Define the upload directory
const uploadDir = path.resolve("public", "uploads"); // Resolves to `project-root/public/uploads`

// Ensure the directory exists
fs.mkdirSync(uploadDir, { recursive: true });

// Allowed file types
const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "application/pdf", // For PDF uploads if needed
  "image/webp",
  "image/avif",
  "image/heic",
  "image/heif",
];

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `driver-doc-${uniqueSuffix}${ext}`);
  },
});

// File filter function 
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG, PNG, and PDF are allowed"), false);
  }
};

// Set up Multer instance
export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per file
  fileFilter,
});

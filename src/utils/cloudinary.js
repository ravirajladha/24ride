import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";


dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file to Cloudinary
 * @param {string} localFilePath - Path to the local file
 * @param {string} folder - Cloudinary folder (optional)
 * @returns {object|null} - Cloudinary response or null if upload fails
 */
const uploadOnCloudinary = async (localFilePath, folder = "24Rides") => {
  try {
    if (!localFilePath) return null;

    const ext = path.extname(localFilePath).toLowerCase(); // Get file extension
    const isPDF = ext === ".pdf";

    // Upload file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: isPDF ? "raw" : "auto", // Force PDF as "raw"
      folder: folder, // Store inside a folder
      access_mode: "public",
    });

    console.log("✅ File uploaded successfully to Cloudinary:", response.url);

    // Remove the file from local storage after upload
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);

    // Remove file from local storage if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};


export { uploadOnCloudinary };

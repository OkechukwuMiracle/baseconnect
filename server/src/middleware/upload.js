// src/config/upload.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// File validation
const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error("Invalid file type. Only JPG, PNG, WEBP, and PDF allowed.");
    }

    return {
      folder: "baseconnect/tasks",
      resource_type: "auto",
      allowed_formats: ["jpg", "png", "webp", "pdf"],
    };
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

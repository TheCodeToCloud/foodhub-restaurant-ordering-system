/**
 * config/multer.js
 *
 * Configures Multer to handle file uploads.
 * Uses memory storage so files can be converted to Base64 strings
 * and stored directly in the database, avoiding the need to write to disk.
 */

import multer from "multer";

// Use memory storage so we can convert the file buffer to Base64
const storage = multer.memoryStorage();

// Filter: accept image files only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload an image file."), false);
  }
};

// Initialize and export the multer upload instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export default upload;

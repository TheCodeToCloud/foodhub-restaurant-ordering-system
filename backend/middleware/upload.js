/**
 * middleware/upload.js
 *
 * Configures Multer to handle file uploads.
 * Saves files to the 'uploads/' directory with unique timestamp-based names.
 */

const multer = require("multer");
const path = require("path");

// Configure storage to use memory so we can save as Base64 strings directly in the database
const storage = multer.memoryStorage();

// Optional: Filter for image files only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload an image file."), false);
  }
};

// Initialize multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

module.exports = upload;

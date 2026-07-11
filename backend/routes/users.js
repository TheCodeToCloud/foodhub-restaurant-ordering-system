/**
 * routes/users.js
 *
 * Defines the Users management routes for Admins,
 * and shared profile routes for any authenticated user.
 */

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken, isAdmin } = require("../middleware/auth");
const upload = require("../middleware/upload");

// ─── Profile routes (any logged-in user) ─────────────────────────────────────
router.get("/profile", verifyToken, userController.getProfile);
router.put("/profile", verifyToken, upload.single("profile_image"), userController.updateProfile);

// ─── Admin-only routes ────────────────────────────────────────────────────────
// GET /api/users
router.get("/", verifyToken, isAdmin, userController.getAllUsers);

// DELETE /api/users/:id
router.delete("/:id", verifyToken, isAdmin, userController.deleteUser);

module.exports = router;


/**
 * routes/admin.js
 *
 * Defines the Admin-specific routes.
 */

const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyToken, isAdmin } = require("../middleware/auth");

// All admin routes require verifyToken and isAdmin
router.use(verifyToken, isAdmin);

// GET /api/admin/dashboard-stats
router.get("/dashboard-stats", adminController.getDashboardStats);

module.exports = router;

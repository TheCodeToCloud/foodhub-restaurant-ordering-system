/**
 * routes/users.js
 *
 * Defines the Users management routes for Admins.
 */

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken, isAdmin } = require("../middleware/auth");

// All user management routes are Admin-only
router.use(verifyToken, isAdmin);

// GET /api/users
router.get("/", userController.getAllUsers);

// DELETE /api/users/:id
router.delete("/:id", userController.deleteUser);

module.exports = router;

/**
 * routes/categories.js
 *
 * Defines the Category routes.
 */

const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { verifyToken, isAdmin } = require("../middleware/auth");

// GET /api/categories - Public (or protected if you prefer)
router.get("/", categoryController.getAllCategories);

// POST /api/categories - Admin only
router.post("/", verifyToken, isAdmin, categoryController.createCategory);

// PUT /api/categories/:id - Admin only
router.put("/:id", verifyToken, isAdmin, categoryController.updateCategory);

// DELETE /api/categories/:id - Admin only
router.delete("/:id", verifyToken, isAdmin, categoryController.deleteCategory);

module.exports = router;

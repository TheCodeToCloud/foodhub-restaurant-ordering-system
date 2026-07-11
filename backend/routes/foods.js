/**
 * routes/foods.js
 *
 * Defines the Foods routes, including file upload handling for the 'image' field.
 */

const express = require("express");
const router = express.Router();
const foodController = require("../controllers/foodController");
const { verifyToken, isAdmin } = require("../middleware/auth");
const upload = require("../middleware/upload");

// GET /api/foods - Public
router.get("/", foodController.getAllFoods);

// GET /api/foods/:id - Public
router.get("/:id", foodController.getFoodById);

// POST /api/foods - Admin only, handles single image upload
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.single("image"),
  foodController.createFood
);

// PUT /api/foods/:id - Admin only, handles optional image upload update
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.single("image"),
  foodController.updateFood
);

// DELETE /api/foods/:id - Admin only
router.delete("/:id", verifyToken, isAdmin, foodController.deleteFood);

module.exports = router;

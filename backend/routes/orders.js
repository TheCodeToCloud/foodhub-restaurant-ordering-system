/**
 * routes/orders.js
 *
 * Defines the Orders routes.
 */

const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { verifyToken } = require("../middleware/auth");

// All order routes require the user to be logged in
router.use(verifyToken);

// POST /api/orders
router.post("/", orderController.placeOrder);

// GET /api/orders
router.get("/", orderController.getOrders);

// PUT /api/orders/:id
router.put("/:id", orderController.updateOrderStatus);

module.exports = router;

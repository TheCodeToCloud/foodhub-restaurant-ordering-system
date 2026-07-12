import { Router } from "express";
import {
  placeOrder,
  getOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.use(verifyToken);
router.post("/", placeOrder);
router.get("/", getOrders);
router.put("/:id", updateOrderStatus);

export default router;

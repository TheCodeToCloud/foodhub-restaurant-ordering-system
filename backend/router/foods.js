import { Router } from "express";
import {
  getAllFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
} from "../controllers/foodController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = Router();

router.get("/", getAllFoods);
router.get("/:id", getFoodById);
router.post("/", verifyToken, isAdmin, upload.single("image"), createFood);
router.put("/:id", verifyToken, isAdmin, upload.single("image"), updateFood);
router.delete("/:id", verifyToken, isAdmin, deleteFood);

export default router;

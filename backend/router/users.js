import { Router } from "express";
import {
  getAllUsers,
  deleteUser,
  getProfile,
  updateProfile,
  updatePassword,
} from "../controllers/userController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = Router();

router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, upload.single("profile_image"), updateProfile);
router.put("/password", verifyToken, updatePassword);

router.get("/", verifyToken, isAdmin, getAllUsers);
router.delete("/:id", verifyToken, isAdmin, deleteUser);

export default router;

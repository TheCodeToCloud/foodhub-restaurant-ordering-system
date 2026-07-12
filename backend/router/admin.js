import { Router } from "express";
import { getDashboardStats, getSettings, updateSettings } from "../controllers/adminController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = Router();

router.use(verifyToken, isAdmin);
router.get("/dashboard-stats", getDashboardStats);
router.get("/settings", getSettings);
router.put("/settings", updateSettings);

export default router;

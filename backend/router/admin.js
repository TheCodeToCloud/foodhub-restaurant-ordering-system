import { Router } from "express";
import { getDashboardStats } from "../controllers/adminController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = Router();

router.use(verifyToken, isAdmin);
router.get("/dashboard-stats", getDashboardStats);

export default router;

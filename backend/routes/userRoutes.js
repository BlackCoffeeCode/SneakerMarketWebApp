import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { becomeAdmin, switchRole } from "../controllers/userController.js";

const router = express.Router();

router.post("/become-admin", protect, becomeAdmin);
router.post("/switch-role", protect, switchRole);

export default router;

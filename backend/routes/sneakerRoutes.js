import express from "express";
import {
  createSneaker,
  getSneakers,
  getSneakerById,
  updateSneaker,
  deleteSneaker,
} from "../controllers/sneakerController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", getSneakers);
router.get("/:id", getSneakerById);

router.post("/", protect, adminOnly, createSneaker);
router.put("/:id", protect, adminOnly, updateSneaker);
router.delete("/:id", protect, adminOnly, deleteSneaker);

export default router;

import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getItems, unlock, equip, getMe } from "../controllers/avatarController.js";

const router = express.Router();

router.get("/items", protectRoute, getItems);
router.post("/unlock", protectRoute, unlock);
router.post("/equip", protectRoute, equip);
router.get("/me", protectRoute, getMe);

export default router;

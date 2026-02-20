import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
    submitTicTacToe,
    submitRPS,
    submitTyping,
    spinWheel,
    getArcadeProfile,
    submitNumberGuess,
    submitMath,
    submitReaction,
    submitMemory,
} from "../controllers/arcadeController.js";

const router = express.Router();

router.post("/tictactoe/result", protectRoute, submitTicTacToe);
router.post("/rps/result", protectRoute, submitRPS);
router.post("/typing/result", protectRoute, submitTyping);
router.post("/spin", protectRoute, spinWheel);
router.get("/profile", protectRoute, getArcadeProfile);

// New games
router.post("/numberguess/result", protectRoute, submitNumberGuess);
router.post("/math/result", protectRoute, submitMath);
router.post("/reaction/result", protectRoute, submitReaction);
router.post("/memory/result", protectRoute, submitMemory);

export default router;

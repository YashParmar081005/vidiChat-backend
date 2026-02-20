import { awardPoints, awardCustomPoints, awardSpinPoints } from "../services/pointsService.js";
import {
    getRPSMove, getRPSResult, generateBotWPM,
    generateMathQuestion, generateBotMathTime,
    generateBotReactionTime, generateBotMemoryTime
} from "../services/botService.js";
import User from "../models/User.js";

// POST /api/arcade/tictactoe/result
export const submitTicTacToe = async (req, res) => {
    try {
        const { result } = req.body;
        if (!["win", "lose", "draw"].includes(result)) {
            return res.status(400).json({ message: "Invalid result" });
        }
        const data = await awardPoints(req.user._id, "tictactoe", result);
        res.json(data);
    } catch (error) {
        console.error("Error in submitTicTacToe:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// POST /api/arcade/rps/result
export const submitRPS = async (req, res) => {
    try {
        const { playerChoice } = req.body;
        if (!["rock", "paper", "scissors"].includes(playerChoice)) {
            return res.status(400).json({ message: "Invalid choice" });
        }

        const botChoice = getRPSMove();
        const result = getRPSResult(playerChoice, botChoice);

        let data = { botChoice, result, pointsEarned: 0, newAchievements: [], user: null };

        if (result !== "draw") {
            const awarded = await awardPoints(req.user._id, "rps", result);
            data = { ...data, ...awarded, botChoice, result };
        } else {
            const user = await User.findByIdAndUpdate(
                req.user._id,
                { $inc: { totalGames: 1 } },
                { new: true }
            ).select("-password");
            data.user = user;
        }

        res.json(data);
    } catch (error) {
        console.error("Error in submitRPS:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// POST /api/arcade/typing/result
export const submitTyping = async (req, res) => {
    try {
        const { userWPM } = req.body;
        if (typeof userWPM !== "number" || userWPM < 0 || userWPM > 300) {
            return res.status(400).json({ message: "Invalid WPM" });
        }

        const botWPM = generateBotWPM();
        const result = userWPM > botWPM ? "win" : "lose";

        const awarded = await awardPoints(req.user._id, "typing", result, { wpm: userWPM });
        res.json({ ...awarded, botWPM, result });
    } catch (error) {
        console.error("Error in submitTyping:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// POST /api/arcade/spin — weighted rewards: +1 (40%), +2 (30%), +3 (15%), +4 (10%), +5 (5%)
export const spinWheel = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user.lastSpinDate) {
            const lastSpin = new Date(user.lastSpinDate);
            const now = new Date();
            if (
                lastSpin.getFullYear() === now.getFullYear() &&
                lastSpin.getMonth() === now.getMonth() &&
                lastSpin.getDate() === now.getDate()
            ) {
                return res.status(429).json({ message: "You already spun today! Come back tomorrow." });
            }
        }

        // Weighted random
        const rand = Math.random();
        let pointsEarned;
        if (rand < 0.40) pointsEarned = 1;
        else if (rand < 0.70) pointsEarned = 2;
        else if (rand < 0.85) pointsEarned = 3;
        else if (rand < 0.95) pointsEarned = 4;
        else pointsEarned = 5;

        const data = await awardSpinPoints(req.user._id, pointsEarned);
        res.json(data);
    } catch (error) {
        console.error("Error in spinWheel:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// GET /api/arcade/profile
export const getArcadeProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select(
            "fullName profilePic points wins losses totalGames achievements lastSpinDate"
        );
        res.json(user);
    } catch (error) {
        console.error("Error in getArcadeProfile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ======================= NEW GAMES =======================

// POST /api/arcade/numberguess/result
export const submitNumberGuess = async (req, res) => {
    try {
        const { attempts, won } = req.body;
        if (typeof attempts !== "number" || attempts < 1 || attempts > 10) {
            return res.status(400).json({ message: "Invalid attempts" });
        }

        let pointsEarned;
        if (!won) {
            pointsEarned = 1;
        } else if (attempts <= 2) {
            pointsEarned = 5;
        } else if (attempts <= 4) {
            pointsEarned = 4;
        } else if (attempts <= 6) {
            pointsEarned = 3;
        } else {
            pointsEarned = 2;
        }

        const result = won ? "win" : "lose";
        const data = await awardCustomPoints(req.user._id, "numberguess", pointsEarned, result);
        res.json(data);
    } catch (error) {
        console.error("Error in submitNumberGuess:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// POST /api/arcade/math/result
export const submitMath = async (req, res) => {
    try {
        const { userAnswer, correctAnswer, answerTime, difficulty } = req.body;

        if (typeof userAnswer !== "number" || typeof correctAnswer !== "number") {
            return res.status(400).json({ message: "Invalid answer" });
        }
        if (typeof answerTime !== "number" || answerTime < 0 || answerTime > 60) {
            return res.status(400).json({ message: "Invalid time" });
        }

        const botTime = generateBotMathTime();
        const isCorrect = userAnswer === correctAnswer;
        const result = isCorrect && answerTime < botTime ? "win" : "lose";

        const data = await awardPoints(req.user._id, "math", result, { answerTime });
        res.json({ ...data, botTime, isCorrect, result });
    } catch (error) {
        console.error("Error in submitMath:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// POST /api/arcade/reaction/result
export const submitReaction = async (req, res) => {
    try {
        const { reactionTime, difficulty } = req.body;

        if (typeof reactionTime !== "number" || reactionTime < 0 || reactionTime > 5000) {
            return res.status(400).json({ message: "Invalid reaction time" });
        }

        const botReactionTime = generateBotReactionTime(difficulty || "medium");

        // Points by speed tier
        let pointsEarned;
        if (reactionTime < 200) pointsEarned = 5;
        else if (reactionTime < 300) pointsEarned = 4;
        else if (reactionTime < 400) pointsEarned = 3;
        else pointsEarned = 2;

        const result = reactionTime < botReactionTime ? "win" : "lose";

        const data = await awardCustomPoints(req.user._id, "reaction", pointsEarned, result, { duration: reactionTime });
        res.json({ ...data, botReactionTime, result });
    } catch (error) {
        console.error("Error in submitReaction:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// POST /api/arcade/memory/result
export const submitMemory = async (req, res) => {
    try {
        const { completionTime, difficulty } = req.body;

        if (typeof completionTime !== "number" || completionTime < 0 || completionTime > 300) {
            return res.status(400).json({ message: "Invalid completion time" });
        }

        const botTime = generateBotMemoryTime(difficulty || "medium");
        const result = completionTime < botTime ? "win" : "lose";

        const data = await awardPoints(req.user._id, "memory", result, { completionTime, duration: completionTime });
        res.json({ ...data, botTime, result });
    } catch (error) {
        console.error("Error in submitMemory:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

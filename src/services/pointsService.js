import User from "../models/User.js";
import GameHistory from "../models/GameHistory.js";
import { checkAchievements } from "./achievementService.js";

const POINTS_MAP = {
    tictactoe: { win: 3, draw: 2, lose: 1 },
    rps: { win: 2, draw: 0, lose: 1 },
    typing: { win: 4, draw: 0, lose: 2 },
    numberguess: { win: 3, lose: 1 },
    math: { win: 4, lose: 2 },
    reaction: { win: 4, lose: 2 },
    memory: { win: 6, lose: 3 },
};

/**
 * Awards points to a user, updates stats, logs history, and checks achievements.
 * @returns {{ pointsEarned, newAchievements, user }}
 */
export async function awardPoints(userId, gameType, result, extraData = {}) {
    let pointsEarned = POINTS_MAP[gameType]?.[result] ?? 0;

    // Bonus point logic
    if (gameType === "typing" && result === "win" && extraData.wpm > 60) {
        pointsEarned += 1;
    }
    if (gameType === "math" && result === "win" && extraData.answerTime < 2) {
        pointsEarned += 1;
    }
    if (gameType === "memory" && result === "win" && extraData.completionTime < 25) {
        pointsEarned += 1;
    }

    const updateFields = {
        $inc: {
            points: pointsEarned,
            totalGames: 1,
        },
    };

    if (result === "win") updateFields.$inc.wins = 1;
    if (result === "lose") updateFields.$inc.losses = 1;

    const user = await User.findByIdAndUpdate(userId, updateFields, { new: true }).select("-password");

    // Log game history
    await GameHistory.create({
        userId,
        gameType,
        result,
        pointsEarned,
        duration: extraData.duration || null,
    });

    // Check for new achievements
    const newAchievements = await checkAchievements(user);

    return { pointsEarned, newAchievements, user };
}

/**
 * Awards a specific number of points (for games like number guess, reaction that calc their own).
 */
export async function awardCustomPoints(userId, gameType, pointsEarned, result, extraData = {}) {
    const updateFields = {
        $inc: {
            points: pointsEarned,
            totalGames: 1,
        },
    };

    if (result === "win") updateFields.$inc.wins = 1;
    if (result === "lose") updateFields.$inc.losses = 1;

    const user = await User.findByIdAndUpdate(userId, updateFields, { new: true }).select("-password");

    await GameHistory.create({
        userId,
        gameType,
        result,
        pointsEarned,
        duration: extraData.duration || null,
    });

    const newAchievements = await checkAchievements(user);

    return { pointsEarned, newAchievements, user };
}

/**
 * Awards spin points (special case — no win/loss).
 */
export async function awardSpinPoints(userId, pointsEarned) {
    const user = await User.findByIdAndUpdate(
        userId,
        {
            $inc: { points: pointsEarned },
            $set: { lastSpinDate: new Date() },
        },
        { new: true }
    ).select("-password");

    await GameHistory.create({
        userId,
        gameType: "spin",
        result: "spin",
        pointsEarned,
    });

    const newAchievements = await checkAchievements(user);

    return { pointsEarned, newAchievements, user };
}

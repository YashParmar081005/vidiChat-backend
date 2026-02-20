import User from "../models/User.js";

const ACHIEVEMENT_DEFINITIONS = [
    { id: "first_win", name: "First Win", description: "Win your first game", check: (u) => u.wins >= 1, bonusPoints: 2 },
    { id: "10_wins", name: "10 Wins", description: "Win 10 games", check: (u) => u.wins >= 10, bonusPoints: 5 },
    { id: "50_wins", name: "50 Wins", description: "Win 50 games", check: (u) => u.wins >= 50, bonusPoints: 10 },
    { id: "100_games", name: "100 Games", description: "Play 100 games", check: (u) => u.totalGames >= 100, bonusPoints: 10 },
];

/**
 * Checks user stats against achievement definitions and unlocks any new ones.
 * Awards bonus points for each newly unlocked achievement.
 * @returns {string[]} Array of newly unlocked achievement IDs
 */
export async function checkAchievements(user) {
    const newAchievements = [];
    let totalBonusPoints = 0;

    for (const ach of ACHIEVEMENT_DEFINITIONS) {
        if (!user.achievements.includes(ach.id) && ach.check(user)) {
            newAchievements.push(ach.id);
            totalBonusPoints += ach.bonusPoints;
        }
    }

    if (newAchievements.length > 0) {
        await User.findByIdAndUpdate(user._id, {
            $push: { achievements: { $each: newAchievements } },
            $inc: { points: totalBonusPoints },
        });
    }

    return newAchievements;
}

export { ACHIEVEMENT_DEFINITIONS };

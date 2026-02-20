import User from "../models/User.js";

// GET /api/leaderboard
export const getLeaderboard = async (req, res) => {
    try {
        const users = await User.find({})
            .select("fullName profilePic points wins totalGames")
            .sort({ points: -1 })
            .limit(50);

        res.json(users);
    } catch (error) {
        console.error("Error in getLeaderboard:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

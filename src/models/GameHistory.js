import mongoose from "mongoose";

const gameHistorySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        gameType: {
            type: String,
            enum: ["tictactoe", "rps", "typing", "spin", "numberguess", "math", "reaction", "memory"],
            required: true,
        },
        result: {
            type: String,
            enum: ["win", "lose", "draw", "spin"],
            required: true,
        },
        pointsEarned: {
            type: Number,
            required: true,
            min: 0,
        },
        duration: {
            type: Number,
            default: null,
        },
    },
    { timestamps: true }
);

const GameHistory = mongoose.model("GameHistory", gameHistorySchema);

export default GameHistory;

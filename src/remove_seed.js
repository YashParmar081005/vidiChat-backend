import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const emails = [
    "john@example.com",
    "jane@example.com",
    "pierre@example.com",
    "yuki@example.com",
    "maria@example.com",
];

const removeSeedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const result = await User.deleteMany({ email: { $in: emails } });
        console.log(`Deleted ${result.deletedCount} users.`);

        process.exit(0);
    } catch (error) {
        console.error("Error removing seed data:", error);
        process.exit(1);
    }
};

removeSeedData();

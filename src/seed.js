import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const users = [
    {
        fullName: "John Doe",
        email: "john@example.com",
        password: "password123",
        profilePic: "https://api.dicebear.com/9.x/avataaars/svg?seed=John",
        nativeLanguage: "English",
        learningLanguage: "Spanish",
        location: "New York, USA",
        bio: "Love learning languages!",
        isOnboarded: true,
    },
    {
        fullName: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        profilePic: "https://api.dicebear.com/9.x/avataaars/svg?seed=Jane",
        nativeLanguage: "Spanish",
        learningLanguage: "English",
        location: "Madrid, Spain",
        bio: "Hola! I want to practice English.",
        isOnboarded: true,
    },
    {
        fullName: "Pierre Dubois",
        email: "pierre@example.com",
        password: "password123",
        profilePic: "https://api.dicebear.com/9.x/avataaars/svg?seed=Pierre",
        nativeLanguage: "French",
        learningLanguage: "Japanese",
        location: "Paris, France",
        bio: "Bonjour!",
        isOnboarded: true,
    },
    {
        fullName: "Yuki Tanaka",
        email: "yuki@example.com",
        password: "password123",
        profilePic: "https://api.dicebear.com/9.x/avataaars/svg?seed=Yuki",
        nativeLanguage: "Japanese",
        learningLanguage: "French",
        location: "Tokyo, Japan",
        bio: "Konnichiwa!",
        isOnboarded: true,
    },
    {
        fullName: "Maria Garcia",
        email: "maria@example.com",
        password: "password123",
        profilePic: "https://api.dicebear.com/9.x/avataaars/svg?seed=Maria",
        nativeLanguage: "Spanish",
        learningLanguage: "German",
        location: "Barcelona, Spain",
        bio: "Learning new things every day.",
        isOnboarded: true,
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Check if users exist before adding to avoid duplicates on re-runs
        for (const user of users) {
            const existingUser = await User.findOne({ email: user.email });
            if (!existingUser) {
                await User.create(user);
                console.log(`Created user: ${user.fullName}`);
            } else {
                console.log(`User already exists: ${user.fullName}`);
            }
        }

        console.log("Database seeded successfully");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDB();

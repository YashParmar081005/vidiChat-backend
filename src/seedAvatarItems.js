import mongoose from "mongoose";
import dotenv from "dotenv";
import AvatarItem from "./models/AvatarItem.js";

dotenv.config();

const AVATAR_ITEMS = [
    { itemId: "avatar1", name: "Starter", image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Felix", price: 0 },
    { itemId: "avatar2", name: "Explorer", image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Jasper", price: 10 },
    { itemId: "avatar3", name: "Dreamer", image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Luna", price: 20 },
    { itemId: "avatar4", name: "Spark", image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Milo", price: 30 },
    { itemId: "avatar5", name: "Blaze", image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Coco", price: 40 },
    { itemId: "avatar6", name: "Storm", image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Shadow", price: 50 },
    { itemId: "avatar7", name: "Frost", image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Snowball", price: 60 },
    { itemId: "avatar8", name: "Phoenix", image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Phoenix", price: 70 },
    { itemId: "avatar9", name: "Ninja", image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Ninja", price: 80 },
    { itemId: "avatar10", name: "Captain", image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Captain", price: 90 },
    { itemId: "avatar11", name: "Titan", image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Titan", price: 100 },
    { itemId: "avatar12", name: "Legend", image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Legend", price: 110 },
    { itemId: "avatar13", name: "Mystic", image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Mystic", price: 120 },
    { itemId: "avatar14", name: "Dragon", image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Dragon", price: 130 },
    { itemId: "avatar15", name: "Champion", image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Champion", price: 150 },
];

const seedAvatarItems = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Clear old avatar items and re-seed
        await AvatarItem.deleteMany({});
        console.log("Cleared old avatar items");

        for (const item of AVATAR_ITEMS) {
            await AvatarItem.create(item);
            console.log(`Created: ${item.name} (${item.price} pts)`);
        }

        console.log(`\n✅ Seeded ${AVATAR_ITEMS.length} avatars successfully!`);
        process.exit(0);
    } catch (error) {
        console.error("Error seeding avatar items:", error);
        process.exit(1);
    }
};

seedAvatarItems();

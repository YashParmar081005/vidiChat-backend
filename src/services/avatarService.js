import AvatarItem from "../models/AvatarItem.js";
import User from "../models/User.js";

/**
 * Returns all avatar items.
 */
export async function getAllItems() {
    return await AvatarItem.find().sort({ price: 1 });
}

/**
 * Unlock (buy) an avatar using points.
 */
export async function unlockItem(userId, itemId) {
    const item = await AvatarItem.findOne({ itemId });
    if (!item) throw { status: 404, message: "Avatar not found" };

    const user = await User.findById(userId);
    if (!user) throw { status: 404, message: "User not found" };

    if (user.unlockedAvatars.includes(itemId)) {
        throw { status: 400, message: "Avatar already unlocked" };
    }

    if (user.points < item.price) {
        throw { status: 400, message: `Not enough points. Need ${item.price}, have ${user.points}` };
    }

    user.points -= item.price;
    user.unlockedAvatars.push(itemId);
    await user.save();

    return {
        pointsSpent: item.price,
        remainingPoints: user.points,
        unlockedAvatars: user.unlockedAvatars,
    };
}

/**
 * Equip an unlocked avatar.
 */
export async function equipItem(userId, itemId) {
    const user = await User.findById(userId);
    if (!user) throw { status: 404, message: "User not found" };

    if (!user.unlockedAvatars.includes(itemId)) {
        throw { status: 400, message: "Avatar not unlocked" };
    }

    user.selectedAvatar = itemId;
    await user.save();

    return { selectedAvatar: user.selectedAvatar };
}

/**
 * Get current user's avatar data.
 */
export async function getMyAvatar(userId) {
    const user = await User.findById(userId).select("selectedAvatar unlockedAvatars points");
    if (!user) throw { status: 404, message: "User not found" };
    return {
        selectedAvatar: user.selectedAvatar,
        unlockedAvatars: user.unlockedAvatars,
        points: user.points,
    };
}

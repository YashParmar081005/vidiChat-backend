import { getAllItems, unlockItem, equipItem, getMyAvatar } from "../services/avatarService.js";

// GET /api/avatar/items
export const getItems = async (req, res) => {
    try {
        const items = await getAllItems();
        res.json(items);
    } catch (error) {
        console.error("Error in getItems:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// POST /api/avatar/unlock
export const unlock = async (req, res) => {
    try {
        const { itemId } = req.body;
        if (!itemId) return res.status(400).json({ message: "itemId is required" });

        const data = await unlockItem(req.user._id, itemId);
        res.json(data);
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        console.error("Error in unlock:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// POST /api/avatar/equip
export const equip = async (req, res) => {
    try {
        const { itemId } = req.body;
        if (!itemId) return res.status(400).json({ message: "itemId is required" });

        const data = await equipItem(req.user._id, itemId);
        res.json(data);
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        console.error("Error in equip:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// GET /api/avatar/me
export const getMe = async (req, res) => {
    try {
        const data = await getMyAvatar(req.user._id);
        res.json(data);
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        console.error("Error in getMe:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

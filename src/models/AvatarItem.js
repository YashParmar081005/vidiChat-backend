import mongoose from "mongoose";

const avatarItemSchema = new mongoose.Schema(
    {
        itemId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { timestamps: true }
);

const AvatarItem = mongoose.model("AvatarItem", avatarItemSchema);

export default AvatarItem;

import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
            index: true
        },
        mealId: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

// Create compound index to ensure one favorite per user-meal combination
FavoriteSchema.index({ userId: 1, mealId: 1 }, { unique: true });

const favorites = mongoose.models.favorites || mongoose.model("favorites", FavoriteSchema);

export default favorites;


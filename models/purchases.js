import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema(
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
        },
        mealData: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
            min: 1
        },
        purchaseDate: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

// Create compound index for user-meal combination
PurchaseSchema.index({ userId: 1, mealId: 1 });

const purchases = mongoose.models.purchases || mongoose.model("purchases", PurchaseSchema);

export default purchases;


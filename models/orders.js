import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
            index: true
        },
        items: [{
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
                min: 1
            },
            price: {
                type: Number,
                required: true
            }
        }],
        totalAmount: {
            type: Number,
            required: true
        },
        paymentStatus: {
            type: String,
            enum: ['completed', 'pending', 'failed'],
            default: 'completed'
        },
        orderDate: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

// Create index for user orders
OrderSchema.index({ userId: 1, orderDate: -1 });

const orders = mongoose.models.orders || mongoose.model("orders", OrderSchema);

export default orders;


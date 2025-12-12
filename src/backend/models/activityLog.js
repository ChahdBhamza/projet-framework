import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
            index: true
        },
        userEmail: {
            type: String,
            required: true,
            index: true
        },
        action: {
            type: String,
            required: true,
            enum: [
                "product_upload",
                "product_delete",
                "product_update",
                "order_view",
                "user_view",
                "analytics_view",
                "login",
                "logout",
                "profile_update",
                "meal_plan_generated",
                "system_action"
            ]
        },
        description: {
            type: String,
            required: true
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },
        ipAddress: {
            type: String
        },
        userAgent: {
            type: String
        }
    },
    { timestamps: true }
);

// Create indexes for better query performance
ActivityLogSchema.index({ userId: 1, createdAt: -1 });
ActivityLogSchema.index({ userEmail: 1, createdAt: -1 });
ActivityLogSchema.index({ action: 1, createdAt: -1 });
ActivityLogSchema.index({ createdAt: -1 });

const ActivityLog = mongoose.models.ActivityLog || mongoose.model("ActivityLog", ActivityLogSchema);

export default ActivityLog;


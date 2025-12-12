import mongoose from "mongoose";

const UploadHistorySchema = new mongoose.Schema(
    {
        fileName: {
            type: String,
            required: true
        },
        uploadedBy: {
            type: String, // User email
            required: true
        },
        uploadedById: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        },
        totalRows: {
            type: Number,
            required: true
        },
        importedCount: {
            type: Number,
            required: true
        },
        errorCount: {
            type: Number,
            default: 0
        },
        uploadErrors: [{
            type: String
        }],
        summary: {
            breakfast: { type: Number, default: 0 },
            lunch: { type: Number, default: 0 },
            dinner: { type: Number, default: 0 },
            snack: { type: Number, default: 0 },
            total: { type: Number, default: 0 }
        }
    },
    { timestamps: true }
);

// Create index for better query performance
UploadHistorySchema.index({ uploadedBy: 1 });
UploadHistorySchema.index({ createdAt: -1 });

const UploadHistory = mongoose.models.UploadHistory || mongoose.model("UploadHistory", UploadHistorySchema);

export default UploadHistory;


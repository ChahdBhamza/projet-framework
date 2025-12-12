import mongoose from "mongoose";

const MealSchema = new mongoose.Schema({
    mealName: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fats: { type: Number, required: true },
    fiber: { type: Number },
    tags: [{ type: String }],
}, { _id: false });

const DayMealPlanSchema = new mongoose.Schema({
    day: { type: Number, required: true },
    breakfast: { type: MealSchema },
    lunch: { type: MealSchema },
    dinner: { type: MealSchema },
}, { _id: false });

const MealPlanSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
            index: true
        },

        // User profile data
        userProfile: {
            weight: { type: Number, required: true },
            height: { type: Number, required: true },
            birthDate: { type: String, required: true },
            gender: { type: String, required: true, enum: ['male', 'female'] },
            trainingActivity: {
                type: String,
                required: true,
                enum: ['sedentary', 'light', 'moderate', 'active', 'very-active']
            },
        },

        // Calculated stats
        calculatedStats: {
            age: { type: Number, required: true },
            bmr: { type: Number, required: true },
            tdee: { type: Number, required: true },
            macros: {
                protein: { type: Number, required: true },
                carbs: { type: Number, required: true },
                fats: { type: Number, required: true },
            },
        },

        // AI-generated meal plan
        mealPlan: [DayMealPlanSchema],

        // Daily nutritional targets
        dailyTargets: {
            calories: { type: Number },
            protein: { type: Number },
            carbs: { type: Number },
            fats: { type: Number },
        },

        // Optional: Store the raw AI response
        aiResponse: { type: mongoose.Schema.Types.Mixed },
    },
    { timestamps: true }
);

// Index for efficient querying
MealPlanSchema.index({ userId: 1, createdAt: -1 });

const MealPlans = mongoose.models.MealPlans || mongoose.model("MealPlans", MealPlanSchema);

export default MealPlans;

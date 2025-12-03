import mongoose from "mongoose";

const MealSchema = new mongoose.Schema(
    {
        mealName: {
            type: String,
            required: true
        },
        mealType: {
            type: String,
            enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
            required: true
        },
        tags: [{
            type: String
        }],
        calories: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true,
    
        },
        protein: {
            type: Number,
            required: true
        },
        carbs: {
            type: Number,
            required: true
        },
        fats: {
            type: Number,
            required: true
        },
        fiber: {
            type: Number,
            required: true
        },
        sugar: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

// Create indexes for better query performance
MealSchema.index({ mealName: 1 });
MealSchema.index({ mealType: 1 });
MealSchema.index({ tags: 1 });

const meals = mongoose.models.meals || mongoose.model("meals", MealSchema);

export default meals;

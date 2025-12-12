import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from '@/backend/db.js';
import MealPlans from '@/backend/models/mealPlans.js';
import users from '@/backend/models/users.js';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

// Helper function to verify JWT token
function verifyToken(request) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.substring(7);
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
}

// GET - Fetch a specific meal plan by ID
export async function GET(request, { params }) {
    try {
        await connectDB();

        // Verify authentication
        const decoded = verifyToken(request);
        if (!decoded) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = params;

        const mealPlan = await MealPlans.findById(id).populate("userId", "name email").lean();

        if (!mealPlan) {
            return NextResponse.json(
                { success: false, error: "Meal plan not found" },
                { status: 404 }
            );
        }

        // Check if user owns this meal plan or is admin
        const user = await users.findById(decoded.id);
        const isAdmin = ADMIN_EMAIL && user.email?.toLowerCase()?.trim() === ADMIN_EMAIL?.toLowerCase()?.trim();

        if (!isAdmin && mealPlan.userId._id.toString() !== decoded.id) {
            return NextResponse.json(
                { success: false, error: "Forbidden" },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            mealPlan,
        });
    } catch (error) {
        console.error("Error fetching meal plan:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch meal plan" },
            { status: 500 }
        );
    }
}

// DELETE - Delete a meal plan
export async function DELETE(request, { params }) {
    try {
        await connectDB();

        // Verify authentication
        const decoded = verifyToken(request);
        if (!decoded) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = params;

        const mealPlan = await MealPlans.findById(id);

        if (!mealPlan) {
            return NextResponse.json(
                { success: false, error: "Meal plan not found" },
                { status: 404 }
            );
        }

        // Check if user owns this meal plan or is admin
        const user = await users.findById(decoded.id);
        const isAdmin = ADMIN_EMAIL && user.email?.toLowerCase()?.trim() === ADMIN_EMAIL?.toLowerCase()?.trim();

        if (!isAdmin && mealPlan.userId.toString() !== decoded.id) {
            return NextResponse.json(
                { success: false, error: "Forbidden" },
                { status: 403 }
            );
        }

        await MealPlans.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: "Meal plan deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting meal plan:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete meal plan" },
            { status: 500 }
        );
    }
}

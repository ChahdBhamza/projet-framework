import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "../../../../db";
import MealPlans from "../../../../models/mealPlans";
import users from "../../../../models/users";

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

// POST - Save a new meal plan
export async function POST(request) {
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

        const body = await request.json();
        const { userProfile, calculatedStats, mealPlan, dailyTargets, aiResponse } = body;

        // Validate required fields
        if (!userProfile || !calculatedStats || !mealPlan) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Create new meal plan
        const newMealPlan = new MealPlans({
            userId: decoded.id,
            userProfile,
            calculatedStats,
            mealPlan,
            dailyTargets,
            aiResponse,
        });

        await newMealPlan.save();

        return NextResponse.json({
            success: true,
            message: "Meal plan saved successfully",
            mealPlan: newMealPlan,
        });
    } catch (error) {
        console.error("Error saving meal plan:", error);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to save meal plan" },
            { status: 500 }
        );
    }
}

// GET - Fetch meal plans (user's own or all for admin)
export async function GET(request) {
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

        // Get user to check if admin
        const user = await users.findById(decoded.id);
        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        const isAdmin = ADMIN_EMAIL && user.email?.toLowerCase()?.trim() === ADMIN_EMAIL?.toLowerCase()?.trim();

        let mealPlans;
        if (isAdmin) {
            // Admin: fetch all meal plans with user information
            mealPlans = await MealPlans.find()
                .populate("userId", "name email")
                .sort({ createdAt: -1 })
                .lean();
        } else {
            // Regular user: fetch only their meal plans
            mealPlans = await MealPlans.find({ userId: decoded.id })
                .sort({ createdAt: -1 })
                .lean();
        }

        return NextResponse.json({
            success: true,
            mealPlans,
            isAdmin,
        });
    } catch (error) {
        console.error("Error fetching meal plans:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch meal plans" },
            { status: 500 }
        );
    }
}

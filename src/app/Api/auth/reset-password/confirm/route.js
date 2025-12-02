import { connectDB } from "../../../../../../db.js";
import Users from "../../../../../../models/users.js";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        // Connect to database
        try {
            await connectDB();
        } catch (dbError) {
            console.error("Database connection error:", dbError);
            return NextResponse.json(
                { message: "Database connection failed. Please try again later." },
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        // Parse request body
        let body;
        try {
            body = await req.json();
        } catch (parseError) {
            console.error("Request body parse error:", parseError);
            return NextResponse.json(
                { message: "Invalid request body" },
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const { token, password } = body || {};

        if (!token || !password) {
            return NextResponse.json(
                { message: "Reset token and new password are required" },
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Validate password strength
        const trimmedPassword = (password || "").trim();
        if (trimmedPassword.length < 6) {
            return NextResponse.json(
                { message: "Password must be at least 6 characters long" },
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Find user with this reset token
        let user;
        try {
            user = await Users.findOne({
                passwordResetToken: token,
            });
        } catch (dbQueryError) {
            console.error("Database query error:", dbQueryError);
            return NextResponse.json(
                { message: "Database query failed" },
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        if (!user) {
            return NextResponse.json(
                { message: "Invalid or expired reset token" },
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Check if token has expired
        if (user.passwordResetExpires && user.passwordResetExpires < new Date()) {
            return NextResponse.json(
                { message: "Reset token has expired. Please request a new one." },
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Hash new password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(trimmedPassword, 10);
        } catch (hashError) {
            console.error("Password hashing error:", hashError);
            return NextResponse.json(
                { message: "Password hashing failed" },
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        // Update password and clear reset token
        try {
            user.password = hashedPassword;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();
        } catch (saveError) {
            console.error("User save error:", saveError);
            return NextResponse.json(
                { message: "Failed to reset password" },
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        return NextResponse.json(
            {
                message: "Password reset successfully! You can now sign in with your new password.",
                success: true
            },
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Unexpected password reset confirmation error:", error);
        return NextResponse.json(
            { message: "Server error: " + (error?.message || "Unknown error") },
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

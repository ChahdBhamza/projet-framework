import { connectDB } from "../../../../../db.js";
import Users from "../../../../../models/users.js";
import { NextResponse } from "next/server";
import { sendPasswordResetEmail } from "../../../../../lib/email.js";
import { generateSecureToken, generateTokenExpiration } from "../../../../../lib/tokens.js";

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

        const { email } = body || {};

        if (!email) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Normalize email
        const normalizedEmail = (email || "").trim().toLowerCase();

        // Find user
        const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        let user;
        try {
            user = await Users.findOne({
                email: { $regex: new RegExp(`^${escapedEmail}$`, "i") }
            });
        } catch (dbQueryError) {
            console.error("Database query error:", dbQueryError);
            return NextResponse.json(
                { message: "Database query failed" },
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        // Security best practice: Always return success even if user doesn't exist
        // This prevents email enumeration attacks
        if (!user) {
            return NextResponse.json(
                { message: "If an account exists with this email, a password reset link has been sent." },
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        }

        // Generate password reset token
        const resetToken = generateSecureToken();
        const tokenExpiration = generateTokenExpiration(1); // 1 hour for security

        // Update user with reset token
        try {
            user.passwordResetToken = resetToken;
            user.passwordResetExpires = tokenExpiration;
            await user.save();
        } catch (saveError) {
            console.error("User save error:", saveError);
            return NextResponse.json(
                { message: "Failed to generate reset token" },
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        // Send password reset email
        try {
            await sendPasswordResetEmail(user.email, resetToken);
        } catch (emailError) {
            console.error("Failed to send password reset email:", emailError);
            // Still return success to prevent email enumeration
            return NextResponse.json(
                { message: "If an account exists with this email, a password reset link has been sent." },
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        }

        return NextResponse.json(
            { message: "If an account exists with this email, a password reset link has been sent. Please check your inbox." },
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Unexpected password reset error:", error);
        return NextResponse.json(
            { message: "Server error: " + (error?.message || "Unknown error") },
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

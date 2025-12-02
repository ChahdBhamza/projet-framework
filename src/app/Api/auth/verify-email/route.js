import { connectDB } from "../../../../../db.js";
import Users from "../../../../../models/users.js";
import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "../../../../../lib/email.js";

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

        const { token } = body || {};

        if (!token) {
            return NextResponse.json(
                { message: "Verification token is required" },
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Find user with this verification token
        let user;
        try {
            user = await Users.findOne({
                emailVerificationToken: token,
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
                { message: "Invalid or expired verification token" },
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Check if token has expired
        if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
            return NextResponse.json(
                { message: "Verification token has expired. Please request a new one." },
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Check if already verified
        if (user.isEmailVerified) {
            return NextResponse.json(
                { message: "Email is already verified" },
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        }

        // Mark email as verified and clear verification token
        try {
            user.isEmailVerified = true;
            user.emailVerificationToken = undefined;
            user.emailVerificationExpires = undefined;
            await user.save();
        } catch (saveError) {
            console.error("User save error:", saveError);
            return NextResponse.json(
                { message: "Failed to verify email" },
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        // Send welcome email (non-blocking)
        try {
            await sendWelcomeEmail(user.email, user.name);
        } catch (emailError) {
            // Log error but don't fail the verification
            console.error("Failed to send welcome email:", emailError);
        }

        return NextResponse.json(
            {
                message: "Email verified successfully! You can now sign in.",
                success: true
            },
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Unexpected verification error:", error);
        return NextResponse.json(
            { message: "Server error: " + (error?.message || "Unknown error") },
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

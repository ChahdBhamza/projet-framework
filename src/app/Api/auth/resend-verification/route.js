import { connectDB } from "../../../../../db.js";
import Users from "../../../../../models/users.js";
import { NextResponse } from "next/server";
import { sendVerificationEmail } from "../../../../../lib/email.js";
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

        if (!user) {
            // Don't reveal if email exists or not (security best practice)
            return NextResponse.json(
                { message: "If an account exists with this email, a verification email has been sent." },
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        }

        // Check if already verified
        if (user.isEmailVerified) {
            return NextResponse.json(
                { message: "Email is already verified" },
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        }

        // Generate new verification token
        const verificationToken = generateSecureToken();
        const tokenExpiration = generateTokenExpiration(24); // 24 hours

        // Update user with new token
        try {
            user.emailVerificationToken = verificationToken;
            user.emailVerificationExpires = tokenExpiration;
            await user.save();
        } catch (saveError) {
            console.error("User save error:", saveError);
            return NextResponse.json(
                { message: "Failed to generate verification token" },
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        // Send verification email
        try {
            await sendVerificationEmail(user.email, verificationToken);
        } catch (emailError) {
            console.error("Failed to send verification email:", emailError);
            return NextResponse.json(
                { message: "Failed to send verification email. Please try again later." },
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        return NextResponse.json(
            { message: "Verification email sent successfully. Please check your inbox." },
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Unexpected resend verification error:", error);
        return NextResponse.json(
            { message: "Server error: " + (error?.message || "Unknown error") },
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

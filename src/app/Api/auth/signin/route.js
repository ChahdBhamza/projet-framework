import { connectDB } from "../../../../../db";
import Users from "../../../../../models/users";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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

    // Validate input
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Normalize email (trim and lowercase)
    const normalizedEmail = (email || "").trim().toLowerCase();
    const trimmedPassword = (password || "").trim();

    if (!normalizedEmail || !trimmedPassword) {
      return NextResponse.json(
        { message: "Email and password cannot be empty" },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Search for user with case-insensitive email matching
    // Escape special regex characters in email
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
      return NextResponse.json(
        { message: "Email not found" },
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if user is OAuth user (no password)
    if (user.provider === 'google' || user.googleId) {
      return NextResponse.json(
        { message: "This account was created with Google. Please sign in with Google instead." },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if password exists and is not empty
    if (!user.password || typeof user.password !== "string") {
      console.error("User found but password field is missing or invalid");
      return NextResponse.json(
        { message: "Account error. Please contact support." },
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if password is already hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
    const isHashed = user.password.startsWith("$2a$") ||
      user.password.startsWith("$2b$") ||
      user.password.startsWith("$2y$");

    let isMatch = false;

    try {
      if (isHashed) {
        // Password is hashed, use bcrypt.compare
        isMatch = await bcrypt.compare(trimmedPassword, user.password);
      } else {
        // Password is plain text (legacy data), compare directly
        // NOTE: This should only be temporary - all passwords should be hashed
        console.warn("Warning: Comparing plain text password for user:", normalizedEmail);
        isMatch = trimmedPassword === user.password;
      }
    } catch (compareError) {
      console.error("Password comparison error:", compareError);
      return NextResponse.json(
        { message: "Password verification failed" },
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!isMatch) {
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return NextResponse.json(
        {
          message: "Please verify your email before signing in. Check your inbox for the verification link.",
          requiresVerification: true,
          email: user.email
        },
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }


    const token = jwt.sign({ id: user._id.toString(), email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "30m" });
    // Success response
    const responseData = {
      message: "Signed in successfully",
      token,
      user: {
        id: user._id?.toString() || "",
        email: user.email || "",
        name: user.name || "",
      },
    };



    return NextResponse.json(
      responseData,
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected sign-in error:", error);
    return NextResponse.json(
      { message: "Server error: " + (error?.message || "Unknown error") },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

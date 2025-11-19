import { connectDB } from "../../../../../db";
import Users from "../../../../../models/users";
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

    // Validate input
    const { name, email, password } = body || {};

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Normalize email (trim and lowercase)
    const normalizedEmail = (email || "").trim().toLowerCase();
    const trimmedName = (name || "").trim();
    const trimmedPassword = (password || "").trim();

    if (!normalizedEmail || !trimmedName || !trimmedPassword) {
      return NextResponse.json(
        { message: "Name, email, and password cannot be empty" },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if user already exists (case-insensitive)
    const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    let existingUser;
    try {
      existingUser = await Users.findOne({ 
        email: { $regex: new RegExp(`^${escapedEmail}$`, "i") }
      });
    } catch (dbQueryError) {
      console.error("Database query error:", dbQueryError);
      return NextResponse.json(
        { message: "Database query failed" },
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Hash password
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

    // Create new user
    let newUser;
    try {
      newUser = new Users({
        name: trimmedName,
        email: normalizedEmail,
        password: hashedPassword,
      });
      await newUser.save();
    } catch (saveError) {
      console.error("User save error:", saveError);
      // Check if it's a duplicate key error
      if (saveError.code === 11000) {
        return NextResponse.json(
          { message: "User already exists with this email" },
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      return NextResponse.json(
        { message: "Failed to create user" },
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Success response
    const responseData = {
      message: "User created successfully",
      user: {
        id: newUser._id?.toString() || "",
        email: newUser.email || "",
        name: newUser.name || "",
      },
    };

    return NextResponse.json(
      responseData,
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected sign-up error:", error);
    return NextResponse.json(
      { message: "Server error: " + (error?.message || "Unknown error") },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

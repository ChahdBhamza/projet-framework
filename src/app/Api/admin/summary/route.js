import { NextResponse } from "next/server";
import { connectDB } from "../../../../../db";
import Users from "../../../../../models/users";

// Simple admin summary endpoint.
// For now it only exposes user stats; you can extend it later.
export async function GET() {
  try {
    try {
      await connectDB();
    } catch (dbError) {
      console.error("Admin summary DB connection error:", dbError);
      return NextResponse.json(
        { message: "Database connection failed" },
        { status: 500 }
      );
    }

    let totalUsers = 0;
    let verifiedUsers = 0;

    try {
      totalUsers = await Users.countDocuments({});
      verifiedUsers = await Users.countDocuments({ isEmailVerified: true });
    } catch (err) {
      console.error("Admin summary query error:", err);
    }

    const response = {
      totalUsers,
      verifiedUsers,
      unverifiedUsers: Math.max(totalUsers - verifiedUsers, 0),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Admin summary unexpected error:", error);
    return NextResponse.json(
      { message: "Server error", details: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}



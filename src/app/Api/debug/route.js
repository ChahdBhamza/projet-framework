import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Only report presence of sensitive server-side vars, do NOT return their values
    const server = {
      MONGO_URI: !!process.env.MONGO_URI,
      JWT_SECRET: !!process.env.JWT_SECRET,
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      SPOONACULAR_API_KEY: !!process.env.SPOONACULAR_API_KEY,
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
      APP_URL: process.env.APP_URL || null,
    };

    // Public variables are safe to return
    const pub = {
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || null,
      NEXT_PUBLIC_ADMIN_EMAIL: process.env.NEXT_PUBLIC_ADMIN_EMAIL || null,
    };

    return NextResponse.json({ server, public: pub }, { status: 200 });
  } catch (err) {
    console.error("/api/debug error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // Only report presence of sensitive server-side vars, do NOT return their values
    const server = {
      MONGO_URI: !!process.env.MONGO_URI,
      JWT_SECRET: !!process.env.JWT_SECRET,
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
      GMAIL_USER: !!process.env.GMAIL_USER,
      GMAIL_APP_PASSWORD: !!process.env.GMAIL_APP_PASSWORD,

      APP_URL: process.env.APP_URL || null,
    };

    // Public variables are safe to return
    const pub = {
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || null,
      NEXT_PUBLIC_ADMIN_EMAIL: process.env.NEXT_PUBLIC_ADMIN_EMAIL || null,
    };

    // Count how many critical vars are set
    const criticalVars = [
      process.env.MONGO_URI,
      process.env.JWT_SECRET,
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    ];
    const criticalCount = criticalVars.filter(v => v).length;

    return NextResponse.json({
      server,
      public: pub,
      status: criticalCount === 4 ? "✓ ready" : "⚠ incomplete",
      timestamp: new Date().toISOString(),
    }, { status: 200 });
  } catch (err) {
    console.error("/api/debug error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}


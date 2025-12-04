import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const redirectUri = searchParams.get("redirect_uri") || `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/auth/google/callback`;
    const returnUrl = searchParams.get("returnUrl");
    
    if (!process.env.GOOGLE_CLIENT_ID) {
      return NextResponse.json(
        { message: "Google OAuth not configured" },
        { status: 500 }
      );
    }

    // Build callback URL with returnUrl if provided
    let callbackUrl = redirectUri;
    if (returnUrl) {
      callbackUrl += `?returnUrl=${encodeURIComponent(returnUrl)}`;
    }

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(process.env.GOOGLE_CLIENT_ID)}&` +
      `redirect_uri=${encodeURIComponent(callbackUrl)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent("openid email profile")}&` +
      `access_type=offline&` +
      `prompt=consent`;

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Google OAuth error:", error);
    return NextResponse.json(
      { message: "Failed to initiate Google OAuth" },
      { status: 500 }
    );
  }
}


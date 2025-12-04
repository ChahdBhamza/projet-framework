import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { connectDB } from "../../../../../../db";
import Users from "../../../../../../models/users";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/Signin?error=${encodeURIComponent(error)}`
      );
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/Signin?error=no_code`
      );
    }

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/Signin?error=oauth_not_configured`
      );
    }

    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/auth/google/callback`;
    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info from Google
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/Signin?error=no_email`
      );
    }

    await connectDB();

    // Check if user exists by email or Google ID
    let user = await Users.findOne({
      $or: [
        { email: email.toLowerCase() },
        { googleId: googleId }
      ]
    });

    if (user) {
      // Check if account was created with email/password (not OAuth)
      if (user.provider === 'local' || (!user.googleId && user.password)) {
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/Signin?error=${encodeURIComponent("An account with this email already exists. Please sign in with your email and password instead.")}`
        );
      }
      
      // User exists with OAuth - update Google ID if not set (shouldn't happen, but just in case)
      if (!user.googleId) {
        user.googleId = googleId;
        user.provider = 'google';
        user.isEmailVerified = true; // Google emails are verified
        await user.save();
      }
    } else {
      // Create new user
      user = new Users({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        googleId: googleId,
        provider: 'google',
        isEmailVerified: true, // Google emails are verified
        password: '', // No password for OAuth users
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    // Redirect to frontend with token
    const frontendUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/auth/google/success?token=${encodeURIComponent(token)}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`;
    
    return NextResponse.redirect(frontendUrl);
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/Signin?error=${encodeURIComponent(error.message || "oauth_failed")}`
    );
  }
}


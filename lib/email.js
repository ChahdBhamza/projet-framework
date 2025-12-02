/* eslint-disable no-console */

/**
 * Email service utility
 * Supports Gmail SMTP via Nodemailer with fallback to console logging for development
 */

import nodemailer from "nodemailer";

const APP_URL = process.env.APP_URL || "http://localhost:3000";
const GMAIL_USER = process.env.GMAIL_USER; // Your Gmail address
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD; // Gmail App Password

/**
 * Create Nodemailer transporter for Gmail
 */
function createTransporter() {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });
}

/**
 * Send email using Gmail SMTP or log to console
 */
async function sendEmail({ to, subject, html }) {
  const transporter = createTransporter();

  // If Gmail credentials are configured, send actual email
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: `"Diet & Fit" <${GMAIL_USER}>`,
        to,
        subject,
        html,
      });

      console.log(`✅ Email sent to ${to}: ${subject}`);
      console.log(`📧 Message ID: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("Failed to send email via Gmail:", error);
      throw error;
    }
  } else {
    // Fallback: Log email to console for development
    console.log("\n📧 ===== EMAIL (Development Mode) =====");
    console.log(`To: ${to}`);
    console.log(`From: Dietopia <${GMAIL_USER || "noreply@dietfit.com"}>`);
    console.log(`Subject: ${subject}`);
    console.log("------- HTML Content -------");
    console.log(html);
    console.log("====================================\n");
    console.log("⚠️  To send actual emails, add GMAIL_USER and GMAIL_APP_PASSWORD to .env.local");
    return { success: true, mode: "console" };
  }
}

/**
 * Send email verification email
 */
export async function sendVerificationEmail(email, token) {
  const verificationUrl = `${APP_URL}/verify-email?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #7ab530 0%, #6aa02b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #7ab530; color: white; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🥗 Diet & Fit</h1>
          </div>
          <div class="content">
            <h2>Welcome to Diet & Fit! 👋</h2>
            <p>Thank you for signing up! Please verify your email address to get started with your healthy journey.</p>
            <p style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </p>
            <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #7ab530; font-size: 12px;">${verificationUrl}</p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2025 Diet & Fit. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "Verify Your Email - Diet & Fit",
    html,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email, token) {
  const resetUrl = `${APP_URL}/reset-password/confirm?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #7ab530 0%, #6aa02b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #7ab530; color: white; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
          </div>
          <div class="content">
            <h2>Reset Your Password</h2>
            <p>We received a request to reset your password for your Diet & Fit account.</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #7ab530; font-size: 12px;">${resetUrl}</p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
            </div>
          </div>
          <div class="footer">
            <p>© 2025 Diet & Fit. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "Reset Your Password - Diet & Fit",
    html,
  });
}

/**
 * Send welcome email after verification
 */
export async function sendWelcomeEmail(email, name) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #7ab530 0%, #6aa02b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #7ab530; color: white; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #7ab530; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Diet & Fit!</h1>
          </div>
          <div class="content">
            <h2>Hi ${name}! 👋</h2>
            <p>Your email has been verified successfully! You're all set to start your healthy journey with Diet & Fit.</p>
            
            <h3>What's Next?</h3>
            <div class="feature">
              <strong>🍽️ Create Your Meal Plan</strong>
              <p>Get personalized meal plans tailored to your goals and preferences.</p>
            </div>
            <div class="feature">
              <strong>❤️ Save Favorites</strong>
              <p>Bookmark your favorite recipes for quick access.</p>
            </div>
            <div class="feature">
              <strong>📊 Track Progress</strong>
              <p>Monitor your health journey with our dashboard.</p>
            </div>
            
            <p style="text-align: center;">
              <a href="${APP_URL}" class="button">Get Started</a>
            </p>
          </div>
          <div class="footer">
            <p>© 2025 Diet & Fit. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "Welcome to Diet & Fit! 🎉",
    html,
  });
}

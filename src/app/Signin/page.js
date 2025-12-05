"use client";
import Link from "next/link";
import Header from "../Header";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { useAuth } from "../context/AuthContext";

export default function Signin() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Show session-related messages and OAuth errors inline in the form
  useEffect(() => {
    const reason = searchParams.get("reason");
    const errorParam = searchParams.get("error");
    const message = searchParams.get("message");
    
    if (reason === "sessionExpired") {
      setError("Your session has expired. Please sign in again.");
    } else if (reason === "invalidSession") {
      setError("Invalid session. Please sign in again.");
    } else if (reason === "loginRequired") {
      setError(message || "Please sign in to continue.");
    } else if (errorParam) {
      // Decode error message from OAuth callback
      const decodedError = decodeURIComponent(errorParam);
      
      // Map common error codes to user-friendly messages
      if (decodedError.includes("already exists") || decodedError.includes("email and password")) {
        setError(decodedError);
      } else if (decodedError === "no_code") {
        setError("Google sign-in was cancelled or failed. Please try again.");
      } else if (decodedError === "no_email") {
        setError("Google account email not found. Please try again.");
      } else if (decodedError === "oauth_not_configured") {
        setError("Google sign-in is not configured. Please use email and password.");
      } else if (decodedError === "invalid_token") {
        setError("Invalid authentication token. Please try again.");
      } else if (decodedError === "oauth_failed") {
        setError("Google sign-in failed. Please try again.");
      } else {
        setError(decodedError);
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Check if response has content
      const contentType = res.headers.get("content-type");
      let data;

      // Clone the response before reading it to avoid consuming it
      const responseClone = res.clone();

      if (contentType && contentType.includes("application/json")) {
        // Response claims to be JSON
        try {
          const text = await res.text();

          // Check if response is empty
          if (!text || text.trim().length === 0) {
            throw new Error("Server returned empty response");
          }

          // Try to parse JSON
          data = JSON.parse(text);
        } catch (jsonError) {
          // If JSON parsing fails, try to get text from clone for debugging
          try {
            const text = await responseClone.text();
            console.error("Failed to parse JSON response:", text);
            throw new Error(`Server returned invalid JSON: ${res.status} ${res.statusText}. Response: ${text.substring(0, 100)}`);
          } catch (textError) {
            console.error("Could not read response text:", textError);
            throw new Error(`Server returned invalid response: ${res.status} ${res.statusText}`);
          }
        }
      } else {
        // Response is not JSON, get text for debugging
        try {
          const text = await res.text();
          console.error("Non-JSON response:", text);
          throw new Error(`Server returned invalid response: ${res.status} ${res.statusText}`);
        } catch (textError) {
          console.error("Could not read response:", textError);
          throw new Error(`Server error: ${res.status} ${res.statusText}`);
        }
      }

      if (!res.ok) {
        setError(data?.message || "Sign-in failed");
        // Check if user needs email verification
        if (data?.requiresVerification) {
          setNeedsVerification(true);
        }
      } else {
        console.log("Signed in user:", data?.user);
        login(data.token, data.user);
        
        // Check if user is admin
        const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        const userEmail = data?.user?.email?.toLowerCase()?.trim();
        const adminEmail = ADMIN_EMAIL?.toLowerCase()?.trim();
        const isAdmin = ADMIN_EMAIL && userEmail === adminEmail;
        
        // Check if there's a return URL to redirect back to
        const returnUrl = searchParams.get("returnUrl");
        if (returnUrl) {
          const decodedUrl = decodeURIComponent(returnUrl);
          router.push(decodedUrl);
        } else if (isAdmin) {
          // Redirect admin users to dashboard immediately
          router.push("/Dashboard");
        } else {
          // Redirect to home page after successful login
          router.push("/");
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setError("");
        alert(data.message || "Verification email sent! Please check your inbox.");
      } else {
        setError(data.message || "Failed to resend verification email");
      }
    } catch (err) {
      setError("Failed to resend verification email. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-[#e9fce2] via-[#f7fff3] to-[#d9f8cc]">
      <Image src="/apple.png" alt="Apple" width={100} height={100} className="floating absolute top-24 left-10 opacity-80 drop-shadow-md" />
      <Image src="/strawberry.png" alt="Strawberry" width={110} height={110} className="floating absolute bottom-28 left-24 opacity-80 drop-shadow-md" />
      <Image src="/carrot.png" alt="Carrot" width={100} height={100} className="floating absolute top-32 right-20 opacity-80 drop-shadow-md" />
      <Image src="/broccoli.png" alt="Broccoli" width={90} height={90} className="floating absolute bottom-12 right-16 opacity-80 drop-shadow-md" />

      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
      <div className="relative z-10">
        <Header />
      </div>

      <section className="flex-grow flex items-center justify-center py-16 relative z-10">
        <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-10 w-full max-w-md border border-gray-100">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Welcome Back 👋</h2>
          <p className="text-center text-gray-500 mb-8">Sign in to continue your healthy journey</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-center">
                <p className="font-medium">{error}</p>
                {needsVerification && (
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resendLoading}
                    className="mt-2 text-sm text-[#7ab530] hover:underline disabled:opacity-50"
                  >
                    {resendLoading ? "Sending..." : "Resend verification email"}
                  </button>
                )}
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7ab530]"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7ab530]"
              />
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-[#7ab530]" /> Remember me
              </label>
              <Link href="/reset-password" className="text-[#7ab530] hover:underline">Forgot password?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7ab530] text-white py-3 rounded-full font-semibold hover:bg-[#6aa02b] transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const returnUrl = searchParams.get("returnUrl");
                const googleAuthUrl = returnUrl 
                  ? `/api/auth/google?returnUrl=${encodeURIComponent(returnUrl)}`
                  : "/api/auth/google";
                window.location.href = googleAuthUrl;
              }}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-50 transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>

            <p className="text-center text-gray-600 mt-6">
              Don't have an account? <Link href="/Signup" className="text-[#7ab530] font-semibold hover:underline">Sign Up</Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

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

  // Show session-related messages inline in the form
  useEffect(() => {
    const reason = searchParams.get("reason");
    if (reason === "sessionExpired") {
      setError("Your session has expired. Please sign in again.");
    } else if (reason === "invalidSession") {
      setError("Invalid session. Please sign in again.");
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
        // Redirect to home page after successful login
        router.push("/");
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
              <div className="text-red-500 text-center">
                <p>{error}</p>
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

            <p className="text-center text-gray-600 mt-6">
              Don’t have an account? <Link href="/Signup" className="text-[#7ab530] font-semibold hover:underline">Sign Up</Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

"use client";

import Image from "next/image";
import Header from "../Header";
import Link from "next/link";
import { useState } from "react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
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
        setError(data?.message || "Sign-up failed");
      } else {
        console.log("User signed up successfully");
        setSuccess(true);
      }
    } catch (err) {
      console.error("Sign-up error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
        <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-10 w-full max-w-[580px] border border-gray-100 mx-auto">
          {!success ? (
            <>
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Join Diet & Fit 🌿</h2>
              <p className="text-center text-gray-500 mb-8">Create your account and start your healthy journey today!</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && <p className="text-red-500 text-center">{error}</p>}

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    placeholder="John Doe"
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7ab530]"
                  />
                </div>

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

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    placeholder="••••••••"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7ab530]"
                  />
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" className="accent-[#7ab530]" />
                  <span>I agree to the <Link href="#" className="text-[#7ab530] hover:underline">Terms & Conditions</Link></span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#7ab530] text-white py-3 rounded-full font-semibold hover:bg-[#6aa02b] transition disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>

                <p className="text-center text-gray-600 mt-6">
                  Already have an account? <Link href="/Signin" className="text-[#7ab530] font-semibold hover:underline">Sign In</Link>
                </p>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="text-6xl mb-6">📧</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Check Your Email!</h2>
              <p className="text-gray-600 mb-6">
                We've sent a verification link to <strong>{email}</strong>. Please check your inbox and click the link to verify your account.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>📌 Next Steps:</strong>
                  <br />
                  1. Check your email inbox
                  <br />
                  2. Click the verification link
                  <br />
                  3. Sign in to your account
                </p>
              </div>
              <Link
                href="/Signin"
                className="inline-block px-8 py-3 rounded-full bg-[#7ab530] text-white transition-colors duration-300 hover:bg-[#6aa02b]"
              >
                Go to Sign In
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

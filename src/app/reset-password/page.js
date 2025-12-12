"use client";

import { useState } from "react";
import Header from "../Header";
import Image from "next/image";
import Link from "next/link";

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const res = await fetch("/Api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                setSubmitted(true);
            } else {
                setError(data.message || "Failed to send reset email");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
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
                <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-10 w-full max-w-md border border-gray-100">
                    {!submitted ? (
                        <>
                            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Reset Password 🔐</h2>
                            <p className="text-center text-gray-500 mb-8">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && <p className="text-red-500 text-center">{error}</p>}

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        placeholder="you@example.com"
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7ab530]"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#7ab530] text-white py-3 rounded-full font-semibold hover:bg-[#6aa02b] transition disabled:opacity-50"
                                >
                                    {loading ? "Sending..." : "Send Reset Link"}
                                </button>

                                <p className="text-center text-gray-600 mt-6">
                                    Remember your password?{" "}
                                    <Link href="/Signin" className="text-[#7ab530] font-semibold hover:underline">
                                        Sign In
                                    </Link>
                                </p>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="text-6xl mb-6">📧</div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Check Your Email</h2>
                            <p className="text-gray-600 mb-6">{message}</p>
                            <p className="text-sm text-gray-500 mb-6">
                                If you don't see the email, check your spam folder.
                            </p>
                            <Link
                                href="/Signin"
                                className="inline-block px-8 py-3 rounded-full bg-[#7ab530] text-white transition-colors duration-300 hover:bg-[#6aa02b]"
                            >
                                Back to Sign In
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

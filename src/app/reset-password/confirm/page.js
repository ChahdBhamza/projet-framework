"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../Header";
import Image from "next/image";
import Link from "next/link";

export default function ResetPasswordConfirm() {
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // IMPORTANT FIX
    const [token, setToken] = useState(null);

    useEffect(() => {
        // Read token directly from URL to avoid useSearchParams Suspense requirement
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const tokenParam = urlParams.get("token");

            if (!tokenParam) {
                setError("Invalid reset link. No token provided.");
            }

            setToken(tokenParam); // can be null or valid token
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password/confirm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                setSuccess(true);

                setTimeout(() => {
                    router.push("/Signin");
                }, 3000);
            } else {
                setError(data.message || "Failed to reset password");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Show invalid page ONLY AFTER token is checked
    if (token === null) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e9fce2] via-[#f7fff3] to-[#d9f8cc]">
                <p className="text-gray-700 text-lg">Checking reset link…</p>
            </main>
        );
    }

    if (!token) {
        return (
            <main className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-[#e9fce2] via-[#f7fff3] to-[#d9f8cc]">
                <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>

                <div className="relative z-10">
                    <Header />
                </div>

                <section className="flex-grow flex items-center justify-center py-16 relative z-10">
                    <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-10 w-full max-w-md border border-gray-100 text-center">
                        <div className="text-6xl mb-6">❌</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Invalid Link</h2>
                        <p className="text-gray-600 mb-6">{error}</p>

                        <Link
                            href="/reset-password"
                            className="inline-block px-8 py-3 rounded-full bg-[#7ab530] text-white transition-colors duration-300 hover:bg-[#6aa02b]"
                        >
                            Request New Link
                        </Link>
                    </div>
                </section>
            </main>
        );
    }

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
                    {!success ? (
                        <>
                            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Set New Password 🔐</h2>
                            <p className="text-center text-gray-500 mb-8">Enter your new password below.</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && <p className="text-red-500 text-center">{error}</p>}

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">New Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        placeholder="••••••••"
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
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
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7ab530]"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#7ab530] text-white py-3 rounded-full font-semibold hover:bg-[#6aa02b] transition disabled:opacity-50"
                                >
                                    {loading ? "Resetting..." : "Reset Password"}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="text-6xl mb-6">✅</div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Password Reset!</h2>
                            <p className="text-gray-600 mb-6">{message}</p>
                            <p className="text-sm text-gray-500">Redirecting to sign in...</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

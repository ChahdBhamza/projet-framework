"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Header from "../Header";
import Image from "next/image";
import Link from "next/link";

export default function VerifyEmail() {
    const router = useRouter();
    const { login } = useAuth();

    const [status, setStatus] = useState("verifying"); // verifying, success, error
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ----------- FIX: Read token manually from URL -----------
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        // ----------------------------------------------------------

        if (!token) {
            setStatus("error");
            setMessage("Invalid verification link. No token provided.");
            setLoading(false);
            return;
        }

        const verifyEmail = async () => {
            try {
                const res = await fetch("/Api/auth/verify-email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });

                const data = await res.json();

                if (res.ok) {
                    setStatus("success");
                    setMessage(data.message || "Email verified successfully!");

                    // Auto-login
                    if (data.token && data.user) {
                        login(data.token, data.user);
                    }

                    // Redirect home
                    setTimeout(() => {
                        router.push("/");
                    }, 2000);
                } else {
                    setStatus("error");
                    setMessage(data.message || "Verification failed. Please try again.");
                }
            } catch (error) {
                setStatus("error");
                setMessage("Something went wrong. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        verifyEmail();
    }, [router, login]);

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
                <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-10 w-full max-w-md border border-gray-100 text-center">
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#7ab530] mx-auto mb-6"></div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Verifying Your Email...</h2>
                            <p className="text-gray-600">Please wait while we verify your email address.</p>
                        </>
                    ) : status === "success" ? (
                        <>
                            <div className="text-6xl mb-6">✅</div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Email Verified!</h2>
                            <p className="text-gray-600 mb-6">{message}</p>
                            <p className="text-sm text-gray-500">Logging you in and redirecting to home...</p>
                        </>
                    ) : (
                        <>
                            <div className="text-6xl mb-6">❌</div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Verification Failed</h2>
                            <p className="text-gray-600 mb-6">{message}</p>
                            <Link
                                href="/Signin"
                                className="inline-block px-8 py-3 rounded-full bg-[#7ab530] text-white transition-colors duration-300 hover:bg-[#6aa02b]"
                            >
                                Go to Sign In
                            </Link>
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}

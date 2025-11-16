"use client";
import Link from "next/link";
import Header from "../Header";

import Image from "next/image";

export default function Signin() {
  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-[#e9fce2] via-[#f7fff3] to-[#d9f8cc]">
      {/* 🍏 Floating Fruits / Decorations */}
      <Image
        src="/apple.png"
        alt="Apple"
        width={100}
        height={100}
        className="floating absolute top-24 left-10 opacity-80 drop-shadow-md"
      />
      <Image
        src="/strawberry.png"
        alt="Strawberry"
        width={110}
        height={110}
        className="floating absolute bottom-28 left-24 opacity-80 drop-shadow-md"
      />
      <Image
        src="/carrot.png"
        alt="Carrot"
        width={100}
        height={100}
        className="floating absolute top-32 right-20 opacity-80 drop-shadow-md"
      />
      <Image
        src="/broccoli.png"
        alt="Broccoli"
        width={90}
        height={90}
        className="floating absolute bottom-12 right-16 opacity-80 drop-shadow-md"
      />

      {/* 🌿 Soft translucent overlay */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>

      {/* 🧭 Navbar */}
      <div className="relative z-10">
  <Header />
</div>
      {/* ✨ Sign-In Form Section */}
      <section className="flex-grow flex items-center justify-center py-16 relative z-10">
        <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-10 w-full max-w-md border border-gray-100">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Welcome Back 👋
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Sign in to continue your healthy journey
          </p>

          <form className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7ab530]"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7ab530]"
              />
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-[#7ab530]" /> Remember me
              </label>
              <Link href="#" className="text-[#7ab530] hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-[#7ab530] text-white py-3 rounded-full font-semibold hover:bg-[#6aa02b] transition"
            >
              Sign In
            </button>

            <p className="text-center text-gray-600 mt-6">
              Don’t have an account?{" "}
              <Link href="/Signup" className="text-[#7ab530] font-semibold hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </section>

    
    </main>
  );
}

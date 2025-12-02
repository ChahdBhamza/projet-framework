"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "./context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  // Check if user is admin - case-insensitive email comparison
  const ADMIN_EMAIL =
    typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_ADMIN_EMAIL
      : undefined;
  
  // Normalize emails for comparison (lowercase, trim)
  const userEmail = user?.email?.toLowerCase()?.trim();
  const adminEmail = ADMIN_EMAIL?.toLowerCase()?.trim();
  const isAdmin = user && adminEmail && userEmail === adminEmail;

  return (
    <header className="navbar flex items-center justify-between p-6">
      {/* Navbar */}
      <div className="logo">
        <h2 id="logotx" className="text-1xl">Dietopia</h2>
      </div>

      <nav className="nav-links flex gap-6">
        <a href="/">Home</a>
        <a href="/Products">Products</a>
        <a href="/MealPlans">MealPlans</a>
        <a href="/Aboutus">About us</a>
        {isAdmin && (
          <Link href="/Dashboard" className="text-[#7ab530] font-semibold hover:underline">
            Dashboard
          </Link>
        )}
      </nav>

      <div className="actions flex gap-3">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-[#7ab530] font-semibold">Hello, {user.name || "User"}</span>
            <button
              onClick={logout}
              className="border border-red-500 text-red-500 px-4 py-2 rounded-full hover:bg-red-500 hover:text-white transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link href="/Signin">
              <button className="border border-[#7ab530] text-[#7ab530] px-4 py-2 rounded-full hover:bg-[#7ab530] hover:text-white transition">
                Sign In
              </button>
            </Link>
            <Link href="/Signup">
              <button className="bg-[#7ab530] text-white px-4 py-2 rounded-full hover:bg-[#6ba027] transition">
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

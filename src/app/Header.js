"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "./context/AuthContext";
import { LogOut } from "lucide-react";

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

  // Get display name - prefer name, fallback to first part of email, then "User"
  const displayName = user?.name || user?.email?.split("@")[0] || "User";

  return (
    <header className="navbar">
          {/* Logo */}
      <div className="logo">
        <Link href="/">
          <h2 id="logotx">Dietopia</h2>
          </Link>
      </div>

          {/* Navigation Links */}
      <nav className="nav-links">
        <Link href="/">Home</Link>
        <Link href="/Products">Products</Link>
        <Link href="/MealPlans">Meal Plans</Link>
        <Link href="/Aboutus">About Us</Link>
            {isAdmin && (
          <Link href="/Dashboard" style={{ color: "#7ab530", fontWeight: "600" }}>
                Dashboard
              </Link>
            )}
          </nav>

          {/* User Actions */}
      <div className="actions">
            {user ? (
              <>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 16px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              marginRight: "15px"
            }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#7ab530",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "600",
                fontSize: "16px"
              }}>
                    {displayName.charAt(0).toUpperCase()}
                  </div>
              <span style={{ color: "#333", fontWeight: "500", textTransform: "lowercase" }}>{displayName}</span>
                </div>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "#333",
                textDecoration: "none",
                fontWeight: "500",
                fontSize: "16px"
              }}
              onMouseEnter={(e) => e.target.style.color = "#7ab530"}
              onMouseLeave={(e) => e.target.style.color = "#333"}
                >
                  <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Link>
              </>
            ) : (
              <>
                <Link href="/Signin">
              <button style={{
                padding: "8px 16px",
                color: "#333",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "16px"
              }}>
                    Sign In
                  </button>
                </Link>
                <Link href="/Signup">
              <button style={{
                padding: "8px 16px",
                backgroundColor: "#7ab530",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "16px"
              }}>
                    Sign Up
                  </button>
                </Link>
              </>
            )}
      </div>
    </header>
  );
}

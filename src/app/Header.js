"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "./context/AuthContext";
import { LogOut } from "lucide-react";
import { apiJson } from "./Utils/api";

export default function Header() {
  const { user, logout } = useAuth();
  const [profilePicture, setProfilePicture] = useState(null);

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

  // Fetch profile picture from API and listen for updates
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Clear profile picture when user changes (including logout)
    if (!user?.email) {
      setProfilePicture(null);
      return;
    }

    let isMounted = true;

    const fetchProfilePicture = async () => {
      try {
        // First check localStorage for quick display, but only if it matches current user
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (userData.profilePicture && userData.email === user.email) {
          setProfilePicture(userData.profilePicture);
        } else {
          // Clear profile picture if localStorage data is for different user
          setProfilePicture(null);
        }

        // Fetch from API using the apiJson utility (handles errors gracefully)
        const data = await apiJson('/api/user/profile');

        if (isMounted && data.success && data.user?.profilePicture) {
          setProfilePicture(data.user.profilePicture);
          // Update localStorage with current user's email
          localStorage.setItem('user', JSON.stringify({
            email: user.email,
            profilePicture: data.user.profilePicture
          }));
        } else if (isMounted && data.success) {
          // User has no profile picture
          setProfilePicture(null);
          localStorage.setItem('user', JSON.stringify({ email: user.email }));
        }
      } catch (error) {
        // Silently fail - profile picture is optional
        // apiJson already handles redirects for auth errors
      }
    };

    fetchProfilePicture();

    // Listen for profile picture updates
    const handleProfilePictureUpdate = (event) => {
      if (isMounted && event.detail?.profilePicture) {
        setProfilePicture(event.detail.profilePicture);
      }
    };

    window.addEventListener('profilePictureUpdated', handleProfilePictureUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('profilePictureUpdated', handleProfilePictureUpdate);
    };
  }, [user?.email]);

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
          <Link href="/Dashboard" >
            Dashboard
          </Link>
        )}
      </nav>

      {/* User Actions */}
      <div className="actions">
        {user ? (
          <>
            <Link
              href="/Profile"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "8px 16px",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                marginRight: "15px",
                textDecoration: "none",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e8f5e0";
                e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#f5f5f5";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
              }}
            >
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt={displayName}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #7ab530"
                  }}
                />
              ) : (
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#7ab530",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "600",
                  fontSize: "18px"
                }}>
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <span style={{ color: "#333", fontWeight: "500", textTransform: "lowercase" }}>{displayName}</span>
            </Link>
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

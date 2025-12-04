/* eslint-disable no-console */
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

// Lightweight JWT decode on client – no verification, just reading payload
function decodeToken(token) {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = () => {
      // Clear session in development mode on first load
      if (typeof window !== "undefined") {
        // Check if we're in development (localhost or dev server)
        const isDev = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        const sessionCleared = sessionStorage.getItem("dev_session_cleared");
        
        if (isDev && !sessionCleared) {
          // Clear token and mark as cleared for this session
          localStorage.removeItem("token");
          sessionStorage.setItem("dev_session_cleared", "true");
          setUser(null);
          setLoading(false);
          return;
        }
      }

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        const decoded = decodeToken(token);
        if (!decoded || !decoded.exp) {
          localStorage.removeItem("token");
          setUser(null);
          // Only redirect if not already on signin/signup pages
          if (!window.location.pathname.includes("/Signin") && !window.location.pathname.includes("/Signup")) {
          router.push("/Signin?reason=invalidSession");
          }
        } else if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setUser(null);
          // Only redirect if not already on signin/signup pages
          if (!window.location.pathname.includes("/Signin") && !window.location.pathname.includes("/Signup")) {
          router.push("/Signin?reason=sessionExpired");
          }
        } else {
          setUser({ ...decoded, token });
        }
      }
      setLoading(false);
    };

    checkUser();

    // Check for expiry every 60 seconds (less frequent to reduce overhead)
    const interval = setInterval(() => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        const decoded = decodeToken(token);
        if (decoded && decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setUser(null);
          // Only redirect if not already on signin/signup pages
          if (!window.location.pathname.includes("/Signin") && !window.location.pathname.includes("/Signup")) {
          router.push("/Signin?reason=sessionExpired");
          }
        } else if (decoded) {
          // Update user state if token is still valid (refresh user data)
          setUser({ ...decoded, token });
        }
      }
    }, 60000); // Check every 60 seconds instead of 10

    return () => clearInterval(interval);
  }, [router]);

  const login = (token, userData) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      // Dispatch storage event to sync across tabs
      window.dispatchEvent(new Event("storage"));
    }
    setUser({ ...userData, token });
    // Don't redirect automatically - let the component handle navigation
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      // Dispatch storage event to sync across tabs
      window.dispatchEvent(new Event("storage"));
    }
    setUser(null);
    router.push("/Signin");
  };

  // Listen for storage changes (logout from other tabs)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === null) {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          if (!window.location.pathname.includes("/Signin") && !window.location.pathname.includes("/Signup")) {
            router.push("/Signin?reason=sessionExpired");
          }
        } else {
          const decoded = decodeToken(token);
          if (decoded && decoded.exp && decoded.exp * 1000 > Date.now()) {
            setUser({ ...decoded, token });
          }
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

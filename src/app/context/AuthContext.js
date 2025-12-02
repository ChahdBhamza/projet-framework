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
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        const decoded = decodeToken(token);
        if (!decoded || !decoded.exp) {
          localStorage.removeItem("token");
          setUser(null);
          router.push("/Signin?reason=invalidSession");
        } else if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setUser(null);
          router.push("/Signin?reason=sessionExpired");
        } else {
          setUser({ ...decoded, token });
        }
      }
      setLoading(false);
    };

    checkUser();

    // Check for expiry every 10 seconds
    const interval = setInterval(() => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        const decoded = decodeToken(token);
        if (decoded && decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setUser(null);
          router.push("/Signin?reason=sessionExpired");
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [router]);

  const login = (token, userData) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
    setUser({ ...userData, token });
    // Don't redirect automatically - let the component handle navigation
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    setUser(null);
    router.push("/Signin");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

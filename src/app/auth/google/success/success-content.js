"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";

export default function GoogleAuthSuccessContent() {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    // Read params directly from URL to avoid useSearchParams Suspense requirement
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const name = urlParams.get("name");
      const email = urlParams.get("email");
      const returnUrl = urlParams.get("returnUrl");

      if (token && name && email) {
        // Store token and user info
        login(token, { name, email });

        // Check if user is admin
        const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        const userEmail = email?.toLowerCase()?.trim();
        const adminEmail = ADMIN_EMAIL?.toLowerCase()?.trim();
        const isAdmin = ADMIN_EMAIL && userEmail === adminEmail;

        // Redirect to returnUrl, or Dashboard for admin, or home for non-admin
        let redirectTo = returnUrl;
        if (!redirectTo) {
          redirectTo = isAdmin ? "/Dashboard" : "/";
        }
        router.push(redirectTo);
      } else {
        // If missing params, redirect to signin
        router.push("/Signin?error=oauth_failed");
      }
    }
  }, [router, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#7ab530] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}


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

        // Redirect to returnUrl or dashboard
        const redirectTo = returnUrl || "/Dashboard";
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


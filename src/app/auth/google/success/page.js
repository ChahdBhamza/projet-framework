"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";

export default function GoogleAuthSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const returnUrl = searchParams.get("returnUrl");

    if (token && name && email) {
      login(token, { name, email });
      
      // Check if user is admin
      const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      const userEmail = email?.toLowerCase()?.trim();
      const adminEmail = ADMIN_EMAIL?.toLowerCase()?.trim();
      const isAdmin = ADMIN_EMAIL && userEmail === adminEmail;
      
      // Redirect to returnUrl if provided, otherwise check if admin
      if (returnUrl) {
        const decodedUrl = decodeURIComponent(returnUrl);
        router.push(decodedUrl);
      } else if (isAdmin) {
        // Redirect admin users to dashboard immediately
        router.push("/Dashboard");
      } else {
        router.push("/");
      }
    } else {
      router.push("/Signin?error=invalid_token");
    }
  }, [searchParams, login, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#7ab530] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}


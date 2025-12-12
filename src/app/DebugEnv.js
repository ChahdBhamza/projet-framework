"use client";
import { useEffect, useState } from "react";

export default function DebugEnv() {
  const [serverInfo, setServerInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/debug");
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const json = await res.json();
        if (!cancelled) setServerInfo(json);
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    })();

    return () => (cancelled = true);
  }, []);

  // Only show debug info in non-production to avoid leaking data in production
  if (process.env.NODE_ENV === "production") return null;

  return (
    <section className="fixed bottom-4 right-4 z-50 w-96 max-w-full text-xs">
      <div className="bg-white/95 border rounded shadow p-3 text-gray-900">
        <div className="flex items-center justify-between mb-2">
          <strong>Env Debug</strong>
          <span className="text-gray-500">dev only</span>
        </div>

        <div className="mb-2">
          <div className="font-medium">Client-side (NEXT_PUBLIC_)</div>
          <div className="mt-1 break-words">
            <div>NEXT_PUBLIC_BASE_URL: {process.env.NEXT_PUBLIC_BASE_URL || "(not set)"}</div>
            <div>NEXT_PUBLIC_ADMIN_EMAIL: {process.env.NEXT_PUBLIC_ADMIN_EMAIL || "(not set)"}</div>
          </div>
        </div>

        <div>
          <div className="font-medium">Server-side (via /api/debug)</div>
          <div className="mt-1">
            {error && <div className="text-red-600">Fetch error: {error}</div>}
            {!error && !serverInfo && <div className="text-gray-500">Loading...</div>}
            {serverInfo && (
              <div className="space-y-1">
                <div>APP_URL: {serverInfo.server.APP_URL || "(not set)"}</div>
                <div>MONGO_URI: {serverInfo.server.MONGO_URI ? "present" : "missing"}</div>
                <div>JWT_SECRET: {serverInfo.server.JWT_SECRET ? "present" : "missing"}</div>
                <div>GOOGLE_CLIENT_ID: {serverInfo.server.GOOGLE_CLIENT_ID ? "present" : "missing"}</div>
                <div>SPOONACULAR_API_KEY: {serverInfo.server.SPOONACULAR_API_KEY ? "present" : "missing"}</div>
                <div>RESEND_API_KEY: {serverInfo.server.RESEND_API_KEY ? "present" : "missing"}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

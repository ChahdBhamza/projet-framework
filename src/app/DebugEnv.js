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

  // Show debug panel in all environments for deployment verification
  return (
    <section className="fixed bottom-4 right-4 z-50 w-full max-w-md px-4 sm:max-w-sm text-xs">
      <div className="bg-slate-900/95 border border-slate-700 rounded shadow-lg p-4 text-white">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-700">
          <strong className="text-sm">🔧 Environment Variables Debug</strong>
          <span className="text-slate-400 text-xs">
            {process.env.NODE_ENV === "production" ? "PRODUCTION" : "DEVELOPMENT"}
          </span>
        </div>

        {/* Client-Side Variables */}
        <div className="mb-3">
          <div className="font-semibold text-green-400 text-xs mb-2">✓ Client-side (NEXT_PUBLIC_)</div>
          <div className="space-y-1 ml-2">
            <div className="text-slate-300">
              NEXT_PUBLIC_BASE_URL: 
              <span className={process.env.NEXT_PUBLIC_BASE_URL ? " text-green-300" : " text-red-300"}>
                {process.env.NEXT_PUBLIC_BASE_URL ? ` ✓ ${process.env.NEXT_PUBLIC_BASE_URL}` : " ✗ NOT SET"}
              </span>
            </div>
            <div className="text-slate-300">
              NEXT_PUBLIC_ADMIN_EMAIL: 
              <span className={process.env.NEXT_PUBLIC_ADMIN_EMAIL ? " text-green-300" : " text-red-300"}>
                {process.env.NEXT_PUBLIC_ADMIN_EMAIL ? ` ✓ ${process.env.NEXT_PUBLIC_ADMIN_EMAIL}` : " ✗ NOT SET"}
              </span>
            </div>
          </div>
        </div>

        {/* Server-Side Variables */}
        <div>
          <div className="font-semibold text-blue-400 text-xs mb-2">✓ Server-side (via /api/debug)</div>
          <div className="space-y-1 ml-2">
            {error && <div className="text-red-400 font-semibold">❌ Fetch error: {error}</div>}
            {!error && !serverInfo && <div className="text-slate-400 animate-pulse">⏳ Loading server vars...</div>}
            {serverInfo && (
              <>
                <div className="text-slate-300">
                  APP_URL: 
                  <span className={serverInfo.server.APP_URL ? " text-green-300" : " text-yellow-300"}>
                    {serverInfo.server.APP_URL ? ` ✓ ${serverInfo.server.APP_URL}` : " ⚠ NOT SET"}
                  </span>
                </div>
                <div className="text-slate-300">
                  MONGO_URI: 
                  <span className={serverInfo.server.MONGO_URI ? " text-green-300" : " text-red-300"}>
                    {serverInfo.server.MONGO_URI ? " ✓ PRESENT" : " ✗ MISSING"}
                  </span>
                </div>
                <div className="text-slate-300">
                  JWT_SECRET: 
                  <span className={serverInfo.server.JWT_SECRET ? " text-green-300" : " text-red-300"}>
                    {serverInfo.server.JWT_SECRET ? " ✓ PRESENT" : " ✗ MISSING"}
                  </span>
                </div>
                <div className="text-slate-300">
                  GOOGLE_CLIENT_ID: 
                  <span className={serverInfo.server.GOOGLE_CLIENT_ID ? " text-green-300" : " text-red-300"}>
                    {serverInfo.server.GOOGLE_CLIENT_ID ? " ✓ PRESENT" : " ✗ MISSING"}
                  </span>
                </div>
                <div className="text-slate-300">
                  GOOGLE_CLIENT_SECRET: 
                  <span className={serverInfo.server.GOOGLE_CLIENT_SECRET ? " text-green-300" : " text-red-300"}>
                    {serverInfo.server.GOOGLE_CLIENT_SECRET ? " ✓ PRESENT" : " ✗ MISSING"}
                  </span>
                </div>
                <div className="text-slate-300">
                  GMAIL_USER: 
                  <span className={serverInfo.server.GMAIL_USER ? " text-green-300" : " text-yellow-300"}>
                    {serverInfo.server.GMAIL_USER ? " ✓ PRESENT" : " ⚠ NOT SET"}
                  </span>
                </div>
                <div className="text-slate-300">
                  SPOONACULAR_API_KEY: 
                  <span className={serverInfo.server.SPOONACULAR_API_KEY ? " text-green-300" : " text-yellow-300"}>
                    {serverInfo.server.SPOONACULAR_API_KEY ? " ✓ PRESENT" : " ⚠ OPTIONAL"}
                  </span>
                </div>
                <div className="text-slate-300">
                  RESEND_API_KEY: 
                  <span className={serverInfo.server.RESEND_API_KEY ? " text-green-300" : " text-yellow-300"}>
                    {serverInfo.server.RESEND_API_KEY ? " ✓ PRESENT" : " ⚠ OPTIONAL"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-3 pt-2 border-t border-slate-700">
          <div className="text-xs text-slate-400">
            {serverInfo && !error ? (
              <div>
                {Object.values(serverInfo.server).filter(v => v).length >= 5 ? (
                  <span className="text-green-400">✓ All critical vars present!</span>
                ) : (
                  <span className="text-red-400">✗ Missing critical vars — check Vercel settings</span>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

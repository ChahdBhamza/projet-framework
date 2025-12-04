"use client";

import { Menu, X } from "lucide-react";

export default function Header({ sidebarOpen, setSidebarOpen, user, lastUpdated, autoRefresh, setAutoRefresh, onRefresh, title = "Dashboard Overview" }) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex items-center justify-between">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
      <div className="flex-1">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">
              Welcome back, {user?.name || "Admin"}
              {lastUpdated && (
                <span className="ml-2">• Last updated: {lastUpdated.toLocaleTimeString()}</span>
              )}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={`px-3 py-1.5 text-sm rounded-lg transition ${
            autoRefresh 
              ? "bg-green-100 text-green-700 hover:bg-green-200" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {autoRefresh ? "🟢 Auto-refresh ON" : "⚪ Auto-refresh OFF"}
        </button>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-[#7ab530] text-white rounded-lg hover:bg-[#6aa02b] transition text-sm font-medium"
        >
          Refresh
        </button>
      </div>
    </header>
  );
}


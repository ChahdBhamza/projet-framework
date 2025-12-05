"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import {
  Home,
  UtensilsCrossed,
  BarChart3,
  LogOut,
  ShoppingBag,
  Calendar,
} from "lucide-react";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { href: "/Dashboard", label: "Dashboard", icon: Home },
    { href: "/Dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/products", label: "Products", icon: UtensilsCrossed },
    { href: "/Dashboard/orders", label: "Order History", icon: ShoppingBag },
    { href: "/Dashboard/meal-plans", label: "Meal Plans Generated", icon: Calendar },
  ];

  return (
    <>
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Dietopia</h1>
            <p className="text-sm text-gray-500 mt-1">Admin Dashboard</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? "bg-[#7ab530] text-white font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition">
              <Home className="w-5 h-5" />
              Home
            </Link>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4 px-4 py-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#7ab530] to-[#6aa02b] rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name || "Admin"}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}


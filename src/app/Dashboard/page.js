"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  UserCheck,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  Award,
  MessageSquare,
  UtensilsCrossed,
  Target,
  Settings,
  Send,
  AlertCircle,
  LogOut,
  Home,
  Menu,
  X,
  ShoppingCart,
  Repeat,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";

const COLORS = ["#7ab530", "#34d399", "#60a5fa", "#f97316", "#a78bfa"];

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(true);

  // Fake data for demonstration
  const fakeData = {
    totalUsers: 1247,
    activeUsersToday: 342,
    activePlans: 892,
    revenue: 45680,
    userGrowth: [
      { day: "Mon", users: 120 },
      { day: "Tue", users: 145 },
      { day: "Wed", users: 132 },
      { day: "Thu", users: 168 },
      { day: "Fri", users: 189 },
      { day: "Sat", users: 210 },
      { day: "Sun", users: 195 },
    ],
    popularPlans: [
      { name: "Keto Diet", users: 342, value: 342 },
      { name: "Mediterranean", users: 289, value: 289 },
      { name: "Vegan", users: 156, value: 156 },
      { name: "Paleo", users: 105, value: 105 },
    ],
    pendingApprovals: [
      { id: 1, plan: "Low-Carb High-Protein", author: "Dr. Sarah Chen", status: "pending" },
      { id: 2, plan: "Plant-Based Weight Loss", author: "Nutritionist Mike", status: "pending" },
      { id: 3, plan: "Athlete Meal Plan", author: "Coach James", status: "review" },
    ],
    topContributors: [
      { name: "Dr. Sarah Chen", role: "Nutritionist", plans: 24, rating: 4.9, avatar: "SC" },
      { name: "Mike Johnson", role: "Dietitian", plans: 18, rating: 4.8, avatar: "MJ" },
      { name: "Emma Wilson", role: "Chef", plans: 15, rating: 4.7, avatar: "EW" },
      { name: "David Lee", role: "Nutritionist", plans: 12, rating: 4.6, avatar: "DL" },
    ],
    supportTickets: [
      { id: "#1234", subject: "Account verification issue", status: "open", priority: "high", date: "2h ago" },
      { id: "#1233", subject: "Payment not processing", status: "in-progress", priority: "medium", date: "5h ago" },
      { id: "#1232", subject: "Plan customization request", status: "resolved", priority: "low", date: "1d ago" },
      { id: "#1231", subject: "Feature suggestion", status: "open", priority: "low", date: "2d ago" },
    ],
    popularIngredients: [
      { name: "Chicken Breast", usage: 85 },
      { name: "Broccoli", usage: 78 },
      { name: "Salmon", usage: 72 },
      { name: "Quinoa", usage: 68 },
      { name: "Avocado", usage: 65 },
    ],
    feedbackTrends: [
      { day: "Mon", feedback: 45 },
      { day: "Tue", feedback: 52 },
      { day: "Wed", feedback: 38 },
      { day: "Thu", feedback: 61 },
      { day: "Fri", feedback: 48 },
      { day: "Sat", feedback: 55 },
      { day: "Sun", feedback: 42 },
    ],
  };

  const isAdmin = useMemo(() => {
    if (typeof window === "undefined" || !user) return false;
    const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (!ADMIN_EMAIL) return false;
    const userEmail = user.email?.toLowerCase()?.trim();
    const adminEmail = ADMIN_EMAIL?.toLowerCase()?.trim();
    return userEmail === adminEmail;
  }, [user]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/Signin");
      return;
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!user || !isAdmin) return;
      
      setLoadingSummary(true);
      setError("");
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
          throw new Error("Not authenticated");
        }

        const res = await fetch("/api/admin/summary", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Failed to load dashboard data");
        }
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoadingSummary(false);
      }
    };
    
    if (user && isAdmin) {
      fetchSummary();
    }
  }, [user, isAdmin]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#7ab530] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  if (user && !isAdmin) {
    return (
      <main className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">Restricted Area</h1>
            <p className="text-gray-600 mb-4">This dashboard is only accessible to admin users.</p>
            <Link href="/" className="inline-block mt-4 px-6 py-2 bg-[#7ab530] text-white rounded-lg hover:bg-[#6aa02b] transition">
              Go Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Use real data from summary, fallback to defaults if loading or undefined
  const displayData = loadingSummary || !summary
    ? { 
        totalUsers: "…", 
        activeUsersToday: "…", 
        activePlans: "…", 
        revenue: "…",
        userGrowth: [],
        popularPlans: [],
        orderTrends: [],
        popularTags: [],
        recentOrders: []
      }
    : {
        totalUsers: summary.totalUsers ?? 0,
        activeUsersToday: summary.activeUsersToday ?? 0,
        activePlans: summary.totalMeals ?? 0,
        revenue: summary.totalRevenue ?? 0,
        userGrowth: Array.isArray(summary.userGrowth) ? summary.userGrowth : [],
        popularPlans: Array.isArray(summary.popularPlans) ? summary.popularPlans : [],
        orderTrends: Array.isArray(summary.orderTrends) ? summary.orderTrends : [],
        popularTags: Array.isArray(summary.popularTags) ? summary.popularTags : [],
        recentOrders: Array.isArray(summary.recentOrders) ? summary.recentOrders : [],
        revenueData: Array.isArray(summary.revenueData) ? summary.revenueData : [],
        topSellingMeals: Array.isArray(summary.topSellingMeals) ? summary.topSellingMeals : [],
        priceDistribution: Array.isArray(summary.priceDistribution) ? summary.priceDistribution : [],
        calorieDistribution: Array.isArray(summary.calorieDistribution) ? summary.calorieDistribution : []
      };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Dietopia</h1>
            <p className="text-sm text-gray-500 mt-1">Admin Dashboard</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            <Link href="/Dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#7ab530] text-white font-medium">
              <Home className="w-5 h-5" />
              Dashboard
            </Link>
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">Dashboard Overview</h2>
            <p className="text-sm text-gray-500">Welcome back, {user?.name || "Admin"}</p>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="Total Users"
                value={displayData.totalUsers}
                change={summary?.usersCreatedLast7Days > 0 ? `+${summary.usersCreatedLast7Days} this week` : "No new users"}
                icon={Users}
                color="bg-blue-500"
              />
              <StatCard
                title="Active Today"
                value={displayData.activeUsersToday}
                change={summary?.ordersToday > 0 ? `${summary.ordersToday} orders today` : "No activity"}
                icon={UserCheck}
                color="bg-green-500"
              />
              <StatCard
                title="Total Meals"
                value={displayData.activePlans}
                change={summary && summary.popularPlans && summary.popularPlans.length > 0 ? `${summary.popularPlans.length} categories` : "No meals"}
                icon={UtensilsCrossed}
                color="bg-purple-500"
              />
              <StatCard
                title="Total Revenue"
                value={typeof displayData.revenue === 'number' ? `${displayData.revenue.toFixed(0)} TND` : displayData.revenue}
                change={summary?.totalOrders > 0 ? `${summary.totalOrders} orders` : "No orders"}
                icon={DollarSign}
                color="bg-orange-500"
              />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* User Growth Line Chart */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
                  <select className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7ab530]">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Last 3 Months</option>
                  </select>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={displayData.userGrowth && displayData.userGrowth.length > 0 ? displayData.userGrowth : [{ day: "No data", users: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#7ab530"
                      strokeWidth={2}
                      dot={{ fill: "#7ab530", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Popular Plans Pie Chart */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Popular Diet Plans</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={displayData.popularPlans && displayData.popularPlans.length > 0 ? displayData.popularPlans : [{ name: "No data", value: 1 }]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {(displayData.popularPlans && displayData.popularPlans.length > 0 ? displayData.popularPlans : [{ name: "No data", value: 1 }]).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Revenue Trends */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trends (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={displayData.revenueData && displayData.revenueData.length > 0 ? displayData.revenueData : [{ day: "No data", revenue: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      }}
                      formatter={(value) => [`${Number(value).toFixed(2)} TND`, "Revenue"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#f97316"
                      strokeWidth={2}
                      dot={{ fill: "#f97316", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Order Trends */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Trends (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={displayData.orderTrends && displayData.orderTrends.length > 0 ? displayData.orderTrends : [{ day: "No data", orders: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar dataKey="orders" fill="#7ab530" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Charts Row 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Popular Tags */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Popular Meal Tags</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={displayData.popularTags && displayData.popularTags.length > 0 ? displayData.popularTags : [{ name: "No data", usage: 0 }]} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar dataKey="usage" fill="#34d399" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Price Distribution */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Meal Price Distribution</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={displayData.priceDistribution && displayData.priceDistribution.length > 0 ? displayData.priceDistribution : [{ range: "No data", count: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="range" stroke="#9ca3af" fontSize={12} angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar dataKey="count" fill="#a78bfa" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Charts Row 4 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Calorie Distribution */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Calorie Distribution</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={displayData.calorieDistribution && displayData.calorieDistribution.length > 0 ? displayData.calorieDistribution : [{ range: "No data", count: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="range" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar dataKey="count" fill="#60a5fa" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* User Verification Status */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">User Verification Status</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={summary && summary.totalUsers > 0 ? [
                        { name: "Verified", value: summary.verifiedUsers || 0 },
                        { name: "Unverified", value: (summary.totalUsers - (summary.verifiedUsers || 0)) }
                      ] : [{ name: "No data", value: 1 }]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {summary && summary.totalUsers > 0 ? [
                        <Cell key="verified" fill="#34d399" />,
                        <Cell key="unverified" fill="#f87171" />
                      ] : <Cell key="no-data" fill="#9ca3af" />}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Selling Meals */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#7ab530]" />
                Top Selling Meals
              </h3>
              <div className="space-y-4">
                {displayData.topSellingMeals && displayData.topSellingMeals.length > 0 ? (
                  displayData.topSellingMeals.map((meal, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-[#7ab530] transition">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        #{idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{meal.mealName || "Unknown Meal"}</h4>
                        <p className="text-sm text-gray-600">{meal.totalQuantity} units sold • {meal.orderCount} orders</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#7ab530]">{Number(meal.totalRevenue || 0).toFixed(2)} TND</p>
                        <p className="text-xs text-gray-600">Revenue</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No sales data yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tables Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#7ab530]" />
                  Recent Orders
                </h3>
                <div className="space-y-4">
                  {displayData.recentOrders && displayData.recentOrders.length > 0 ? (
                    displayData.recentOrders.map((order) => (
                      <div key={order.id} className="p-4 border border-gray-200 rounded-lg hover:border-[#7ab530] transition">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{order.userName || order.userEmail || "Unknown User"}</h4>
                            <p className="text-sm text-gray-600">{order.itemsCount} items • {new Date(order.orderDate).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            order.paymentStatus === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-[#7ab530]">{(order.totalAmount || 0).toFixed(2)} TND</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No recent orders</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Most Favorited Meals */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#7ab530]" />
                  Most Favorited Meals
                </h3>
                <div className="space-y-4">
                  {summary?.favoriteMeals && summary.favoriteMeals.length > 0 ? (
                    summary.favoriteMeals.map((meal, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-[#7ab530] transition">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#7ab530] to-[#6aa02b] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {meal.mealName?.charAt(0) || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{meal.mealName || "Unknown Meal"}</h4>
                          <p className="text-sm text-gray-600">Meal ID: {meal.mealId}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">{meal.favorites}</p>
                          <p className="text-xs text-red-600">❤️ favorites</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No favorites yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Statistics Table */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#7ab530]" />
                Order Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{summary?.totalOrders || 0}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Orders Today</p>
                  <p className="text-2xl font-bold text-gray-900">{summary?.ordersToday || 0}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Average Order Value</p>
                  <p className="text-2xl font-bold text-[#7ab530]">{summary?.averageOrderValue || 0} TND</p>
                </div>
              </div>
            </div>

            {/* Admin Controls */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#7ab530]" />
                Admin Controls
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Role Management</h4>
                  <div className="space-y-2">
                    <button className="w-full px-4 py-2.5 bg-[#7ab530] text-white rounded-lg hover:bg-[#6aa02b] transition font-medium text-sm">
                      Manage User Roles
                    </button>
                    <button className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm">
                      Assign Permissions
                    </button>
                  </div>
                </div>
                <div className="p-5 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Notifications</h4>
                  <div className="space-y-2">
                    <button className="w-full px-4 py-2.5 bg-[#7ab530] text-white rounded-lg hover:bg-[#6aa02b] transition font-medium text-sm flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" />
                      Send Announcement
                    </button>
                    <button className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm flex items-center justify-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Push Notification
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center">
                {error}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {change}
        </span>
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

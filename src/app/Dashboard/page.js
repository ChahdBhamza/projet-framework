"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import {
  Users,
  UserCheck,
  DollarSign,
  TrendingUp,
  Clock,
  UtensilsCrossed,
  Target,
  Send,
  Repeat,
  CheckCircle,
  XCircle,
  Award,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Activity,
  Zap,
  LayoutGrid,
} from "lucide-react";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

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
    if (user && isAdmin) {
      fetchSummary();

      if (autoRefresh) {
        const interval = setInterval(() => {
          fetchSummary();
        }, 30000);

        return () => clearInterval(interval);
      }
    }
  }, [user, isAdmin, autoRefresh]);

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

  const fetchSummary = async () => {
    if (!user || !isAdmin) return;

    setLoadingSummary(true);
    setError("");
    try {
      const { apiJson } = await import("../Utils/api");
      const data = await apiJson("/api/admin/summary");
      setSummary(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col lg:ml-0">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={user}
          lastUpdated={lastUpdated}
          autoRefresh={autoRefresh}
          setAutoRefresh={setAutoRefresh}
          onRefresh={fetchSummary}
        />

        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* Creative Welcome Hero */}
            <div className="relative rounded-3xl overflow-hidden bg-white shadow-sm border border-gray-100 p-8 sm:p-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-100 to-green-50 rounded-full blur-3xl opacity-60 -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-50 to-purple-50 rounded-full blur-3xl opacity-60 -ml-10 -mb-10"></div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-2 flex items-center gap-3">
                    Welcome back, Admin 
                  </h1>
                  <p className="text-lg text-gray-500 font-medium max-w-xl">
                    Here's your daily overview. You have <span className="text-[#7ab530] font-bold">{summary?.ordersToday || 0} new orders</span> and <span className="text-blue-600 font-bold">{summary?.usersCreatedLast7Days || 0} new users</span> this week.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard
                title="Total Users"
                value={displayData.totalUsers}
                change={summary?.usersCreatedLast7Days > 0 ? `+${summary.usersCreatedLast7Days} this week` : "No new users"}
                growth={summary?.usersGrowth ? `${summary.usersGrowth > 0 ? '+' : ''}${summary.usersGrowth}%` : null}
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
                change={summary?.mealTypeDistribution ? `${summary.mealTypeDistribution.length} types` : "No meals"}
                icon={UtensilsCrossed}
                color="bg-purple-500"
              />
              <StatCard
                title="Total Revenue"
                value={typeof displayData.revenue === 'number' ? `${displayData.revenue.toFixed(0)} TND` : displayData.revenue}
                change={summary?.totalOrders > 0 ? `${summary.totalOrders} orders` : "No orders"}
                growth={summary?.revenueGrowth ? `${summary.revenueGrowth > 0 ? '+' : ''}${summary.revenueGrowth}%` : null}
                icon={DollarSign}
                color="bg-green-500"
              />
            </div>

            {/* Secondary Metrics Row */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-gray-400" />
                Key Performance Indicators
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <MetricCard
                  label="Conversion Rate"
                  value={summary?.conversionRate ? `${summary.conversionRate}%` : "0%"}
                  icon={Target}
                />
                <MetricCard
                  label="Avg Order Value"
                  value={summary?.averageOrderValue ? `${summary.averageOrderValue} TND` : "0 TND"}
                  icon={DollarSign}
                />
                <MetricCard
                  label="Repeat Customers"
                  value={summary?.repeatCustomersCount || 0}
                  subtitle={`${summary?.repeatCustomerRate || 0}% rate`}
                  icon={Repeat}
                />
                <MetricCard
                  label="Total Favorites"
                  value={summary?.totalFavorites || 0}
                  subtitle={`${summary?.avgFavoritesPerUser || 0} per user`}
                  icon={Award}
                />
                <MetricCard
                  label="Verified Users"
                  value={summary?.verifiedUsers || 0}
                  subtitle={`${summary?.totalUsers > 0 ? Math.round((summary.verifiedUsers / summary.totalUsers) * 100) : 0}%`}
                  icon={CheckCircle}
                />
                <MetricCard
                  label="Orders Growth"
                  value={summary?.ordersGrowth ? `${summary.ordersGrowth > 0 ? '+' : ''}${summary.ordersGrowth}%` : "0%"}
                  icon={TrendingUp}
                />
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Orders */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex flex-col h-full">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Clock className="w-5 h-5 text-[#7ab530]" />
                  </div>
                  Recent Orders
                </h3>
                <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                  {displayData.recentOrders && displayData.recentOrders.length > 0 ? (
                    displayData.recentOrders.slice(0, 5).map((order) => (
                      <div key={order.id} className="group flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-[#7ab530] font-bold text-sm shrink-0">
                          {order.userName ? order.userName.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-sm truncate">{order.userName || "Unknown User"}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                              {order.itemsCount} items
                            </span>
                            <span className="text-xs text-gray-400">{new Date(order.orderDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="block font-bold text-[#7ab530] text-sm">{(order.totalAmount || 0).toFixed(2)}</span>
                          <span className="text-[10px] text-gray-400 font-medium">TND</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                      <Clock className="w-12 h-12 mb-3 opacity-20" />
                      <p className="text-sm font-medium">No recent orders found</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Users */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex flex-col h-full">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                  New Members
                </h3>
                <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                  {summary?.recentUsers && summary.recentUsers.length > 0 ? (
                    summary.recentUsers.map((user, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0 relative">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                          {user.isEmailVerified && (
                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                              <CheckCircle className="w-3 h-3 text-green-500 fill-current" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-sm truncate">{user.name}</h4>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <div className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                          {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 text-sm">No recent signups</div>
                  )}
                </div>
              </div>

              {/* Recent Uploads */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex flex-col h-full">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Send className="w-5 h-5 text-purple-500" />
                  </div>
                  Latest Uploads
                </h3>
                <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                  {summary?.recentUploads && summary.recentUploads.length > 0 ? (
                    summary.recentUploads.map((upload, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                          <Activity className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-sm truncate">{upload.fileName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min((upload.importedCount / upload.totalRows) * 100, 100)}%` }}></div>
                            </div>
                            <span className="text-[10px] text-gray-500 font-medium">{upload.importedCount}/{upload.totalRows}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 text-sm">No recent uploads</div>
                  )}
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

function StatCard({ title, value, change, growth, icon: Icon, color }) {
  const isPositive = growth && parseFloat(growth) > 0;
  const isNegative = growth && parseFloat(growth) < 0;

  return (
    <div className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Background Gradient Blob */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${color.replace('bg-', 'bg-opacity-10 bg-')} blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3.5 rounded-xl ${color} bg-opacity-10 text-white group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
          </div>
          {growth && (
            <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : isNegative ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
              }`}>
              {isPositive ? <ArrowUpRight className="w-3 h-3" /> : isNegative ? <ArrowDownRight className="w-3 h-3" /> : null}
              {growth}
            </span>
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</h3>
          {change && (
            <p className="text-xs text-gray-400 mt-2 font-medium flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              {change}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, subtitle, icon: Icon }) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:border-[#7ab530] hover:shadow-md transition-all duration-200">
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-[#7ab530]/10 transition-colors">
            {Icon && <Icon className="w-4 h-4 text-gray-400 group-hover:text-[#7ab530] transition-colors" />}
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</p>
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-[10px] text-gray-400 font-medium mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

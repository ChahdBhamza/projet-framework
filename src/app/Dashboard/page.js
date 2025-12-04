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
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-600 mt-1">Quick insights and recent activity</p>
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
                color="bg-orange-500"
              />
            </div>

            {/* Secondary Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
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

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#7ab530]" />
                  Recent Orders
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {displayData.recentOrders && displayData.recentOrders.length > 0 ? (
                    displayData.recentOrders.slice(0, 5).map((order) => (
                      <div key={order.id} className="p-3 border border-gray-200 rounded-lg hover:border-[#7ab530] transition">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm truncate">{order.userName || order.userEmail || "Unknown User"}</h4>
                            <p className="text-xs text-gray-600">{order.itemsCount} items • {new Date(order.orderDate).toLocaleDateString()}</p>
                          </div>
                          <span className="text-sm font-bold text-[#7ab530] ml-2">{(order.totalAmount || 0).toFixed(2)} TND</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 text-sm">No recent orders</div>
                  )}
                </div>
              </div>

              {/* Recent Users */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Recent Signups
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {summary?.recentUsers && summary.recentUsers.length > 0 ? (
                    summary.recentUsers.map((user, idx) => (
                      <div key={idx} className="p-3 border border-gray-200 rounded-lg hover:border-blue-500 transition">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm truncate">{user.name}</h4>
                            <p className="text-xs text-gray-600 truncate">{user.email}</p>
                            <p className="text-xs text-gray-500 mt-1">{new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                          {user.isEmailVerified ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-400" />
                          )}
                      </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 text-sm">No recent signups</div>
                  )}
              </div>
            </div>

              {/* Recent Uploads */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Send className="w-5 h-5 text-purple-500" />
                  Recent Uploads
              </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {summary?.recentUploads && summary.recentUploads.length > 0 ? (
                    summary.recentUploads.map((upload, idx) => (
                      <div key={idx} className="p-3 border border-gray-200 rounded-lg hover:border-purple-500 transition">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm truncate">{upload.fileName}</h4>
                            <p className="text-xs text-gray-600">{upload.importedCount}/{upload.totalRows} imported</p>
                            <p className="text-xs text-gray-500 mt-1">{new Date(upload.createdAt).toLocaleDateString()}</p>
                  </div>
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
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        {growth && (
          <span className={`text-xs font-semibold flex items-center gap-1 ${
            parseFloat(growth) > 0 ? 'text-green-600' : parseFloat(growth) < 0 ? 'text-red-600' : 'text-gray-600'
          }`}>
            <TrendingUp className={`w-3 h-3 ${parseFloat(growth) < 0 ? 'rotate-180' : ''}`} />
            {growth}
        </span>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {change && (
        <p className="text-xs text-gray-500 mt-2">{change}</p>
      )}
    </div>
  );
}

function MetricCard({ label, value, subtitle, icon: Icon }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className="w-4 h-4 text-gray-400" />}
        <p className="text-xs font-medium text-gray-600">{label}</p>
      </div>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

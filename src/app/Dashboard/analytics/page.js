"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
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
  ShoppingCart,
  Award,
  Clock,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react";

const COLORS = ["#7ab530", "#34d399", "#60a5fa", "#f97316", "#a78bfa"];

export default function Analytics() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

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

  const fetchSummary = async () => {
    if (!user || !isAdmin) return;
    
    setLoadingSummary(true);
    setError("");
    try {
      const { apiJson } = await import("../../Utils/api");
      const data = await apiJson("/api/admin/summary");
      setSummary(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoadingSummary(false);
    }
  };

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
          </div>
        </div>
      </main>
    );
  }

  const displayData = loadingSummary || !summary
    ? { 
        userGrowth: [],
        popularPlans: [],
        orderTrends: [],
        popularTags: [],
        revenueData: [],
        topSellingMeals: [],
        priceDistribution: [],
        calorieDistribution: []
      }
    : {
        userGrowth: Array.isArray(summary.userGrowth) ? summary.userGrowth : [],
        popularPlans: Array.isArray(summary.popularPlans) ? summary.popularPlans : [],
        orderTrends: Array.isArray(summary.orderTrends) ? summary.orderTrends : [],
        popularTags: Array.isArray(summary.popularTags) ? summary.popularTags : [],
        revenueData: Array.isArray(summary.revenueData) ? summary.revenueData : [],
        topSellingMeals: Array.isArray(summary.topSellingMeals) ? summary.topSellingMeals : [],
        priceDistribution: Array.isArray(summary.priceDistribution) ? summary.priceDistribution : [],
        calorieDistribution: Array.isArray(summary.calorieDistribution) ? summary.calorieDistribution : []
      };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex">
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
          title="Analytics"
        />

        <main className="flex-1 p-4 lg:p-6 xl:p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Analytics Dashboard</h1>
              <p className="text-sm text-gray-600">Comprehensive insights and performance metrics</p>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              {/* User Growth Line Chart */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 border border-gray-100/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900">User Growth</h3>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Last 7 Days</span>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={displayData.userGrowth && displayData.userGrowth.length > 0 ? displayData.userGrowth : [{ day: "No data", users: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                    <XAxis dataKey="day" stroke="#6b7280" fontSize={11} tick={{ fill: '#6b7280' }} />
                    <YAxis stroke="#6b7280" fontSize={11} tick={{ fill: '#6b7280' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        padding: "12px",
                      }}
                      labelStyle={{ color: '#374151', fontWeight: 600 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#7ab530"
                      strokeWidth={3}
                      dot={{ fill: "#7ab530", r: 5, strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 7, stroke: '#7ab530', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Meal Type Distribution */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 border border-gray-100/50">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Meal Type Distribution</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={summary?.mealTypeDistribution && summary.mealTypeDistribution.length > 0 
                        ? summary.mealTypeDistribution.map(item => ({ name: item.type, value: item.count }))
                        : [{ name: "No data", value: 1 }]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {(summary?.mealTypeDistribution && summary.mealTypeDistribution.length > 0 
                        ? summary.mealTypeDistribution.map(item => ({ name: item.type, value: item.count }))
                        : [{ name: "No data", value: 1 }]).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        padding: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              {/* Revenue Trends */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 border border-gray-100/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900">Revenue Trends</h3>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Last 7 Days</span>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={displayData.revenueData && displayData.revenueData.length > 0 ? displayData.revenueData : [{ day: "No data", revenue: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                    <XAxis dataKey="day" stroke="#6b7280" fontSize={11} tick={{ fill: '#6b7280' }} />
                    <YAxis stroke="#6b7280" fontSize={11} tick={{ fill: '#6b7280' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        padding: "12px",
                      }}
                      labelStyle={{ color: '#374151', fontWeight: 600 }}
                      formatter={(value) => [`${Number(value).toFixed(2)} TND`, "Revenue"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#f97316"
                      strokeWidth={3}
                      dot={{ fill: "#f97316", r: 5, strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 7, stroke: '#f97316', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Order Trends */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 border border-gray-100/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900">Order Trends</h3>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Last 7 Days</span>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={displayData.orderTrends && displayData.orderTrends.length > 0 ? displayData.orderTrends : [{ day: "No data", orders: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                    <XAxis dataKey="day" stroke="#6b7280" fontSize={11} tick={{ fill: '#6b7280' }} />
                    <YAxis stroke="#6b7280" fontSize={11} tick={{ fill: '#6b7280' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        padding: "12px",
                      }}
                      labelStyle={{ color: '#374151', fontWeight: 600 }}
                    />
                    <Bar dataKey="orders" fill="#7ab530" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Charts Row 3 - Price Distribution */}
            <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 border border-gray-100/50 mb-4">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Meal Price Distribution</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={displayData.priceDistribution && displayData.priceDistribution.length > 0 ? displayData.priceDistribution : [{ range: "No data", count: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                    <XAxis dataKey="range" stroke="#6b7280" fontSize={11} tick={{ fill: '#6b7280' }} />
                    <YAxis stroke="#6b7280" fontSize={11} tick={{ fill: '#6b7280' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        padding: "12px",
                      }}
                      labelStyle={{ color: '#374151', fontWeight: 600 }}
                    />
                    <Bar dataKey="count" fill="#a78bfa" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Charts Row 4 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              {/* Peak Ordering Hours */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 border border-gray-100/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900">Peak Ordering Hours</h3>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Last 30 Days</span>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={summary?.ordersByHour && summary.ordersByHour.length > 0 
                    ? summary.ordersByHour.map(item => ({ hour: `${item.hour}:00`, count: item.count }))
                    : [{ hour: "No data", count: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                    <XAxis dataKey="hour" stroke="#6b7280" fontSize={11} tick={{ fill: '#6b7280' }} />
                    <YAxis stroke="#6b7280" fontSize={11} tick={{ fill: '#6b7280' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        padding: "12px",
                      }}
                      labelStyle={{ color: '#374151', fontWeight: 600 }}
                    />
                    <Bar dataKey="count" fill="#7ab530" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* User Verification Status */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 border border-gray-100/50">
                <h3 className="text-base font-semibold text-gray-900 mb-4">User Verification Status</h3>
                <ResponsiveContainer width="100%" height={220}>
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
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {summary && summary.totalUsers > 0 ? [
                        <Cell key="verified" fill="#34d399" />,
                        <Cell key="unverified" fill="#f87171" />
                      ] : <Cell key="no-data" fill="#9ca3af" />}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        padding: "12px",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Charts Row 5 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              {/* Calorie Distribution */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 border border-gray-100/50">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Calorie Distribution</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={displayData.calorieDistribution && displayData.calorieDistribution.length > 0 ? displayData.calorieDistribution : [{ range: "No data", count: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                    <XAxis dataKey="range" stroke="#6b7280" fontSize={11} tick={{ fill: '#6b7280' }} />
                    <YAxis stroke="#6b7280" fontSize={11} tick={{ fill: '#6b7280' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        padding: "12px",
                      }}
                      labelStyle={{ color: '#374151', fontWeight: 600 }}
                    />
                    <Bar dataKey="count" fill="#60a5fa" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Popular Meal Tags */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 border border-gray-100/50">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Popular Meal Tags</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={displayData.popularTags && displayData.popularTags.length > 0 ? displayData.popularTags : [{ name: "No data", usage: 0 }]} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                    <XAxis type="number" stroke="#6b7280" fontSize={11} tick={{ fill: '#6b7280' }} />
                    <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={11} width={100} tick={{ fill: '#6b7280' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        padding: "12px",
                      }}
                      labelStyle={{ color: '#374151', fontWeight: 600 }}
                    />
                    <Bar dataKey="usage" fill="#34d399" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tables Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              {/* Top Selling Meals */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 border border-gray-100/50">
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="p-1.5 bg-green-100 rounded-lg">
                    <ShoppingCart className="w-4 h-4 text-[#7ab530]" />
                  </div>
                  Top Selling Meals
                </h3>
                <div className="space-y-3">
                  {displayData.topSellingMeals && displayData.topSellingMeals.length > 0 ? (
                    displayData.topSellingMeals.map((meal, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#7ab530] hover:bg-green-50/30 transition-all duration-200">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm">
                          #{idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900 truncate mb-0.5">{meal.mealName || "Unknown Meal"}</h4>
                          <p className="text-xs text-gray-500">{meal.totalQuantity} units • {meal.orderCount} orders</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-[#7ab530]">{Number(meal.totalRevenue || 0).toFixed(2)} TND</p>
                          <p className="text-xs text-gray-500">Revenue</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No sales data available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Most Favorited Meals */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 border border-gray-100/50">
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="p-1.5 bg-green-100 rounded-lg">
                    <Award className="w-4 h-4 text-[#7ab530]" />
                  </div>
                  Most Favorited Meals
                </h3>
                <div className="space-y-3">
                  {summary?.favoriteMeals && summary.favoriteMeals.length > 0 ? (
                    summary.favoriteMeals.map((meal, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#7ab530] hover:bg-green-50/30 transition-all duration-200">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#7ab530] to-[#6aa02b] rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm">
                          {meal.mealName?.charAt(0) || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900 truncate mb-0.5">{meal.mealName || "Unknown Meal"}</h4>
                          <p className="text-xs text-gray-500">ID: {meal.mealId}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">{meal.favorites}</p>
                          <p className="text-xs text-red-500">❤️</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No favorites data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Statistics */}
            <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 border border-gray-100/50 mb-4">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-green-100 rounded-lg">
                  <Clock className="w-4 h-4 text-[#7ab530]" />
                </div>
                Order Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200/50 hover:shadow-md transition-shadow">
                  <p className="text-xs font-medium text-gray-600 mb-1">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{summary?.totalOrders || 0}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200/50 hover:shadow-md transition-shadow">
                  <p className="text-xs font-medium text-gray-600 mb-1">Orders Today</p>
                  <p className="text-2xl font-bold text-gray-900">{summary?.ordersToday || 0}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200/50 hover:shadow-md transition-shadow">
                  <p className="text-xs font-medium text-gray-600 mb-1">Average Order Value</p>
                  <p className="text-2xl font-bold text-[#7ab530]">{summary?.averageOrderValue || 0} TND</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-center shadow-sm">
                <p className="font-medium">{error}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}


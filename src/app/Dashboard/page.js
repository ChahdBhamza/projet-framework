"use client";

import { useEffect, useState } from "react";
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

  const ADMIN_EMAIL =
    typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_ADMIN_EMAIL
      : undefined;

  const isAdmin = user && ADMIN_EMAIL && user.email?.toLowerCase()?.trim() === ADMIN_EMAIL?.toLowerCase()?.trim();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/Signin");
      return;
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoadingSummary(true);
      setError("");
      try {
        const res = await fetch("/api/admin/summary");
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
    fetchSummary();
  }, []);

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

  const displayTotalUsers = loadingSummary ? "…" : (summary?.totalUsers ?? fakeData.totalUsers);

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
                value={displayTotalUsers}
                change="+12.5%"
                icon={Users}
                color="bg-blue-500"
              />
              <StatCard
                title="Active Today"
                value={fakeData.activeUsersToday}
                change="+8.2%"
                icon={UserCheck}
                color="bg-green-500"
              />
              <StatCard
                title="Active Plans"
                value={fakeData.activePlans}
                change="+5.1%"
                icon={Calendar}
                color="bg-purple-500"
              />
              <StatCard
                title="Revenue"
                value={`$${(fakeData.revenue / 1000).toFixed(1)}k`}
                change="+18.3%"
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
                  <LineChart data={fakeData.userGrowth}>
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
                      data={fakeData.popularPlans}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {fakeData.popularPlans.map((entry, index) => (
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
              {/* Feedback Trends */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Feedback Trends</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={fakeData.feedbackTrends}>
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
                    <Bar dataKey="feedback" fill="#7ab530" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Popular Ingredients */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Popular Ingredients</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={fakeData.popularIngredients} layout="vertical">
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
            </div>

            {/* Tables Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Pending Approvals */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#7ab530]" />
                  Pending Approvals
                </h3>
                <div className="space-y-4">
                  {fakeData.pendingApprovals.map((item) => (
                    <div key={item.id} className="p-4 border border-gray-200 rounded-lg hover:border-[#7ab530] transition">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{item.plan}</h4>
                          <p className="text-sm text-gray-600">by {item.author}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          item.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 px-4 py-2 bg-[#7ab530] text-white rounded-lg text-sm hover:bg-[#6aa02b] transition font-medium">
                          Approve
                        </button>
                        <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition font-medium">
                          Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Contributors */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#7ab530]" />
                  Top Contributors
                </h3>
                <div className="space-y-4">
                  {fakeData.topContributors.map((contributor, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-[#7ab530] transition">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#7ab530] to-[#6aa02b] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {contributor.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{contributor.name}</h4>
                        <p className="text-sm text-gray-600">{contributor.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{contributor.plans}</p>
                        <p className="text-xs text-yellow-600">★ {contributor.rating}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Support Tickets */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#7ab530]" />
                Support Tickets
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ticket</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Subject</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Priority</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fakeData.supportTickets.map((ticket) => (
                      <tr key={ticket.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{ticket.id}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{ticket.subject}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            ticket.status === "open" ? "bg-red-100 text-red-800" :
                            ticket.status === "in-progress" ? "bg-yellow-100 text-yellow-800" :
                            "bg-green-100 text-green-800"
                          }`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            ticket.priority === "high" ? "bg-red-100 text-red-800" :
                            ticket.priority === "medium" ? "bg-yellow-100 text-yellow-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{ticket.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

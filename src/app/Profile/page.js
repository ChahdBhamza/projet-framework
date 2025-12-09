"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Header from "../Header";
import Footer from "../Footer";
import { apiJson } from "../Utils/api";
import {
  User,
  Lock,
  ShoppingBag,
  Calendar,
  Mail,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Package,
  Clock,
  DollarSign,
  Edit,
  Shield,
  TrendingUp,
  FileText,
  ChevronDown,
  ChevronUp,
  X,
  Save,
  Scroll,
  Activity,
  Utensils,
  Loader2,
} from "lucide-react";

export default function Profile() {
  const { user, loading: authLoading, updateUser } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [mealPlans, setMealPlans] = useState([]);
  const [loadingMealPlans, setLoadingMealPlans] = useState(true);
  const [expandedMealPlans, setExpandedMealPlans] = useState({});
  const [activityLogs, setActivityLogs] = useState([]);
  const [loadingActivityLogs, setLoadingActivityLogs] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    profile: true,
    password: false,
    orders: false,
    mealPlans: false,
    activityLogs: false,
  });

  // Name editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [nameError, setNameError] = useState("");
  const [nameSuccess, setNameSuccess] = useState("");
  const [updatingName, setUpdatingName] = useState(false);

  // Order detail modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/Signin");
    }
  }, [user, authLoading, router]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoadingOrders(true);
      const data = await apiJson("/api/orders");
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  const fetchActivityLogs = useCallback(async () => {
    try {
      setLoadingActivityLogs(true);
      const data = await apiJson("/api/admin/activity-logs?limit=50");
      if (data.success) {
        setActivityLogs(data.logs || []);
      }
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      setActivityLogs([]);
    } finally {
      setLoadingActivityLogs(false);
    }
  }, []);

  const fetchMealPlans = useCallback(async () => {
    try {
      setLoadingMealPlans(true);
      const data = await apiJson("/api/meal-plans");
      if (data.success) {
        setMealPlans(data.mealPlans || []);
      }
    } catch (error) {
      console.error("Error fetching meal plans:", error);
      setMealPlans([]);
    } finally {
      setLoadingMealPlans(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchMealPlans();
      setEditedName(user?.name || "");

      // Check if admin and fetch activity logs
      const ADMIN_EMAIL = typeof window !== "undefined" ? process.env.NEXT_PUBLIC_ADMIN_EMAIL : undefined;
      const userEmail = user?.email?.toLowerCase()?.trim();
      const adminEmail = ADMIN_EMAIL?.toLowerCase()?.trim();
      const isAdmin = ADMIN_EMAIL && userEmail === adminEmail;

      if (isAdmin) {
        fetchActivityLogs();
      }
    }
  }, [user, fetchOrders, fetchMealPlans, fetchActivityLogs]);

  const handleNameEdit = () => {
    setIsEditingName(true);
    setEditedName(user?.name || "");
    setNameError("");
    setNameSuccess("");
  };

  const handleNameCancel = () => {
    setIsEditingName(false);
    setEditedName(user?.name || "");
    setNameError("");
    setNameSuccess("");
  };

  const handleNameSave = async () => {
    setNameError("");
    setNameSuccess("");

    if (!editedName.trim()) {
      setNameError("Name cannot be empty");
      return;
    }

    if (editedName.trim().length < 2) {
      setNameError("Name must be at least 2 characters long");
      return;
    }

    if (editedName.trim() === user?.name) {
      setIsEditingName(false);
      return;
    }

    try {
      setUpdatingName(true);
      const data = await apiJson("/api/user/update-profile", {
        method: "PUT",
        body: JSON.stringify({
          name: editedName.trim(),
        }),
      });

      if (data.success) {
        setNameSuccess("Name updated successfully!");
        setIsEditingName(false);

        // Update token in localStorage if a new token is provided
        if (data.token && typeof window !== "undefined") {
          localStorage.setItem("token", data.token);
        }

        // Update user context with new data
        if (updateUser) {
          updateUser({ ...user, name: data.user.name });
        }

        setTimeout(() => setNameSuccess(""), 3000);
      } else {
        setNameError(data.error || "Failed to update name");
      }
    } catch (error) {
      setNameError(error.message || "Failed to update name");
    } finally {
      setUpdatingName(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError("New password must be different from current password");
      return;
    }

    try {
      setChangingPassword(true);
      const data = await apiJson("/api/user/change-password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (data.success) {
        setPasswordSuccess("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordSuccess(""), 5000);
      } else {
        setPasswordError(data.error || "Failed to change password");
      }
    } catch (error) {
      setPasswordError(error.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setSelectedOrder(null);
    setShowOrderModal(false);
  };

  const isOAuthUser = user?.provider === "google" || !user?.email?.includes("@");
  const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalOrders = orders.length;

  // Check if user is admin
  const ADMIN_EMAIL = typeof window !== "undefined" ? process.env.NEXT_PUBLIC_ADMIN_EMAIL : undefined;
  const userEmail = user?.email?.toLowerCase()?.trim();
  const adminEmail = ADMIN_EMAIL?.toLowerCase()?.trim();
  const isAdmin = ADMIN_EMAIL && userEmail === adminEmail;

  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#7ab530] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f0f9ff] via-white to-[#f0fdf4]">
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#7ab530] to-[#6aa02b] rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg border-2 border-white">
              {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(" ")[0] || "User"}!
          </h1>
          <p className="text-gray-600 text-lg">Manage your account and track your activity</p>
        </div>

        {/* Stats Cards - Hidden for admins */}
        {!isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{totalOrders}</span>
              </div>
              <p className="text-gray-600 font-medium">Total Orders</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{totalSpent.toFixed(0)}</span>
              </div>
              <p className="text-gray-600 font-medium">Total Spent (TND)</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-3xl font-bold text-gray-900">
                  {orders.length > 0 ? Math.round(totalSpent / totalOrders) : 0}
                </span>
              </div>
              <p className="text-gray-600 font-medium">Avg. Order Value</p>
            </div>
          </div>
        )}

        {/* Profile Information Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 mb-6 overflow-hidden">
          <button
            onClick={() => toggleSection("profile")}
            className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#7ab530] to-[#6aa02b] rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                <p className="text-sm text-gray-500">View and manage your account details</p>
              </div>
            </div>
            {expandedSections.profile ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {expandedSections.profile && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="pt-6 space-y-6">
                <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#7ab530] to-[#6aa02b] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{user?.name || "User"}</h3>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      {isEditingName ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-[#7ab530] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7ab530] transition"
                            placeholder="Enter your name"
                            disabled={updatingName}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleNameSave}
                              disabled={updatingName}
                              className="flex-1 bg-[#7ab530] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#6aa02b] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                              <Save className="w-4 h-4" />
                              {updatingName ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={handleNameCancel}
                              disabled={updatingName}
                              className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Cancel
                            </button>
                          </div>
                          {nameError && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <XCircle className="w-4 h-4" />
                              {nameError}
                            </p>
                          )}
                          {nameSuccess && (
                            <p className="text-sm text-green-600 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              {nameSuccess}
                            </p>
                          )}
                        </div>
                      ) : (
                        <>
                          <input
                            type="text"
                            value={user?.name || ""}
                            disabled
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed focus:outline-none"
                          />
                          {!isOAuthUser && (
                            <button
                              onClick={handleNameEdit}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7ab530] hover:text-[#6aa02b] transition p-1"
                              title="Edit name"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                    {!isOAuthUser && !isEditingName && (
                      <p className="text-xs text-gray-500 mt-1">Click the edit icon to change your name</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed focus:outline-none"
                      />
                      <Mail className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                {isOAuthUser && (
                  <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-blue-900 mb-1">Google Account</p>
                        <p className="text-sm text-blue-700">
                          This account was created with Google. Email and name changes are managed through your Google account settings.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Password Change Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 mb-6 overflow-hidden">
          <button
            onClick={() => toggleSection("password")}
            className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold text-gray-900">Security & Password</h2>
                <p className="text-sm text-gray-500">Change your password and manage security</p>
              </div>
            </div>
            {expandedSections.password ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {expandedSections.password && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="pt-6">
                {isOAuthUser ? (
                  <div className="p-8 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-yellow-600" />
                    </div>
                    <p className="text-yellow-900 font-semibold text-lg mb-2">Password Change Not Available</p>
                    <p className="text-sm text-yellow-800 max-w-md mx-auto">
                      This account was created with Google. Password changes are managed through your Google account settings.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordChange} className="space-y-6 max-w-2xl mx-auto">
                    {passwordError && (
                      <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-xl flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{passwordError}</p>
                      </div>
                    )}

                    {passwordSuccess && (
                      <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-xl flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-700">{passwordSuccess}</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7ab530] focus:border-transparent transition"
                          placeholder="Enter your current password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                        >
                          {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7ab530] focus:border-transparent transition"
                          placeholder="Enter your new password"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Must be at least 6 characters long</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7ab530] focus:border-transparent transition"
                          placeholder="Confirm your new password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="w-full bg-gradient-to-r from-[#7ab530] to-[#6aa02b] text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                    >
                      {changingPassword ? "Changing Password..." : "Update Password"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Orders Section - Hidden for admins */}
        {!isAdmin && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 mb-6 overflow-hidden">
            <button
              onClick={() => toggleSection("orders")}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-bold text-gray-900">Order History</h2>
                  <p className="text-sm text-gray-500">
                    {totalOrders > 0 ? `${totalOrders} order${totalOrders > 1 ? "s" : ""} found` : "No orders yet"}
                  </p>
                </div>
              </div>
              {expandedSections.orders ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.orders && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="pt-6">
                  {loadingOrders ? (
                    <div className="text-center py-16">
                      <div className="w-12 h-12 border-4 border-[#7ab530] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading orders...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-gray-900 font-semibold text-lg mb-2">No orders yet</p>
                      <p className="text-sm text-gray-600 mb-6">Start shopping to see your orders here</p>
                      <a
                        href="/Products"
                        className="inline-block px-8 py-3 bg-gradient-to-r from-[#7ab530] to-[#6aa02b] text-white rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105"
                      >
                        Browse Products
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order._id}
                          className="border-2 border-gray-200 rounded-2xl p-6 hover:border-[#7ab530] hover:shadow-lg transition-all bg-gradient-to-br from-gray-50 to-white cursor-pointer"
                          onClick={() => openOrderModal(order)}
                        >
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-[#7ab530] rounded-xl flex items-center justify-center">
                                  <Package className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-gray-900 text-lg">
                                    Order #{order._id.slice(-8).toUpperCase()}
                                  </h3>
                                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      {formatDate(order.orderDate)}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      <span className="capitalize font-medium">{order.paymentStatus}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-left md:text-right">
                              <p className="text-2xl font-bold text-[#7ab530] flex items-center gap-1 md:justify-end">
                                <DollarSign className="w-6 h-6" />
                                {order.totalAmount.toFixed(2)} TND
                              </p>
                              <p className="text-sm text-gray-500 mt-1">{order.items.length} item(s)</p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openOrderModal(order);
                                }}
                                className="mt-3 flex items-center gap-2 text-[#7ab530] hover:text-[#6aa02b] font-semibold text-sm transition"
                              >
                                <Scroll className="w-4 h-4" />
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Meal Plans Section - Hidden for admins */}
        {!isAdmin && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 mb-6 overflow-hidden">
            <button
              onClick={() => toggleSection("mealPlans")}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-bold text-gray-900">Meal Plans</h2>
                  <p className="text-sm text-gray-500">Create and manage your personalized meal plans</p>
                </div>
              </div>
              {expandedSections.mealPlans ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.mealPlans && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="pt-6">
                  {loadingMealPlans ? (
                    <div className="text-center py-16">
                      <Loader2 className="w-12 h-12 text-[#7ab530] animate-spin mx-auto mb-4" />
                      <p className="text-gray-600">Loading your meal plans...</p>
                    </div>
                  ) : mealPlans.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-10 h-10 text-purple-600" />
                      </div>
                      <p className="text-gray-900 font-semibold text-lg mb-2">No meal plans yet</p>
                      <p className="text-sm text-gray-600 mb-6">Create a personalized meal plan to get started on your health journey</p>
                      <a
                        href="/MealPlans"
                        className="inline-block px-8 py-3 bg-gradient-to-r from-[#7ab530] to-[#6aa02b] text-white rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105"
                      >
                        Create Meal Plan
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {mealPlans.map((plan) => (
                        <div
                          key={plan._id}
                          className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-all p-6"
                        >
                          {/* Header with Icon */}
                          <div className="flex items-start gap-4 mb-6">
                            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                              <Utensils className="w-7 h-7 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-1">Meal Plan</h3>
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Created {new Date(plan.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>

                          {/* Stats Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                              <p className="text-xs text-gray-600 mb-1 font-medium">Daily Calories</p>
                              <p className="text-2xl font-bold text-emerald-600">
                                {plan.calculatedStats?.tdee || 0}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">kcal</p>
                            </div>
                            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                              <p className="text-xs text-gray-600 mb-1 font-medium">Protein</p>
                              <p className="text-2xl font-bold text-indigo-600">
                                {plan.calculatedStats?.macros?.protein || 0}g
                              </p>
                              <p className="text-xs text-gray-500 mt-1">per day</p>
                            </div>
                            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                              <p className="text-xs text-gray-600 mb-1 font-medium">Carbs</p>
                              <p className="text-2xl font-bold text-amber-600">
                                {plan.calculatedStats?.macros?.carbs || 0}g
                              </p>
                              <p className="text-xs text-gray-500 mt-1">per day</p>
                            </div>
                            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                              <p className="text-xs text-gray-600 mb-1 font-medium">Fats</p>
                              <p className="text-2xl font-bold text-purple-600">
                                {plan.calculatedStats?.macros?.fats || 0}g
                              </p>
                              <p className="text-xs text-gray-500 mt-1">per day</p>
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full font-medium text-xs flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {plan.mealPlan?.length || 0} days
                            </span>
                            <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full font-medium text-xs capitalize flex items-center gap-1.5">
                              <TrendingUp className="w-3.5 h-3.5" />
                              {plan.userProfile?.trainingActivity || 'N/A'}
                            </span>
                            {plan.userProfile?.gender && (
                              <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full font-medium text-xs capitalize">
                                {plan.userProfile.gender}
                              </span>
                            )}
                          </div>

                          {/* View Meals Button */}
                          <button
                            onClick={() => setExpandedMealPlans(prev => ({
                              ...prev,
                              [plan._id]: !prev[plan._id]
                            }))}
                            className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-[#7ab530] to-[#6aa02b] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                          >
                            {expandedMealPlans[plan._id] ? (
                              <>
                                <ChevronUp className="w-5 h-5" />
                                Hide Meal Details
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-5 h-5" />
                                View Meal Details
                              </>
                            )}
                          </button>

                          {/* Expandable Meal Details */}
                          {expandedMealPlans[plan._id] && plan.mealPlan && (
                            <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
                              <h4 className="font-semibold text-gray-900 text-base mb-3">Daily Meal Plan</h4>
                              {plan.mealPlan.map((dayPlan) => (
                                <div key={dayPlan.day} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                  <p className="font-semibold text-gray-700 mb-3 text-sm">Day {dayPlan.day}</p>
                                  <div className="space-y-2">
                                    {/* Breakfast */}
                                    {dayPlan.breakfast && (
                                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                                        <p className="font-medium text-gray-600 mb-1 text-xs">BREAKFAST</p>
                                        <p className="font-semibold text-gray-900 mb-2 text-sm">{dayPlan.breakfast.mealName}</p>
                                        <div className="grid grid-cols-4 gap-2 text-xs">
                                          <div>
                                            <p className="text-gray-500">Calories</p>
                                            <p className="font-medium text-gray-900">{dayPlan.breakfast.calories}</p>
                                          </div>
                                          <div>
                                            <p className="text-gray-500">Protein</p>
                                            <p className="font-medium text-gray-900">{dayPlan.breakfast.protein}g</p>
                                          </div>
                                          <div>
                                            <p className="text-gray-500">Carbs</p>
                                            <p className="font-medium text-gray-900">{dayPlan.breakfast.carbs}g</p>
                                          </div>
                                          <div>
                                            <p className="text-gray-500">Fats</p>
                                            <p className="font-medium text-gray-900">{dayPlan.breakfast.fats}g</p>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {/* Lunch */}
                                    {dayPlan.lunch && (
                                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                                        <p className="font-medium text-gray-600 mb-1 text-xs">LUNCH</p>
                                        <p className="font-semibold text-gray-900 mb-2 text-sm">{dayPlan.lunch.mealName}</p>
                                        <div className="grid grid-cols-4 gap-2 text-xs">
                                          <div>
                                            <p className="text-gray-500">Calories</p>
                                            <p className="font-medium text-gray-900">{dayPlan.lunch.calories}</p>
                                          </div>
                                          <div>
                                            <p className="text-gray-500">Protein</p>
                                            <p className="font-medium text-gray-900">{dayPlan.lunch.protein}g</p>
                                          </div>
                                          <div>
                                            <p className="text-gray-500">Carbs</p>
                                            <p className="font-medium text-gray-900">{dayPlan.lunch.carbs}g</p>
                                          </div>
                                          <div>
                                            <p className="text-gray-500">Fats</p>
                                            <p className="font-medium text-gray-900">{dayPlan.lunch.fats}g</p>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {/* Dinner */}
                                    {dayPlan.dinner && (
                                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                                        <p className="font-medium text-gray-600 mb-1 text-xs">DINNER</p>
                                        <p className="font-semibold text-gray-900 mb-2 text-sm">{dayPlan.dinner.mealName}</p>
                                        <div className="grid grid-cols-4 gap-2 text-xs">
                                          <div>
                                            <p className="text-gray-500">Calories</p>
                                            <p className="font-medium text-gray-900">{dayPlan.dinner.calories}</p>
                                          </div>
                                          <div>
                                            <p className="text-gray-500">Protein</p>
                                            <p className="font-medium text-gray-900">{dayPlan.dinner.protein}g</p>
                                          </div>
                                          <div>
                                            <p className="text-gray-500">Carbs</p>
                                            <p className="font-medium text-gray-900">{dayPlan.dinner.carbs}g</p>
                                          </div>
                                          <div>
                                            <p className="text-gray-500">Fats</p>
                                            <p className="font-medium text-gray-900">{dayPlan.dinner.fats}g</p>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Activity Logs Section - Only for admins */}
        {isAdmin && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 mb-6 overflow-hidden">
            <button
              onClick={() => toggleSection("activityLogs")}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-bold text-gray-900">Activity Logs</h2>
                  <p className="text-sm text-gray-500">
                    {activityLogs.length > 0 ? `${activityLogs.length} recent activities` : "No activities yet"}
                  </p>
                </div>
              </div>
              {expandedSections.activityLogs ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.activityLogs && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="pt-6">
                  {loadingActivityLogs ? (
                    <div className="text-center py-16">
                      <div className="w-12 h-12 border-4 border-[#7ab530] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading activity logs...</p>
                    </div>
                  ) : activityLogs.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Activity className="w-10 h-10 text-indigo-600" />
                      </div>
                      <p className="text-gray-900 font-semibold text-lg mb-2">No activity logs yet</p>
                      <p className="text-sm text-gray-600">Your activities will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activityLogs.map((log) => (
                        <div
                          key={log._id}
                          className="border-2 border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md transition-all bg-gradient-to-br from-gray-50 to-white"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`w-2 h-2 rounded-full ${log.action === 'product_upload' ? 'bg-green-500' :
                                  log.action === 'login' ? 'bg-blue-500' :
                                    log.action === 'logout' ? 'bg-gray-500' :
                                      log.action === 'profile_update' ? 'bg-purple-500' :
                                        'bg-indigo-500'
                                  }`}></div>
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                  {log.action.replace('_', ' ')}
                                </span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500">
                                  {new Date(log.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              <p className="text-gray-900 font-medium text-sm mb-1">
                                {log.description}
                              </p>
                              {log.metadata && Object.keys(log.metadata).length > 0 && (
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                  <div className="flex flex-wrap gap-2">
                                    {log.metadata.fileName && (
                                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                        File: {log.metadata.fileName}
                                      </span>
                                    )}
                                    {log.metadata.importedCount !== undefined && (
                                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                        {log.metadata.importedCount} imported
                                      </span>
                                    )}
                                    {log.metadata.errorCount > 0 && (
                                      <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
                                        {log.metadata.errorCount} errors
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={closeOrderModal}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#7ab530] rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order #{selectedOrder._id.slice(-8).toUpperCase()}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(selectedOrder.orderDate)}
                  </p>
                </div>
              </div>
              <button
                onClick={closeOrderModal}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-gray-900 capitalize">{selectedOrder.paymentStatus}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-[#7ab530] flex items-center gap-2">
                        <DollarSign className="w-7 h-7" />
                        {selectedOrder.totalAmount.toFixed(2)} TND
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{selectedOrder.items.length} item(s)</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Order Items
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-[#7ab530] transition">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-lg mb-2">
                              {item.mealData?.mealName || "Unknown Meal"}
                            </h4>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p className="flex items-center gap-2">
                                <span className="font-medium">Type:</span>
                                <span className="capitalize">{item.mealData?.mealType}</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <span className="font-medium">Quantity:</span>
                                <span>{item.quantity}</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <span className="font-medium">Unit Price:</span>
                                <span>{item.price.toFixed(2)} TND</span>
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-[#7ab530]">
                              {(item.price * item.quantity).toFixed(2)} TND
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {item.quantity} × {item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeOrderModal}
                className="w-full bg-gradient-to-r from-[#7ab530] to-[#6aa02b] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

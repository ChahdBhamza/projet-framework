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
  const [adminOrders, setAdminOrders] = useState([]);
  const [loadingAdminOrders, setLoadingAdminOrders] = useState(false);
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

  // Profile picture state
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || null);
  const [uploadingPicture, setUploadingPicture] = useState(false);

  // Activity logs pagination state
  const [showAllActivities, setShowAllActivities] = useState(false);


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

  const fetchAdminOrders = useCallback(async () => {
    try {
      setLoadingAdminOrders(true);
      const data = await apiJson("/api/admin/orders");
      if (data.success) {
        setAdminOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching admin orders:", error);
      setAdminOrders([]);
    } finally {
      setLoadingAdminOrders(false);
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

  // Fetch user profile data including profile picture
  const fetchUserProfile = useCallback(async () => {
    try {
      const data = await apiJson("/api/user/profile");
      if (data.success && data.user) {
        setProfilePicture(data.user.profilePicture || null);
        if (updateUser) {
          updateUser({ ...user, profilePicture: data.user.profilePicture });
        }
        // Update localStorage with current user's email for validation
        if (typeof window !== "undefined") {
          localStorage.setItem('user', JSON.stringify({
            email: user?.email,
            profilePicture: data.user.profilePicture || null
          }));
        }
      }
    } catch (error) {
      // Silently fail - profile picture is optional
      // Only log if it's not a network/auth error
      if (error.message && !error.message.includes('Session expired') && !error.message.includes('Network error')) {
        console.error("Error fetching user profile:", error);
      }
    }
  }, [user, updateUser]);

  useEffect(() => {
    if (user?.email) {
      fetchOrders();
      fetchMealPlans();
      fetchUserProfile();
      setEditedName(user?.name || "");

      // Check if admin and fetch activity logs
      const ADMIN_EMAIL = typeof window !== "undefined" ? process.env.NEXT_PUBLIC_ADMIN_EMAIL : undefined;
      const userEmail = user?.email?.toLowerCase()?.trim();
      const adminEmail = ADMIN_EMAIL?.toLowerCase()?.trim();
      const isAdmin = ADMIN_EMAIL && userEmail === adminEmail;

      if (isAdmin) {
        fetchActivityLogs();
        fetchAdminOrders();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

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

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    try {
      setUploadingPicture(true);
      const formData = new FormData();
      formData.append('profilePicture', file);

      const token = localStorage.getItem("token");
      if (!token) {
        alert('Please sign in to upload a profile picture');
        setUploadingPicture(false);
        return;
      }

      const response = await fetch('/api/user/profile-picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to upload profile picture' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        // Update local state
        setProfilePicture(data.profilePicture);

        // Update user context
        if (updateUser) {
          updateUser({ ...user, profilePicture: data.profilePicture });
        }

        // Store in localStorage with user email for validation
        if (typeof window !== "undefined") {
          localStorage.setItem('user', JSON.stringify({
            email: user?.email,
            profilePicture: data.profilePicture
          }));

          // Dispatch custom event to notify header
          window.dispatchEvent(new CustomEvent('profilePictureUpdated', {
            detail: { profilePicture: data.profilePicture }
          }));
        }
      } else {
        alert(data.error || 'Failed to upload profile picture');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      // Show user-friendly error message
      if (error.message && !error.message.includes('Failed to fetch') && !error.message.includes('Network error')) {
        alert(error.message);
      } else {
        alert('Network error. Please check your connection and try again.');
      }
    } finally {
      setUploadingPicture(false);
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

  // Check if user is admin
  const ADMIN_EMAIL = typeof window !== "undefined" ? process.env.NEXT_PUBLIC_ADMIN_EMAIL : undefined;
  const userEmail = user?.email?.toLowerCase()?.trim();
  const adminEmail = ADMIN_EMAIL?.toLowerCase()?.trim();
  const isAdmin = ADMIN_EMAIL && userEmail === adminEmail;

  const isOAuthUser = user?.provider === "google" || !user?.email?.includes("@");

  // Use adminOrders for admin, regular orders for users
  const relevantOrders = isAdmin ? adminOrders : orders;
  const totalSpent = relevantOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalOrders = relevantOrders.length;


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
    <main className="min-h-screen bg-white">


      <div className="relative z-10">
        <Header />

        <div className="max-w-5xl mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block mb-4 relative">
              <div className="relative group">
                {/* Animated gradient ring for admin */}
                {isAdmin && (
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#7ab530] via-[#6aa02b] to-[#8bc34a] rounded-full opacity-75 blur-lg group-hover:opacity-100 transition duration-500 animate-gradient-rotate"></div>
                )}
                <div className="relative">
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className={isAdmin ? "w-28 h-28 rounded-full object-cover shadow-2xl border-4 border-white/90 backdrop-blur-sm relative z-10" : "w-28 h-28 rounded-full object-cover shadow-lg border-4 border-white"}
                    />
                  ) : (
                    <div className="w-28 h-28 bg-gradient-to-br from-[#7ab530] to-[#6aa02b] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white">
                      {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 w-10 h-10 bg-[#7ab530] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#6aa02b] transition-all shadow-lg border-3 border-white hover:scale-110 z-10">
                    <Edit className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                      disabled={uploadingPicture}
                    />
                  </label>
                  {uploadingPicture && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full backdrop-blur-sm z-20">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            {isAdmin ? (
              <div className="max-w-2xl mx-auto p-8 rounded-3xl animate-slide-up">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">
                  Welcome back, Admin
                </h1>
                <p className="text-gray-600 text-lg font-medium tracking-wide">
                  Manage the platform and review recent activity
                </p>
              </div>
            ) : (
              <>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  Welcome back, {user?.name?.split(" ")[0] || "User"}!
                </h1>
                <p className="text-gray-600 text-lg">
                  Manage your account and track your activity
                </p>
              </>
            )}
          </div>

          {/* Admin Summary + Quick Actions */}
          {isAdmin && (
            <div className="space-y-6 mb-10 animate-fade-in-delayed">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Orders Card */}
                <div className="group bg-white p-6 rounded-2xl shadow-lg border-2 border-transparent bg-white hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer animate-slide-up">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#7ab530] to-[#6aa02b] flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                      <Package className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 font-medium">Total Orders</p>
                  <p className="text-4xl font-bold text-gray-900 group-hover:scale-110 transition-transform duration-300">{totalOrders}</p>
                </div>

                {/* Total Revenue Card */}
                <div className="group bg-white p-6 rounded-2xl shadow-lg border-2 border-transparent bg-white hover:from-[#7ab530]/30 hover:via-[#6aa02b]/20 hover:to-[#8bc34a]/30 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer animate-slide-up-delayed">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#7ab530] to-[#6aa02b] flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                      <DollarSign className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 font-medium">Total Revenue </p>
                  <p className="text-4xl font-bold text-gray-900 group-hover:scale-110 transition-transform duration-300">{totalSpent.toFixed(0)} TND</p>
                </div>

                {/* Activity Logs Card */}
                <div className="group bg-white p-6 rounded-2xl shadow-lg border-2 border-transparent bg-white hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer animate-slide-up-more-delayed">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#7ab530] to-[#6aa02b] flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                      <Activity className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 font-medium">Activity Logs</p>
                  <p className="text-4xl font-bold text-gray-900 group-hover:scale-110 transition-transform duration-300">{activityLogs.length || 0}</p>
                </div>
              </div>

              {/* Quick Actions */}

            </div>
          )}

          {/* Stats Cards - Hidden for admins */}
          {
            !isAdmin && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent bg-gradient-to-br from-blue-50 via-white to-blue-50 hover:from-[#7ab530]/10 hover:to-[#8bc34a]/10 hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-3xl font-bold text-gray-900">{totalOrders}</span>
                  </div>
                  <p className="text-gray-600 font-medium">Total Orders</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent bg-gradient-to-br from-green-50 via-white to-green-50 hover:from-[#7ab530]/10 hover:to-[#8bc34a]/10 hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-3xl font-bold text-gray-900">{totalSpent.toFixed(0)}</span>
                  </div>
                  <p className="text-gray-600 font-medium">Total Spent (TND)</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent bg-gradient-to-br from-purple-50 via-white to-purple-50 hover:from-[#7ab530]/10 hover:to-[#8bc34a]/10 hover:shadow-xl transition-all">
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
            )
          }

          {/* Profile Information Section */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 mb-6 overflow-hidden mt-8">
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
                    <div className="relative group">
                      {profilePicture ? (
                        <img
                          src={profilePicture}
                          alt="Profile"
                          className="w-24 h-24 rounded-full object-cover shadow-lg border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gradient-to-br from-[#7ab530] to-[#6aa02b] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                          {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      )}
                      <label className="absolute bottom-0 right-0 w-9 h-9 bg-[#7ab530] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#6aa02b] transition-all shadow-md border-2 border-white hover:scale-110 z-10">
                        <Edit className="w-4 h-4 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureChange}
                          className="hidden"
                          disabled={uploadingPicture}
                        />
                      </label>
                      {uploadingPicture && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full backdrop-blur-sm">
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                        </div>
                      )}
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
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 mb-6 overflow-hidden mt-8">
            <button
              onClick={() => toggleSection("password")}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#7ab530] rounded-xl flex items-center justify-center">
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
                    <div className="p-8 bg-white border-2 border-[#7ab530] rounded-2xl text-center">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#7ab530] bg-white">
                        <Lock className="w-8 h-8 text-[#7ab530]" />
                      </div>
                      <p className="text-[#7ab530] font-semibold text-lg mb-2">Password Change Not Available</p>
                      <p className="text-sm text-black max-w-md mx-auto">
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
          {
            !isAdmin && (
              <div className="bg-white rounded-3xl shadow-xl border-2 border-[#7ab530] mb-6 overflow-hidden mt-8" style={{ borderImage: 'linear-gradient(135deg, #7ab530, #6aa02b, #8bc34a) 1' }}>
                <button
                  onClick={() => toggleSection("orders")}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#7ab530] rounded-xl flex items-center justify-center">
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
                        <div className="space-y-3">
                          {orders.map((order) => (
                            <div
                              key={order._id}
                              className="group bg-white rounded-xl border border-slate-200 hover:border-[#7ab530] transition-all duration-300 cursor-pointer overflow-hidden"
                              onClick={() => openOrderModal(order)}
                            >
                              <div className="p-5">
                                <div className="flex items-start justify-between gap-4">
                                  {/* Left Section */}
                                  <div className="flex items-start gap-4 flex-1 min-w-0">
                                    <div className="w-12 h-12 bg-[#7ab530] rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                                      <Package className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-semibold text-slate-900 text-base mb-1.5">
                                        Order #{order._id.slice(-8).toUpperCase()}
                                      </h3>
                                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                          <Clock className="w-3.5 h-3.5" />
                                          {formatDate(order.orderDate)}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          <CheckCircle className="w-3.5 h-3.5 text-[#7ab530]" />
                                          <span className="capitalize font-medium text-slate-600">{order.paymentStatus}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Right Section */}
                                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                    <p className="text-xl font-semibold text-[#7ab530]">
                                      {order.totalAmount.toFixed(2)} TND
                                    </p>
                                    <p className="text-xs text-slate-500">{order.items.length} item(s)</p>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openOrderModal(order);
                                      }}
                                      className="mt-1 flex items-center gap-1.5 text-black hover:text-black font-medium text-xs transition-colors group/btn"
                                    >
                                      <Scroll className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                                      View Details
                                    </button>
                                  </div>
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
            )
          }

          {/* Meal Plans Section - Hidden for admins */}
          {
            !isAdmin && (
              <div className="bg-white rounded-2xl shadow-xl border-2 border-[#7ab530] mb-6 overflow-hidden mt-8" style={{ borderImage: 'linear-gradient(135deg, #7ab530, #6aa02b, #8bc34a) 1' }}>
                <button
                  onClick={() => toggleSection("mealPlans")}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#7ab530] rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-xl font-semibold text-slate-900">Meal Plans</h2>
                      <p className="text-sm text-slate-500">Create and manage your personalized meal plans</p>
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
                          <Loader2 className="w-12 h-12 text-slate-400 animate-spin mx-auto mb-4" />
                          <p className="text-slate-600">Loading your meal plans...</p>
                        </div>
                      ) : mealPlans.length === 0 ? (
                        <div className="text-center py-16">
                          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
                            <Calendar className="w-10 h-10 text-slate-400" />
                          </div>
                          <p className="text-slate-900 font-semibold text-lg mb-2">No meal plans yet</p>
                          <p className="text-sm text-slate-500 mb-6">Create a personalized meal plan to get started on your health journey</p>
                          <a
                            href="/MealPlans"
                            className="inline-block px-8 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all shadow-sm hover:shadow-md"
                          >
                            Create Meal Plan
                          </a>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {mealPlans.map((plan) => (
                            <div
                              key={plan._id}
                              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-all p-6"
                            >
                              {/* Header with Icon */}
                              <div className="flex items-start gap-4 mb-6">
                                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-slate-200">
                                  <Utensils className="w-7 h-7 text-slate-600" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-xl font-semibold text-slate-900 mb-1">Meal Plan</h3>
                                  <p className="text-sm text-slate-500 flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
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
                                <div className="bg-slate-50 rounded-xl p-4 border-2 border-[#7ab530]">
                                  <p className="text-xs text-[#7ab530] mb-1.5 font-medium uppercase tracking-wide">Daily Calories</p>
                                  <p className="text-2xl font-semibold text-slate-900">
                                    {plan.calculatedStats?.tdee || 0}
                                  </p>
                                  <p className="text-xs text-slate-400 mt-1">kcal</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4 border-2 border-[#7ab530]">
                                  <p className="text-xs text-[#7ab530] mb-1.5 font-medium uppercase tracking-wide">Protein</p>
                                  <p className="text-2xl font-semibold text-slate-900">
                                    {plan.calculatedStats?.macros?.protein || 0}g
                                  </p>
                                  <p className="text-xs text-slate-400 mt-1">per day</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4 border-2 border-[#7ab530]">
                                  <p className="text-xs text-[#7ab530] mb-1.5 font-medium uppercase tracking-wide">Carbs</p>
                                  <p className="text-2xl font-semibold text-slate-900">
                                    {plan.calculatedStats?.macros?.carbs || 0}g
                                  </p>
                                  <p className="text-xs text-slate-400 mt-1">per day</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4 border-2 border-[#7ab530]">
                                  <p className="text-xs text-[#7ab530] mb-1.5 font-medium uppercase tracking-wide">Fats</p>
                                  <p className="text-2xl font-semibold text-slate-900">
                                    {plan.calculatedStats?.macros?.fats || 0}g
                                  </p>
                                  <p className="text-xs text-slate-400 mt-1">per day</p>
                                </div>
                              </div>

                              {/* Tags */}
                              <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-medium text-xs flex items-center gap-1.5 border border-slate-200">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {plan.mealPlan?.length || 0} days
                                </span>


                              </div>

                              {/* View Meals Button */}
                              <button
                                onClick={() => setExpandedMealPlans(prev => ({
                                  ...prev,
                                  [plan._id]: !prev[plan._id]
                                }))}
                                className="w-full mt-4 px-6 py-3 bg-slate-900 hover:bg-[#7ab530] text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                              >
                                {expandedMealPlans[plan._id] ? (
                                  <>
                                    <ChevronUp className="w-4 h-4" />
                                    Hide Meal Details
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="w-4 h-4" />
                                    View Meal Details
                                  </>
                                )}
                              </button>

                              {/* Expandable Meal Details */}
                              {expandedMealPlans[plan._id] && plan.mealPlan && (
                                <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
                                  <h4 className="font-semibold text-slate-900 text-base mb-3 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-[#7ab530] rounded-full"></span>
                                    Daily Meal Plan
                                  </h4>
                                  {plan.mealPlan.map((dayPlan) => (
                                    <div key={dayPlan.day} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                      <p className="font-semibold text-slate-700 mb-3 text-sm flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#7ab530] rounded-full"></span>
                                        Day {dayPlan.day}
                                      </p>
                                      <div className="space-y-2">
                                        {/* Breakfast */}
                                        {dayPlan.breakfast && (
                                          <div className="bg-white rounded-lg p-3 border-l-4 border-[#7ab530]">
                                            <p className="font-medium text-[#7ab530] mb-1 text-xs uppercase tracking-wide">BREAKFAST</p>
                                            <p className="font-semibold text-slate-900 mb-2 text-sm">{dayPlan.breakfast.mealName}</p>
                                            <div className="grid grid-cols-4 gap-2 text-xs">
                                              <div>
                                                <p className="text-slate-500">Calories</p>
                                                <p className="font-medium text-slate-900">{dayPlan.breakfast.calories}</p>
                                              </div>
                                              <div>
                                                <p className="text-slate-500">Protein</p>
                                                <p className="font-medium text-slate-900">{dayPlan.breakfast.protein}g</p>
                                              </div>
                                              <div>
                                                <p className="text-slate-500">Carbs</p>
                                                <p className="font-medium text-slate-900">{dayPlan.breakfast.carbs}g</p>
                                              </div>
                                              <div>
                                                <p className="text-slate-500">Fats</p>
                                                <p className="font-medium text-slate-900">{dayPlan.breakfast.fats}g</p>
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                        {/* Lunch */}
                                        {dayPlan.lunch && (
                                          <div className="bg-white rounded-lg p-3 border-l-4 border-[#7ab530]">
                                            <p className="font-medium text-[#7ab530] mb-1 text-xs uppercase tracking-wide">LUNCH</p>
                                            <p className="font-semibold text-slate-900 mb-2 text-sm">{dayPlan.lunch.mealName}</p>
                                            <div className="grid grid-cols-4 gap-2 text-xs">
                                              <div>
                                                <p className="text-slate-500">Calories</p>
                                                <p className="font-medium text-slate-900">{dayPlan.lunch.calories}</p>
                                              </div>
                                              <div>
                                                <p className="text-slate-500">Protein</p>
                                                <p className="font-medium text-slate-900">{dayPlan.lunch.protein}g</p>
                                              </div>
                                              <div>
                                                <p className="text-slate-500">Carbs</p>
                                                <p className="font-medium text-slate-900">{dayPlan.lunch.carbs}g</p>
                                              </div>
                                              <div>
                                                <p className="text-slate-500">Fats</p>
                                                <p className="font-medium text-slate-900">{dayPlan.lunch.fats}g</p>
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                        {/* Dinner */}
                                        {dayPlan.dinner && (
                                          <div className="bg-white rounded-lg p-3 border-l-4 border-[#7ab530]">
                                            <p className="font-medium text-[#7ab530] mb-1 text-xs uppercase tracking-wide">DINNER</p>
                                            <p className="font-semibold text-slate-900 mb-2 text-sm">{dayPlan.dinner.mealName}</p>
                                            <div className="grid grid-cols-4 gap-2 text-xs">
                                              <div>
                                                <p className="text-slate-500">Calories</p>
                                                <p className="font-medium text-slate-900">{dayPlan.dinner.calories}</p>
                                              </div>
                                              <div>
                                                <p className="text-slate-500">Protein</p>
                                                <p className="font-medium text-slate-900">{dayPlan.dinner.protein}g</p>
                                              </div>
                                              <div>
                                                <p className="text-slate-500">Carbs</p>
                                                <p className="font-medium text-slate-900">{dayPlan.dinner.carbs}g</p>
                                              </div>
                                              <div>
                                                <p className="text-slate-500">Fats</p>
                                                <p className="font-medium text-slate-900">{dayPlan.dinner.fats}g</p>
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
            )
          }

          {/* Activity Logs Section - Only for admins */}
          {
            isAdmin && (
              <div id="activity-logs" className="bg-white rounded-3xl shadow-xl border-2  mb-6 overflow-hidden mt-8 animate-fade-in-more-delayed" >
                <button
                  onClick={() => toggleSection("activityLogs")}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#7ab530] to-[#6aa02b] rounded-xl flex items-center justify-center shadow-lg">
                      <Activity className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-2xl font-bold text-gray-900">Activity Timeline</h2>
                      <p className="text-sm text-gray-600">
                        {activityLogs.length > 0 ? `${activityLogs.length} recent activities` : "No activities yet"}
                      </p>
                    </div>
                  </div>
                  {expandedSections.activityLogs ? (
                    <ChevronUp className="w-6 h-6 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
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
                        <div className="text-center py-16 animate-fade-in">
                          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Activity className="w-10 h-10 text-gray-400" />
                          </div>
                          <p className="text-gray-900 font-semibold text-lg mb-2">No activity logs yet</p>
                          <p className="text-sm text-gray-600">Your activities will appear here</p>
                        </div>
                      ) : (
                        <div className="relative">
                          {/* Timeline line */}
                          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#7ab530] via-[#6aa02b] to-[#8bc34a]"></div>

                          <div className="space-y-4">
                            {(showAllActivities ? activityLogs : activityLogs.slice(0, 3)).map((log, index) => (
                              <div
                                key={log._id}
                                className="relative pl-16 animate-slide-in"
                                style={{ animationDelay: `${index * 50}ms` }}
                              >
                                {/* Status dot with pulse animation */}
                                <div className="absolute left-4 top-4">
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-pulse-subtle ${log.action === 'product_upload' ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
                                    log.action === 'login' ? 'bg-[#7ab530]' :
                                      log.action === 'logout' ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                                        log.action === 'profile_update' ? 'bg-gradient-to-br from-purple-400 to-purple-600' :
                                          'bg-gradient-to-br from-indigo-400 to-indigo-600'
                                    }`}>
                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                  </div>
                                </div>

                                {/* Activity card with glassmorphism */}
                                <div className="group bg-white rounded-xl p-5 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-gray-200 shadow-sm">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-2">
                                        <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${log.action === 'product_upload' ? 'bg-green-100 text-green-700 border border-green-200' :
                                          log.action === 'login' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                            log.action === 'logout' ? 'bg-gray-100 text-gray-700 border border-gray-200' :
                                              log.action === 'profile_update' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                                                'bg-indigo-100 text-indigo-700 border border-indigo-200'
                                          }`}>
                                          {log.action.replace('_', ' ')}
                                        </span>
                                        <span className="text-xs text-gray-400">•</span>
                                        <span className="text-xs text-gray-500 font-medium">
                                          {new Date(log.createdAt).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </span>
                                      </div>
                                      <p className="text-gray-900 font-medium text-base mb-1">
                                        {log.description}
                                      </p>
                                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                          <div className="flex flex-wrap gap-2">
                                            {log.metadata.fileName && (
                                              <span className="text-xs px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full border border-blue-200">
                                                📄 {log.metadata.fileName}
                                              </span>
                                            )}
                                            {log.metadata.importedCount !== undefined && (
                                              <span className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-full border border-green-200">
                                                ✅ {log.metadata.importedCount} imported
                                              </span>
                                            )}
                                            {log.metadata.errorCount > 0 && (
                                              <span className="text-xs px-3 py-1.5 bg-red-100 text-red-700 rounded-full border border-red-200">
                                                ⚠️ {log.metadata.errorCount} errors
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Show More / Show Less Button */}
                          {activityLogs.length > 3 && (
                            <div className="mt-6 flex justify-center">
                              <button
                                onClick={() => setShowAllActivities(!showAllActivities)}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7ab530] to-[#6aa02b] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                              >
                                {showAllActivities ? (
                                  <>
                                    Show Less
                                    <ChevronUp className="w-5 h-5" />
                                  </>
                                ) : (
                                  <>
                                    Show More ({activityLogs.length - 3} more)
                                    <ChevronDown className="w-5 h-5" />
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          }
        </div >

        {/* Order Detail Modal */}
        {
          showOrderModal && selectedOrder && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeOrderModal}>
              <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#7ab530] rounded-lg flex items-center justify-center shadow-sm">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">
                        Order #{selectedOrder._id.slice(-8).toUpperCase()}
                      </h2>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {formatDate(selectedOrder.orderDate)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeOrderModal}
                    className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-5">
                    {/* Order Summary */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <CheckCircle className="w-5 h-5 text-[#7ab530]" />
                          <span className="font-medium text-slate-900 capitalize">{selectedOrder.paymentStatus}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-semibold text-black">
                            {selectedOrder.totalAmount.toFixed(2)} TND
                          </p>
                          <p className="text-xs text-slate-500 mt-1">{selectedOrder.items.length} item(s)</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-600" />
                        Order Items
                      </h3>
                      <div className="space-y-3">
                        {selectedOrder.items.map((item, idx) => (
                          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 hover:border-[#7ab530] transition-colors">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-slate-900 text-base mb-2.5">
                                  {item.mealData?.mealName || "Unknown Meal"}
                                </h4>
                                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600">
                                  <span className="capitalize">{item.mealData?.mealType}</span>
                                  <span className="text-slate-400">•</span>
                                  <span>Qty: {item.quantity}</span>
                                  <span className="text-slate-400">•</span>
                                  <span>{item.price.toFixed(2)} TND each</span>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-lg font-semibold text-[#7ab530]">
                                  {(item.price * item.quantity).toFixed(2)} TND
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
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
                <div className="p-6 border-t border-slate-200">
                  <button
                    onClick={closeOrderModal}
                    className="w-full bg-slate-900 hover:bg-[#7ab530] text-white py-3 rounded-xl font-medium transition-colors shadow-sm hover:shadow-md"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )
        }

        <Footer />
      </div >
    </main >
  );
}


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  Calendar,
  User,
  Clock,
  ChevronDown,
  ChevronUp,

} from "lucide-react";

export default function AdminMealPlans() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mealPlans, setMealPlans] = useState([]);
  const [loadingMealPlans, setLoadingMealPlans] = useState(true);
  const [expandedPlans, setExpandedPlans] = useState({});

  const togglePlan = (planId) => {
    setExpandedPlans(prev => ({
      ...prev,
      [planId]: !prev[planId]
    }));
  };

  const isAdmin = typeof window !== "undefined" && user && process.env.NEXT_PUBLIC_ADMIN_EMAIL
    ? user.email?.toLowerCase()?.trim() === process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase()?.trim()
    : false;

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/Signin");
      return;
    }
    if (!isAdmin) {
      router.push("/Dashboard");
      return;
    }
  }, [user, loading, router, isAdmin]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchMealPlans();
    }
  }, [user, isAdmin]);

  const fetchMealPlans = async () => {
    try {
      setLoadingMealPlans(true);
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        setLoadingMealPlans(false);
        return;
      }

      const response = await fetch("/api/meal-plans", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setMealPlans(data.mealPlans);
      } else {
        console.error("Failed to fetch meal plans:", data.error);
      }
    } catch (error) {
      console.error("Error fetching meal plans:", error);
    } finally {
      setLoadingMealPlans(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col lg:ml-0">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={user}
          title="Meal Plans Generated"
        />

        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Generated Meal Plans</h1>
              <p className="text-gray-600">View and manage all meal plans created by users</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 text-[#7ab530]shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-8 h-8" />
                  <h3 className="text-sm font-medium opacity-90">Total Plans</h3>
                </div>
                <p className="text-4xl  text-[#7ab530] font-bold">{mealPlans.length}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-8 h-8 text-black-600" />
                  <h3 className="text-sm  font-medium text-gray-600">Active Users</h3>
                </div>
                <p className="text-4xl  text-[#7ab530] font-bold ">
                  {new Set(mealPlans.map(p => p.userId?._id)).size}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-8 h-8 text-black-600" />
                  <h3 className="text-sm font-medium text-gray-600">Latest Plan</h3>
                </div>
                <p className="text-lg font-semibold text-[#7ab530]">
                  {mealPlans.length > 0 ? formatDate(mealPlans[0]?.createdAt) : "N/A"}
                </p>
              </div>
            </div>

            {/* Meal Plans List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              {loadingMealPlans ? (
                <div className="text-center py-16">
                  <div className="w-12 h-12 border-4 border-[#7ab530] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading meal plans...</p>
                </div>
              ) : mealPlans.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No meal plans yet</h3>
                  <p className="text-gray-600">
                    Meal plans generated by users will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mealPlans.map((plan, index) => (
                    <div
                      key={plan._id}
                      className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-100 hover:border-[#7ab530] hover:shadow-lg transition-all duration-300"
                    >
                      {/* Plan Number Badge */}
                      <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-[#7ab530] to-[#6aa02a] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {index + 1}
                      </div>

                      <div className="space-y-4">
                        {/* Compact Header: Title + User Info */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-xl flex-shrink-0">
                              <Calendar className="w-5 h-5 text-[#7ab530]" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-xl font-bold text-gray-900">
                                  {plan.mealPlan?.length || 0} Day Meal Plan
                                </h3>
                                <span className="text-gray-400 font-medium hidden sm:inline">•</span>
                                <div className="flex items-center gap-2 text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">
                                  <User className="w-3.5 h-3.5" />
                                  <span className="font-medium">{plan.userId?.name || "Unknown User"}</span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                Created {formatDate(plan.createdAt)} • {plan.userProfile?.gender || "N/A"}, {plan.calculatedStats?.age || "N/A"} years
                              </p>
                            </div>
                          </div>

                          {/* Toggle Button */}
                          <div className="flex-shrink-0">
                            <button
                              onClick={() => togglePlan(plan._id)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${expandedPlans[plan._id]
                                ? "bg-green-50 text-[#7ab530]"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                              {expandedPlans[plan._id] ? (
                                <>
                                  Hide Details
                                  <ChevronUp className="w-4 h-4" />
                                </>
                              ) : (
                                <>
                                  View Details
                                  <ChevronDown className="w-4 h-4" />
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Collapsible Content */}
                        {expandedPlans[plan._id] && (
                          <div className="mt-6 pt-6 border-t border-gray-100 animate-slide-in">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                              <div className="bg-white  rounded-xl p-4 border border-blue-200">
                                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">TDEE</p>
                                <p className="text-2xl font-bold text-blue-900">
                                  {plan.calculatedStats?.tdee || 0}
                                </p>
                                <p className="text-xs text-blue-600 mt-1">kcal/day</p>
                              </div>

                              <div className="bg-white rounded-xl p-4 border border-green-200">
                                <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Protein</p>
                                <p className="text-2xl font-bold text-green-900">
                                  {plan.calculatedStats?.macros?.protein || 0}
                                </p>
                                <p className="text-xs text-green-600 mt-1">grams</p>
                              </div>

                              <div className="bg-white rounded-xl p-4 border border-orange-200">
                                <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-1">Carbs</p>
                                <p className="text-2xl font-bold text-orange-900">
                                  {plan.calculatedStats?.macros?.carbs || 0}
                                </p>
                                <p className="text-xs text-orange-600 mt-1">grams</p>
                              </div>

                              <div className="bg-white rounded-xl p-4 border border-purple-200">
                                <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">Fats</p>
                                <p className="text-2xl font-bold text-purple-900">
                                  {plan.calculatedStats?.macros?.fats || 0}
                                </p>
                                <p className="text-xs text-purple-600 mt-1">grams</p>
                              </div>
                            </div>

                            {/* Physical Stats */}
                            <div className="flex items-center gap-6 text-sm mb-6 pb-6 border-b border-gray-100">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">Weight:</span>
                                <span className="font-semibold text-gray-900">{plan.userProfile?.weight || "N/A"} kg</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">Height:</span>
                                <span className="font-semibold text-gray-900">{plan.userProfile?.height || "N/A"} cm</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">Activity:</span>
                                <span className="font-semibold text-gray-900 capitalize">
                                  {plan.userProfile?.trainingActivity?.replace("-", " ") || "N/A"}
                                </span>
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
          </div>
        </main>
      </div>
    </div>
  );
}

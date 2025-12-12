"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Header from "../../Header";
import Footer from "../../Footer";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Utensils,
  CheckCircle,
  Send,
  Loader2,
  Sparkles,
  Brain,
  X,
  ExternalLink,
  Tag,
  Save,
  Bookmark
} from "lucide-react";
import Link from "next/link";

export default function MealPlansResult() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [error, setError] = useState(null);
  const [mealDetails, setMealDetails] = useState({}); // Store fetched meal details by name
  const [loadingMeals, setLoadingMeals] = useState(false);

  // Save meal plan state
  const [savingMealPlan, setSavingMealPlan] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Fetch meal details from database by name
  const fetchMealDetails = async (mealPlan) => {
    if (!mealPlan || !Array.isArray(mealPlan)) return;

    setLoadingMeals(true);
    const mealNames = new Set();

    // Collect all meal names from the meal plan
    mealPlan.forEach(day => {
      if (day.breakfast?.mealName) mealNames.add(day.breakfast.mealName);
      if (day.lunch?.mealName) mealNames.add(day.lunch.mealName);
      if (day.dinner?.mealName) mealNames.add(day.dinner.mealName);
    });

    // Fetch each meal from database
    const details = {};
    const fetchPromises = Array.from(mealNames).map(async (mealName) => {
      try {
        const res = await fetch(`/Api/meals?search=${encodeURIComponent(mealName)}`);
        const data = await res.json();
        if (data.success && data.meals && data.meals.length > 0) {
          // Find the best match (exact or closest match)
          const exactMatch = data.meals.find(m =>
            m.mealName.toLowerCase() === mealName.toLowerCase()
          );
          details[mealName] = exactMatch || data.meals[0];
        }
      } catch (error) {
        console.error(`Error fetching meal ${mealName}:`, error);
      }
    });

    await Promise.all(fetchPromises);
    setMealDetails(details);
    setLoadingMeals(false);
  };

  useEffect(() => {
    // Load form data and AI response from storage
    const saved = localStorage.getItem("mealPlanFormData");
    const savedAiResponse = sessionStorage.getItem("mealPlanAiResponse");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
      } catch (e) {
        console.error("Error loading form data:", e);
      }
    }

    if (savedAiResponse) {
      try {
        const parsed = JSON.parse(savedAiResponse);
        setAiResponse(parsed);

        // Also fetch meal details if we have a meal plan
        if (parsed.mealPlan) {
          fetchMealDetails(parsed.mealPlan);
        }
      } catch (e) {
        console.error("Error loading AI response:", e);
      }
    }
  }, []);

  const handleBack = () => {
    router.push("/MealPlans");
  };

  // Calculate Age, BMR, TDEE, and Macros
  const calculateStats = () => {
    if (!formData || !formData.weight || !formData.height || !formData.birthDate || !formData.gender) return null;

    const today = new Date();
    const birthDate = new Date(formData.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const gender = formData.gender.toLowerCase();

    // Validate numbers
    if (isNaN(weight) || isNaN(height) || isNaN(age)) return null;

    // Mifflin-St Jeor Equation
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    if (gender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    // Activity Multiplier
    let activityMultiplier = 1.2; // Sedentary default
    switch (formData.trainingActivity) {
      case 'sedentary': activityMultiplier = 1.2; break;
      case 'light': activityMultiplier = 1.375; break;
      case 'moderate': activityMultiplier = 1.55; break;
      case 'active': activityMultiplier = 1.725; break;
      case 'very-active': activityMultiplier = 1.9; break;
      default: activityMultiplier = 1.2;
    }

    const tdee = Math.round(bmr * activityMultiplier);

    // Macro Split (40% Carbs, 30% Protein, 30% Fat) - Standard balanced
    const macros = {
      protein: Math.round((tdee * 0.3) / 4),
      carbs: Math.round((tdee * 0.4) / 4),
      fats: Math.round((tdee * 0.3) / 9)
    };

    return { age, bmr: Math.round(bmr), tdee, macros };
  };

  const sendToWebhook = async () => {
    const stats = calculateStats();
    if (!formData || !stats) return;

    setIsLoading(true);
    setAiResponse(null);
    setError(null);

    try {
      const payload = {
        userProfile: formData,
        calculatedStats: stats
      };

      const res = await fetch('https://chahd.app.n8n.cloud/webhook/recommander', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      let responseData;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        responseData = await res.json();
      } else {
        responseData = await res.text();
      }

      // Handle n8n response format (array with output property)
      if (Array.isArray(responseData) && responseData[0]?.output) {
        try {
          responseData = JSON.parse(responseData[0].output);
        } catch (e) {
          console.error("Error parsing output:", e);
        }
      }

      setAiResponse(responseData);

      // Save AI response to sessionStorage so it persists during navigation
      sessionStorage.setItem("mealPlanAiResponse", JSON.stringify(responseData));

      // Fetch meal details from database
      if (responseData.mealPlan) {
        fetchMealDetails(responseData.mealPlan);
      }
    } catch (error) {
      console.error('Error sending data to webhook:', error);
      setError("Failed to get AI recommendations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Save meal plan to database
  const saveMealPlan = async () => {
    if (!user) {
      router.push("/Signin");
      return;
    }

    const stats = calculateStats();
    if (!formData || !stats || !aiResponse) {
      setSaveError("Please generate a meal plan first");
      return;
    }

    setSavingMealPlan(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/Signin");
        return;
      }

      const parsedResponse = parseAIResponse(aiResponse);
      const mealPlan = parsedResponse.mealPlan || parsedResponse.meals || [];
      const dailyTargets = parsedResponse.dailyTargets || parsedResponse.totalsPerDay;

      const payload = {
        userProfile: formData,
        calculatedStats: stats,
        mealPlan: mealPlan,
        dailyTargets: dailyTargets,
        aiResponse: aiResponse,
      };

      const res = await fetch("/Api/meal-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 5000);
      } else {
        setSaveError(data.error || "Failed to save meal plan");
      }
    } catch (error) {
      console.error("Error saving meal plan:", error);
      setSaveError("Failed to save meal plan. Please try again.");
    } finally {
      setSavingMealPlan(false);
    }
  };

  if (!formData) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#e9fce2] via-[#f7fff3] to-[#d9f8cc]">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <p className="text-gray-600">Loading meal plan...</p>
        </div>
        <Footer />
      </main>
    );
  }

  const stats = calculateStats();
  const bmiValue = formData.weight && formData.height
    ? parseFloat(formData.weight) / Math.pow(parseFloat(formData.height) / 100, 2)
    : null;
  const bmi = bmiValue ? bmiValue.toFixed(1) : null;

  // Parse AI response for visualization
  const parseAIResponse = (response) => {
    if (!response) return null;

    // If it's a string, try to parse as JSON
    if (typeof response === 'string') {
      try {
        return JSON.parse(response);
      } catch {
        // If not JSON, return as text
        return { type: 'text', content: response };
      }
    }

    // If it's already an object
    if (typeof response === 'object') {
      return response;
    }

    return { type: 'unknown', content: response };
  };

  const parsedResponse = parseAIResponse(aiResponse);

  // Render a single meal card
  const renderMealCard = (meal, mealType) => {
    const mealDetail = mealDetails[meal.mealName];
    const hasDetails = !!mealDetail;
    const mealLink = hasDetails && mealDetail._id ? `/Products/${mealDetail._id}?from=mealplan` : null;

    return (
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border-2 border-gray-200 hover:border-[#7ab530] transition-all duration-300 shadow-sm hover:shadow-md">
        <div className="flex gap-4">
          {/* Meal Image */}
          <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 border-gray-200 bg-white">
            {hasDetails ? (
              mealLink ? (
                <Link href={mealLink} className="block w-full h-full relative cursor-pointer">
                  <Image
                    src={mealDetail.image || `/${mealDetail.mealName}.jpg`}
                    alt={meal.mealName}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                      // Show fallback icon if image fails
                      const icon = document.createElement('div');
                      icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-gray-300"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>';
                      e.target.parentElement.appendChild(icon.firstChild);
                    }}
                  />
                </Link>
              ) : (
                <Image
                  src={mealDetail.image || `/${mealDetail.mealName}.jpg`}
                  alt={meal.mealName}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                    // Show fallback icon
                    e.target.parentElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-gray-300"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>';
                  }}
                />
              )
            ) : (
              <Link href={mealLink || '#'} className={`w-full h-full flex items-center justify-center text-gray-300 ${!mealLink && 'cursor-default'}`}>
                <Utensils className="w-8 h-8" />
              </Link>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Meal Type Badge */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${mealType === 'Breakfast' ? 'bg-orange-100 text-orange-700' :
                  mealType === 'Lunch' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                  {mealType}
                </div>
              </div>
              <span className="text-sm font-bold text-[#7ab530] bg-green-50 px-2 py-1 rounded-lg">
                {meal.calories} kcal
              </span>
            </div>

            {/* Meal Name */}
            <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
              {mealLink ? (
                <Link href={mealLink} className="hover:text-[#7ab530] transition-colors">
                  {meal.mealName}
                </Link>
              ) : (
                meal.mealName
              )}
            </h4>

            {/* Description from database */}
            {hasDetails && mealDetail.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {mealDetail.description}
              </p>
            )}

            {/* Tags */}
            {meal.tags && meal.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {meal.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Macros */}
            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <span className="text-xs text-gray-500">Protein</span>
                </div>
                <p className="text-sm font-bold text-gray-900">{meal.protein || 0}g</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <span className="text-xs text-gray-500">Carbs</span>
                </div>
                <p className="text-sm font-bold text-gray-900">{meal.carbs || 0}g</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span className="text-xs text-gray-500">Fats</span>
                </div>
                <p className="text-sm font-bold text-gray-900">{meal.fats || 0}g</p>
              </div>
              {meal.fiber && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-xs text-gray-500">Fiber</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{meal.fiber}g</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render AI response visualization
  const renderAIResponse = () => {
    if (!parsedResponse) return null;

    // Handle structured meal plan response
    if (parsedResponse.mealPlan || parsedResponse.meals || parsedResponse.days) {
      const mealPlan = parsedResponse.mealPlan || parsedResponse.meals || [];
      const dailyTargets = parsedResponse.dailyTargets || parsedResponse.totalsPerDay;

      return (
        <div className="space-y-8">
          {/* Daily Targets Summary */}
          {dailyTargets && (
            <div className="bg-gradient-to-r from-[#7ab530] to-[#6aa02a] rounded-3xl shadow-xl p-6 md:p-8 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Daily Nutritional Targets
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-sm opacity-90 mb-1">Calories</p>
                  <p className="text-2xl font-bold">{dailyTargets.calories || 0}</p>
                </div>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-sm opacity-90 mb-1">Protein</p>
                  <p className="text-2xl font-bold">{dailyTargets.protein || 0}g</p>
                </div>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-sm opacity-90 mb-1">Carbs</p>
                  <p className="text-2xl font-bold">{dailyTargets.carbs || 0}g</p>
                </div>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-sm opacity-90 mb-1">Fats</p>
                  <p className="text-2xl font-bold">{dailyTargets.fats || 0}g</p>
                </div>
              </div>
            </div>
          )}

          {/* Meal Plan Days */}
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Brain className="w-6 h-6 text-[#7ab530]" />
              <h2 className="text-2xl font-bold text-gray-900">AI-Generated Meal Plan</h2>
              {loadingMeals && (
                <Loader2 className="w-4 h-4 text-gray-400 animate-spin ml-2" />
              )}
            </div>

            <div className="space-y-8">
              {Array.isArray(mealPlan) && mealPlan.length > 0 ? (
                mealPlan.map((day, dayIndex) => {
                  const dayNumber = day.day || dayIndex + 1;
                  const breakfast = day.breakfast;
                  const lunch = day.lunch;
                  const dinner = day.dinner;

                  const dayTotalCals = (breakfast?.calories || 0) +
                    (lunch?.calories || 0) +
                    (dinner?.calories || 0);

                  return (
                    <div key={dayIndex} className="border-2 border-gray-200 rounded-3xl p-6 md:p-8 bg-gradient-to-br from-white to-gray-50">
                      <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200">
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#7ab530] flex items-center justify-center text-white font-bold">
                            {dayNumber}
                          </div>
                          Day {dayNumber}
                        </h3>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Total Calories</p>
                          <p className="text-xl font-bold text-[#7ab530]">{dayTotalCals} kcal</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {breakfast && renderMealCard(breakfast, 'Breakfast')}
                        {lunch && renderMealCard(lunch, 'Lunch')}
                        {dinner && renderMealCard(dinner, 'Dinner')}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Utensils className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>No meal plan data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Handle text/markdown response
    if (parsedResponse.type === 'text' || parsedResponse.content) {
      const content = parsedResponse.content || parsedResponse;
      return (
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-6 h-6 text-[#7ab530]" />
            <h2 className="text-2xl font-bold text-gray-900">AI Recommendations</h2>
          </div>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-gray-700 font-sans text-sm leading-relaxed">
              {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
            </pre>
          </div>
        </div>
      );
    }

    // Handle any other structured response
    return (
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Brain className="w-6 h-6 text-[#7ab530]" />
          <h2 className="text-2xl font-bold text-gray-900">AI Response</h2>
        </div>
        <div className="prose max-w-none">
          <pre className="whitespace-pre-wrap text-gray-700 font-sans text-sm leading-relaxed bg-gray-50 p-4 rounded-xl overflow-auto">
            {JSON.stringify(parsedResponse, null, 2)}
          </pre>
        </div>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#e9fce2] via-[#f7fff3] to-[#d9f8cc]">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#7ab530] mb-6 animate-pulse">
              <Brain className="w-10 h-10 text-white animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Generating Your AI Meal Plan</h2>
            <p className="text-gray-600 text-lg mb-8">Our AI is analyzing your profile and creating personalized recommendations...</p>
            <div className="flex justify-center">
              <Loader2 className="w-8 h-8 text-[#7ab530] animate-spin" />
            </div>
            <div className="mt-8 space-y-2">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden max-w-md mx-auto">
                <div className="h-full bg-[#7ab530] rounded-full animate-loading"></div>
              </div>
              <p className="text-sm text-gray-500">This may take a few moments</p>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#e9fce2] via-[#f7fff3] to-[#d9f8cc]">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#7ab530] mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="text-gray-900">Your Meal Plan</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Based on your needs: {stats ? `${stats.tdee} kcal/day` : ''}
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Nutritional Profile</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Personal Info</p>
              <div className="flex flex-col items-center justify-center">
                <p className="text-lg font-bold text-gray-900 capitalize">{formData.gender}, {stats?.age}</p>
                <p className="text-xs text-gray-500 capitalize">{formData.trainingActivity}</p>
              </div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Weight</p>
              <p className="text-2xl font-bold text-gray-900">{formData.weight} <span className="text-sm font-normal text-gray-500">kg</span></p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Height</p>
              <p className="text-2xl font-bold text-gray-900">{formData.height} <span className="text-sm font-normal text-gray-500">cm</span></p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">BMI</p>
              <p className="text-2xl font-bold text-purple-600">{bmi || '-'}</p>
              <p className="text-xs text-gray-500">
                {bmiValue ? (bmiValue < 18.5 ? 'Underweight' : bmiValue < 25 ? 'Normal' : bmiValue < 30 ? 'Overweight' : 'Obese') : '-'}
              </p>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">BMR</p>
              <p className="text-2xl font-bold text-blue-600">{stats?.bmr || '-'}</p>
              <p className="text-xs text-gray-500">Basal Rate</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Daily Target</p>
              <p className="text-2xl font-bold text-[#7ab530]">{stats?.tdee || '-'}</p>
              <p className="text-xs text-gray-500">Maintenance Calories</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 md:gap-4 border-t border-gray-100 pt-6">
            <div className="text-center">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Protein</p>
              <p className="text-xl font-bold text-gray-900">{stats?.macros.protein}g</p>
            </div>
            <div className="text-center border-l border-r border-gray-100">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Carbs</p>
              <p className="text-xl font-bold text-gray-900">{stats?.macros.carbs}g</p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Fats</p>
              <p className="text-xl font-bold text-gray-900">{stats?.macros.fats}g</p>
            </div>
          </div>
        </div>

        {/* AI Response Visualization */}
        {aiResponse && renderAIResponse()}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-3xl shadow-xl p-6 md:p-8 mb-8">
            <div className="flex items-start gap-3">
              <X className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-red-900 mb-2">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Save Success Message */}
        {saveSuccess && (
          <div className="bg-green-50 border-2 border-green-200 rounded-3xl shadow-xl p-6 md:p-8 mb-8">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-green-900 mb-2">Meal Plan Saved!</h3>
                <p className="text-green-700">Your meal plan has been saved successfully. You can view it in your profile.</p>
              </div>
            </div>
          </div>
        )}

        {/* Save Error Message */}
        {saveError && (
          <div className="bg-red-50 border-2 border-red-200 rounded-3xl shadow-xl p-6 md:p-8 mb-8">
            <div className="flex items-start gap-3">
              <X className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-red-900 mb-2">Error Saving Meal Plan</h3>
                <p className="text-red-700">{saveError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Prompt to get AI recommendations if not loaded yet */}
        {!aiResponse && !isLoading && (
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8 text-center">
            <Brain className="w-16 h-16 text-[#7ab530] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Get AI-Powered Recommendations</h2>
            <p className="text-gray-600 mb-6">
              Click the button below to receive personalized meal plan recommendations powered by AI
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-3 md:gap-4">
          <button
            onClick={handleBack}
            className="group relative px-6 py-3.5 rounded-xl font-medium text-[15px] tracking-wide transition-all duration-300 flex items-center justify-center gap-2.5 bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm active:scale-[0.98] font-poppins"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600 transition-transform duration-300 group-hover:-translate-x-0.5" />
            <span>Create New Plan</span>
          </button>

          <button
            onClick={sendToWebhook}
            disabled={isLoading || !stats}
            className={`group relative px-6 py-3.5 rounded-xl font-medium text-[15px] tracking-wide transition-all duration-300 flex items-center justify-center gap-2.5 text-white shadow-sm hover:shadow-md active:scale-[0.98] font-poppins ${
              isLoading || !stats
                ? "bg-slate-300 cursor-not-allowed shadow-none"
                : "bg-slate-700 hover:bg-slate-800"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                <span>Get AI Recommendations</span>
              </>
            )}
          </button>

          {/* Save Meal Plan Button - Only show if AI response exists */}
          {aiResponse && (
            <button
              onClick={saveMealPlan}
              disabled={savingMealPlan || saveSuccess}
              className={`group relative px-6 py-3.5 rounded-xl font-medium text-[15px] tracking-wide transition-all duration-300 flex items-center justify-center gap-2.5 text-white shadow-sm hover:shadow-md active:scale-[0.98] font-poppins ${
                savingMealPlan || saveSuccess
                  ? "bg-slate-300 cursor-not-allowed shadow-none"
                  : "bg-slate-600 hover:bg-slate-700"
              }`}
            >
              {savingMealPlan ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Meal Plan</span>
                </>
              )}
            </button>
          )}

          <Link
            href="/Products"
            className="group relative px-6 py-3.5 rounded-xl font-medium text-[15px] tracking-wide transition-all duration-300 flex items-center justify-center gap-2.5 bg-[#7ab530] hover:bg-[#6aa02a] text-white shadow-sm hover:shadow-md active:scale-[0.98] font-poppins"

          >
            <Utensils className="w-4 h-4" />
            <span>Browse Meals</span>
          </Link>
        </div>
      </div>

    </main>
  );
}

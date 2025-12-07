"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Tag
} from "lucide-react";
import Link from "next/link";

export default function MealPlansResult() {
  const router = useRouter();
  const [formData, setFormData] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("mealPlanFormData");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
      } catch (e) {
        console.error("Error loading form data:", e);
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

      setAiResponse(responseData);
    } catch (error) {
      console.error('Error sending data to webhook:', error);
      setError("Failed to get AI recommendations. Please try again.");
    } finally {
      setIsLoading(false);
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

  // Render AI response visualization
  const renderAIResponse = () => {
    if (!parsedResponse) return null;

    // Handle structured meal plan response
    if (parsedResponse.mealPlan || parsedResponse.meals || parsedResponse.days) {
      const mealPlan = parsedResponse.mealPlan || parsedResponse.meals || [];
      const days = parsedResponse.days || formData.days || 7;

      return (
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-6 h-6 text-[#7ab530]" />
            <h2 className="text-2xl font-bold text-gray-900">AI-Generated Meal Plan</h2>
          </div>

          <div className="space-y-6">
            {Array.isArray(mealPlan) && mealPlan.length > 0 ? (
              mealPlan.map((day, dayIndex) => {
                const dayNumber = dayIndex + 1;
                const dayMeals = Array.isArray(day.meals) ? day.meals : Array.isArray(day) ? day : [];
                const dayTotalCals = dayMeals.reduce((acc, meal) => acc + (meal.calories || 0), 0);

                return (
                  <div key={dayIndex} className="border-2 border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#7ab530]" />
                        {day.day || day.title || `Day ${dayNumber}`}
                      </h3>
                      {dayTotalCals > 0 && (
                        <span className="text-sm font-semibold text-gray-500">Total: {dayTotalCals} kcal</span>
                      )}
                    </div>

                    <div className="space-y-4">
                      {dayMeals.map((meal, mealIndex) => (
                        <div
                          key={mealIndex}
                          className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-[#7ab530] transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Utensils className="w-5 h-5 text-[#7ab530]" />
                              <h4 className="font-semibold text-gray-900">{meal.mealType || meal.type || 'Meal'}</h4>
                            </div>
                            {meal.calories && (
                              <span className="text-sm font-bold text-[#7ab530]">
                                {meal.calories} kcal
                              </span>
                            )}
                          </div>
                          {meal.name && (
                            <p className="text-gray-900 text-sm font-medium mb-2">{meal.name}</p>
                          )}
                          {meal.description && (
                            <p className="text-gray-600 text-sm mb-2">{meal.description}</p>
                          )}
                          {(meal.protein || meal.carbs || meal.fats) && (
                            <div className="flex gap-4 text-xs text-gray-500">
                              {meal.protein && (
                                <span className="flex items-center gap-1">
                                  <div className="w-2 h-2 rounded-full bg-red-400"></div> P: {meal.protein}g
                                </span>
                              )}
                              {meal.carbs && (
                                <span className="flex items-center gap-1">
                                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div> C: {meal.carbs}g
                                </span>
                              )}
                              {meal.fats && (
                                <span className="flex items-center gap-1">
                                  <div className="w-2 h-2 rounded-full bg-blue-400"></div> F: {meal.fats}g
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                No meal plan data available
              </div>
            )}
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
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleBack}
            className="px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Create New Plan
          </button>

          <button
            onClick={sendToWebhook}
            disabled={isLoading || !stats}
            className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 text-white shadow-lg hover:shadow-xl ${
              isLoading || !stats
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                Get AI Recommendations
              </>
            )}
          </button>

          <Link
            href="/Products"
            className="px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 bg-[#7ab530] text-white hover:bg-[#6aa02a] shadow-lg hover:shadow-xl"
          >
            Browse Meals
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}



"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Header from "../../Header";
import Footer from "../../Footer";
import { 
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function MealPlansStep4() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    weight: "",
    gender: "",
    height: "",
    birthDate: "",
    trainingActivity: "",
    mealType: "",
    days: null,
  });

  // Load form data from localStorage on mount
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

  // Calculate BMI from weight (kg) and height (cm)
  const bmi = useMemo(() => {
    if (formData.weight && formData.height) {
      const weightKg = parseFloat(formData.weight);
      const heightM = parseFloat(formData.height) / 100; // Convert cm to meters
      if (weightKg > 0 && heightM > 0) {
        return (weightKg / (heightM * heightM)).toFixed(1);
      }
    }
    return null;
  }, [formData.weight, formData.height]);

  const handlePrevious = () => {
    router.push("/MealPlans/duration");
  };

  const handleGenerate = () => {
    // Navigate to result page
    router.push("/MealPlans/result");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#e9fce2] via-[#f7fff3] to-[#d9f8cc]">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="text-gray-900">Diet</span>
            <span className="text-[#7ab530]">&</span>
            <span className="text-gray-900">Fit</span>
          </h1>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2">
            {Array.from({ length: 8 }, (_, i) => i + 1).map((step) => (
              <div
                key={step}
                className={`h-2 rounded-full transition-all duration-300 ${
                  step <= 8
                    ? "bg-[#7ab530] w-12"
                    : "bg-gray-200 w-12"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-2xl mx-auto">
          <h2 className="text-center text-gray-500 text-lg mb-6 font-medium">
            Review Your Information
          </h2>
          <h3 className="text-center text-2xl md:text-3xl font-semibold text-gray-900 mb-8">
            Let's generate your meal plan
          </h3>

          <div className="space-y-4 mb-8 p-6 bg-gray-50 rounded-2xl">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Weight:</span>
              <span className="text-gray-900 font-semibold">{formData.weight} kg</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Gender:</span>
              <span className="text-gray-900 font-semibold capitalize">{formData.gender}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Height:</span>
              <span className="text-gray-900 font-semibold">{formData.height} cm</span>
            </div>
            {bmi && (
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600 font-medium">BMI:</span>
                <span className="text-gray-900 font-semibold">{bmi}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Birth Date:</span>
              <span className="text-gray-900 font-semibold">
                {formData.birthDate ? new Date(formData.birthDate).toLocaleDateString() : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Activity Level:</span>
              <span className="text-gray-900 font-semibold capitalize">
                {formData.trainingActivity.replace("-", " ")}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Meal Type:</span>
              <span className="text-gray-900 font-semibold capitalize">
                {formData.mealType === "all" ? "All Meals" : formData.mealType.replace("-", " ")}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 font-medium">Meal Plan Duration:</span>
              <span className="text-gray-900 font-semibold">{formData.days} Days</span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handlePrevious}
              className="flex-1 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
              Previous
            </button>
            <button
              onClick={handleGenerate}
              className="flex-1 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 bg-[#7ab530] text-white hover:bg-[#6aa02a] shadow-lg hover:shadow-xl transform hover:scale-[1.02] cursor-pointer"
            >
              Generate Meal Plan
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}


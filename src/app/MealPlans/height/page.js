"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Header from "../../Header";
import Footer from "../../Footer";
import {
  ArrowRight,
  Ruler,
  TrendingUp
} from "lucide-react";

export default function MealPlansHeight() {
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

  const [isLoaded, setIsLoaded] = useState(false);

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
    setIsLoaded(true);
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("mealPlanFormData", JSON.stringify(formData));
    }
  }, [formData, isLoaded]);

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

  const handleInputChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      height: value,
    }));
  };

  const handleNext = () => {
    if (formData.height) {
      router.push("/MealPlans/birthdate");
    }
  };

  const handlePrevious = () => {
    router.push("/MealPlans/gender");
  };

  const totalSteps = 7;
  const currentStep = 3;

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
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <div
                key={step}
                className={`h-2 rounded-full transition-all duration-300 ${step <= currentStep
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
            Personal Information
          </h2>
          <h3 className="text-center text-2xl md:text-3xl font-semibold text-gray-900 mb-8">
            What's your height?
          </h3>

          <div className="mb-8">
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-4 text-lg">
              <Ruler className="w-6 h-6 text-[#7ab530]" />
              Height (cm)
            </label>
            <input
              type="number"
              min="50"
              max="250"
              value={formData.height}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Enter your height in centimeters"
              className="w-full p-6 rounded-xl border-2 border-gray-200 focus:border-[#7ab530] focus:ring-2 focus:ring-[#7ab530]/20 outline-none transition text-gray-900 text-lg"
              autoFocus
            />
          </div>

          {/* BMI Display */}
          {bmi && (
            <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#7ab530]" />
                  <span className="font-semibold text-gray-700">Your BMI:</span>
                </div>
                <span className="text-2xl font-bold text-[#7ab530]">{bmi}</span>
              </div>
            </div>
          )}

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
              onClick={handleNext}
              disabled={!formData.height}
              className={`flex-1 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${formData.height
                  ? "bg-[#7ab530] text-white hover:bg-[#6aa02a] shadow-lg hover:shadow-xl transform hover:scale-[1.02] cursor-pointer"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}


"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../Header";
import Footer from "../../Footer";
import {
  ArrowRight,
  Leaf,
  Wheat,
  Apple,
  Zap,
  Droplet,
  Beef,
  Fish,
  Salad,
  CheckSquare
} from "lucide-react";

export default function MealPlansMealType() {
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

  // Save form data to localStorage when it changes
  useEffect(() => {
    if (formData.mealType) {
      localStorage.setItem("mealPlanFormData", JSON.stringify(formData));
    }
  }, [formData]);

  const handleInputChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      mealType: value,
    }));
  };

  const handleNext = () => {
    if (formData.mealType) {
      router.push("/MealPlans/duration");
    }
  };

  const handlePrevious = () => {
    router.push("/MealPlans/activity");
  };

  const totalSteps = 8;
  const currentStep = 6;

  const mealTypeOptions = [
    { label: "All Types", value: "all", icon: CheckSquare },
    { label: "Vegan", value: "vegan", icon: Leaf },
    { label: "Low Carb", value: "low-carb", icon: Apple },
    { label: "Gluten Free", value: "gluten-free", icon: Wheat },
    { label: "High Protein", value: "high-protein", icon: Zap },
    { label: "Low Fat", value: "low-fat", icon: Droplet},
    { label: "Vegetarian", value: "vegetarian", icon: Leaf },
    
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Section */}
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="flex gap-1.5">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <div
                  key={step}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    step <= currentStep
                      ? "bg-[#7ab530] w-10"
                      : "bg-gray-200 w-10"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
            Step {currentStep} of {totalSteps}
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Choose Your Meal Preferences
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Select the type of meals that best fit your dietary needs and lifestyle
          </p>
        </div>

        {/* Meal Type Options Grid */}
        <div className="max-w-5xl mx-auto mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {mealTypeOptions.map((option, index) => {
              const IconComponent = option.icon;
              const isSelected = formData.mealType === option.value;

              return (
                <button
                  key={index}
                  onClick={() => handleInputChange(option.value)}
                  className={`group relative p-6 md:p-7 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-3 text-center bg-white hover:shadow-lg ${
                    isSelected
                      ? "border-[#7ab530] bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg scale-[1.02]"
                      : "border-gray-200 hover:border-gray-300 hover:scale-[1.01]"
                  }`}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#7ab530] flex items-center justify-center shadow-md">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Icon Container */}
                  <div
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? "bg-[#7ab530] text-white shadow-md"
                        : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                    }`}
                  >
                    <IconComponent className={`w-7 h-7 md:w-8 md:h-8 ${isSelected ? "text-white" : ""}`} />
                  </div>
                  
                  {/* Label */}
                  <span
                    className={`text-base md:text-lg font-semibold transition-colors duration-300 ${
                      isSelected ? "text-[#7ab530]" : "text-gray-700 group-hover:text-gray-900"
                    }`}
                  >
                    {option.label}
                  </span>
                  
                  {/* Hover Effect Overlay */}
                  {!isSelected && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-50/0 to-emerald-50/0 group-hover:from-green-50/50 group-hover:to-emerald-50/50 transition-all duration-300 pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handlePrevious}
                className="flex-1 py-3.5 px-6 rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={!formData.mealType}
                className={`flex-1 py-3.5 px-6 rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 ${
                  formData.mealType
                    ? "bg-[#7ab530] text-white hover:bg-[#6aa02a] shadow-md hover:shadow-lg transform hover:scale-[1.01] cursor-pointer"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

    
    </main>
  );
}


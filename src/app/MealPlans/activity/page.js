"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../Header";
import Footer from "../../Footer";
import {
  ArrowRight,
  Activity
} from "lucide-react";

export default function MealPlansStep2() {
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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePrevious = () => {
    router.push("/MealPlans/birthdate");
  };

  // Validation
  const canProceed = formData.trainingActivity !== "";

  const handleNext = (e) => {
    e.preventDefault();
    if (formData.trainingActivity) {
      router.push("/MealPlans/mealtype");
    } else {
      console.log("Cannot proceed: trainingActivity is empty", formData);
    }
  };

  const trainingOptions = [
    { label: "Sedentary (little or no exercise)", value: "sedentary", icon: Activity },
    { label: "Light (exercise 1-3 days/week)", value: "light", icon: Activity },
    { label: "Moderate (exercise 3-5 days/week)", value: "moderate", icon: Activity },
    { label: "Active (exercise 6-7 days/week)", value: "active", icon: Activity },
    { label: "Very Active (hard exercise daily)", value: "very-active", icon: Activity },
  ];

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
                className={`h-2 rounded-full transition-all duration-300 ${step <= 5
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
            Activity Level
          </h2>
          <h3 className="text-center text-2xl md:text-3xl font-semibold text-gray-900 mb-8">
            How active are you?
          </h3>

          <div className="space-y-4 mb-8">
            {trainingOptions.map((option, index) => {
              const IconComponent = option.icon;
              const isSelected = formData.trainingActivity === option.value;

              return (
                <button
                  key={index}
                  onClick={() => handleInputChange("trainingActivity", option.value)}
                  className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 text-left ${isSelected
                      ? "border-[#7ab530] bg-green-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                    }`}
                >
                  <IconComponent className={`w-6 h-6 ${isSelected ? "text-[#7ab530]" : "text-gray-400"}`} />
                  <span
                    className={`text-lg font-medium flex-1 ${isSelected ? "text-[#7ab530]" : "text-gray-700"
                      }`}
                  >
                    {option.label}
                  </span>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#7ab530] flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              );
            })}
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
              onClick={handleNext}
              disabled={!canProceed}
              className={`flex-1 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${canProceed
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


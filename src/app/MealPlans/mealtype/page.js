"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../Header";
import Footer from "../../Footer";
import {
  ArrowRight,
  UtensilsCrossed,
  Leaf,
  Wheat,
  Apple
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
    { label: "Vegan", value: "vegan", icon: Leaf },
    { label: "Low Carb", value: "low-carb", icon: Apple },
    { label: "Gluten Free", value: "gluten-free", icon: Wheat },
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
            Meal Preferences
          </h2>
          <h3 className="text-center text-2xl md:text-3xl font-semibold text-gray-900 mb-8">
            What type of meals do you want?
          </h3>

          <div className="space-y-4 mb-8">
            {mealTypeOptions.map((option, index) => {
              const IconComponent = option.icon;
              const isSelected = formData.mealType === option.value;

              return (
                <button
                  key={index}
                  onClick={() => handleInputChange(option.value)}
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
              disabled={!formData.mealType}
              className={`flex-1 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${formData.mealType
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


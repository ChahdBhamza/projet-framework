"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../Header";
import Footer from "../../Footer";
import {
  ArrowRight,
  Cake
} from "lucide-react";

export default function MealPlansBirthDate() {
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
    if (formData.birthDate) {
      localStorage.setItem("mealPlanFormData", JSON.stringify(formData));
    }
  }, [formData]);

  const handleInputChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      birthDate: value,
    }));
  };

  const handleNext = () => {
    if (formData.birthDate) {
      router.push("/MealPlans/activity");
    }
  };

  const handlePrevious = () => {
    router.push("/MealPlans/height");
  };

  const totalSteps = 7;
  const currentStep = 4;

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
            When were you born?
          </h3>

          <div className="mb-8">
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-4 text-lg">
              <Cake className="w-6 h-6 text-[#7ab530]" />
              Birth Date
            </label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleInputChange(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full p-6 rounded-xl border-2 border-gray-200 focus:border-[#7ab530] focus:ring-2 focus:ring-[#7ab530]/20 outline-none transition text-gray-900 text-lg"
              autoFocus
            />
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
              disabled={!formData.birthDate}
              className={`flex-1 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${formData.birthDate
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

     
    </main>
  );
}


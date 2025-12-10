"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Header from "../Header";
import Footer from "../Footer";
import {
  ArrowRight,
  Scale
} from "lucide-react";

export default function MealPlansWeight() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    weight: "",
    gender: "",
    height: "",
    birthDate: "",
    trainingActivity: "",
    mealType: "",
    days: null,
  });

  // Check authentication
  useEffect(() => {
    if (!authLoading && !user) {
      // Redirect to sign in with return URL
      router.push(`/Signin?returnUrl=${encodeURIComponent('/MealPlans')}`);
    }
  }, [user, authLoading, router]);

  // Clear localStorage when first visiting this page (form always starts fresh)
  useEffect(() => {
    localStorage.removeItem("mealPlanFormData");
  }, []);

  // Save form data to localStorage when it changes (for navigation between pages)
  useEffect(() => {
    if (formData.weight) {
      localStorage.setItem("mealPlanFormData", JSON.stringify(formData));
    }
  }, [formData]);

  const handleInputChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      weight: value,
    }));
  };

  const handleNext = () => {
    if (formData.weight) {
      router.push("/MealPlans/gender");
    }
  };

  const totalSteps = 8;
  const currentStep = 1;

  // Show loading or nothing while checking auth
  if (authLoading || (!user && !authLoading)) {
    return null;
  }

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
            What's your weight?
          </h3>

          <div className="mb-8">
            <input
              type="number"
              min="1"
              max="300"
              value={formData.weight}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Enter your weight in kilograms"
              className="w-full p-4 rounded-lg border border-[#7ab530] focus:outline-none focus:ring-1 focus:ring-[#7ab530] text-gray-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              autoFocus
            />
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={!formData.weight}
            className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${formData.weight
              ? "bg-[#7ab530] text-white hover:bg-[#6aa02a] shadow-lg hover:shadow-xl transform hover:scale-[1.02] cursor-pointer"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
          >
            Next
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      
    </main>
  );
}

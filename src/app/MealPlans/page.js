"use client";

import { useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { Sparkles, ArrowRight } from "lucide-react";

export default function MealPlans() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({
    days: null,
    calorieRange: null,
    dietType: null,
  });

  const questions = [
    {
      id: 1,
      title: "First things first",
      question: "How many days would you like your meal plan?",
      options: [
        { label: "3 Days", value: 3, icon: "📅" },
        { label: "5 Days", value: 5, icon: "📆" },
        { label: "7 Days", value: 7, icon: "🗓️" },
        { label: "14 Days", value: 14, icon: "📋" },
      ],
    },
    {
      id: 2,
      title: "Calorie goals",
      question: "What calorie range per meal?",
      options: [
        { label: "300-400 kcal", value: "300-400", icon: "🥗" },
        { label: "400-500 kcal", value: "400-500", icon: "🍽️" },
        { label: "500-600 kcal", value: "500-600", icon: "🍲" },
      ],
    },
    {
      id: 3,
      title: "Diet preferences",
      question: "What type of diet do you prefer?",
      options: [
        { label: "All Meals", value: "all", icon: "🍱" },
        { label: "Vegan", value: "vegan", icon: "🌱" },
        { label: "High Protein", value: "protein", icon: "🥩" },
        { label: "Low Carb", value: "low-carb", icon: "🥑" },
      ],
    },
  ];

  const handleOptionSelect = (questionId, value) => {
    let key = "";
    if (questionId === 1) key = "days";
    else if (questionId === 2) key = "calorieRange";
    else if (questionId === 3) key = "dietType";

    setSelectedOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const currentQuestion = questions[currentStep - 1];
  const canProceed =
    (currentStep === 1 && selectedOptions.days !== null) ||
    (currentStep === 2 && selectedOptions.calorieRange !== null) ||
    (currentStep === 3 && selectedOptions.dietType !== null);

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

        {currentStep <= 3 && (
          <>
            {/* Progress Indicator */}
            <div className="flex justify-center mb-8">
              <div className="flex gap-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      step <= currentStep
                        ? "bg-[#7ab530] w-12"
                        : "bg-gray-200 w-12"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Question Section */}
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-2xl mx-auto">
              <h2 className="text-center text-gray-500 text-lg mb-6 font-medium">
                {currentQuestion.title}
              </h2>

              <h3 className="text-center text-2xl md:text-3xl font-semibold text-gray-900 mb-8">
                {currentQuestion.question}
              </h3>

              {/* Options */}
              <div className="space-y-4 mb-8">
                {currentQuestion.options.map((option, index) => {
                  const isSelected =
                    (currentStep === 1 && selectedOptions.days === option.value) ||
                    (currentStep === 2 &&
                      selectedOptions.calorieRange === option.value) ||
                    (currentStep === 3 &&
                      selectedOptions.dietType === option.value);

                  return (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(currentQuestion.id, option.value)}
                      className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 text-left ${
                        isSelected
                          ? "border-[#7ab530] bg-green-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <span className="text-3xl">{option.icon}</span>
                      <span
                        className={`text-lg font-medium flex-1 ${
                          isSelected ? "text-[#7ab530]" : "text-gray-700"
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

              {/* Next Button */}
              <button
                onClick={currentStep < 3 ? handleNext : () => {}}
                disabled={currentStep < 3 ? !canProceed : false}
                className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  canProceed || currentStep === 3
                    ? "bg-[#7ab530] text-white hover:bg-[#6aa02a] shadow-lg hover:shadow-xl transform hover:scale-[1.02] cursor-pointer"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {currentStep < 3 ? (
                  <>
                    Next
                    <ArrowRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    Generate Meal Plan
                    <Sparkles className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}

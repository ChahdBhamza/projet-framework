'use client';

import { useState } from 'react';

export default function MealPlanCTA() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-icon icon-1">🍎</div>
        <div className="floating-icon icon-2">🥗</div>
        <div className="floating-icon icon-3">🥑</div>
        <div className="floating-icon icon-4">🥙</div>
        <div className="floating-icon icon-5">🍊</div>
        <div className="floating-icon icon-6">🥦</div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="text-center lg:text-left animate-fade-in-up">
            {/* Badge */}
            <div className="inline-block mb-4 px-4 py-2 bg-white rounded-full shadow-md animate-bounce-slow">
              <span className="text-sm font-semibold text-[#7ab530] flex items-center gap-2">
                <span className="animate-pulse">✨</span>
                Smart Meal Planning
                <span className="animate-pulse">✨</span>
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-slide-in-left">
              <span className="block">Lost on what to</span>
              <span className="block" style={{ color: "#7ab530" }}>
                eat today?
                <span className="inline-block ml-2 animate-wiggle">🍽️</span>
              </span>
            </h2>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed animate-fade-in-delay">
              Feeling bored with the same meals? Let our AI-powered meal planner create personalized, delicious meal plans tailored to your taste, dietary preferences, and health goals in seconds!
            </p>

            {/* Features List */}
            <div className="mb-8 space-y-4 animate-fade-in-delay-2">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7ab530] flex items-center justify-center animate-scale-in">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span>Personalized meal recommendations based on your goals</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7ab530] flex items-center justify-center animate-scale-in-delay">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span>Instant meal plan generation in under 30 seconds</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7ab530] flex items-center justify-center animate-scale-in-delay-2">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span>Nutritional balance and variety guaranteed</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-8 justify-center lg:justify-start animate-fade-in-delay-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#7ab530]">10K+</div>
                <div className="text-sm text-gray-600">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#7ab530]">50K+</div>
                <div className="text-sm text-gray-600">Meals Generated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#7ab530]">4.9★</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative px-8 py-4 bg-gradient-to-r from-[#7ab530] to-[#6aa02a] text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-pulse-slow"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Generate My Meal Plan
                  <span className={`inline-block transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
                    →
                  </span>
                </span>
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#6aa02a] to-[#7ab530] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
              <button className="px-8 py-4 border-2 border-[#7ab530] text-[#7ab530] rounded-full font-semibold hover:bg-[#7ab530] hover:text-white transition-all duration-300">
                View Sample Plans
              </button>
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="relative animate-fade-in-right">
            <div className="relative z-10">
              <img 
                src="/confused.png" 
                alt="Confused about meals" 
                className="w-full h-auto drop-shadow-2xl "
              />
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-300 rounded-full opacity-20 animate-ping-slow"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-green-300 rounded-full opacity-20 animate-pulse-slow"></div>
            
            {/* Floating Question Marks */}
            <div className="absolute top-10 left-10 text-6xl font-bold text-[#7ab530] opacity-30 animate-bounce-question">
              ?
            </div>
            <div className="absolute top-20 right-20 text-5xl font-bold text-[#7ab530] opacity-30 animate-bounce-question-delay">
              ?
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


"use client";

import { useState } from "react";
import Image from "next/image";

const testimonials = [
  {
    text: "This app completely transformed my eating habits. The meal plans are delicious and easy to follow, making healthy eating effortless.",
    author: "Conrad F.",
    role: "Actor",
    rating: 5,
    image: "/conrad.jpg",
  },
  {
    text: "I lost 15 pounds in just 8 weeks without feeling deprived. The recipes are flavorful and the grocery lists save me so much time.",
    author: "John D.",
    role: "Sales manager",
    rating: 5,
    image: "/test5.jpg",
  },
  {
    text: "Perfect for my busy schedule! The quick recipes help me eat better without spending hours cooking. I recommend to everyone.",
    author: "Emily R.",
    role: "Grad student",
    rating: 4,
    image: "/test3.jpg",
  },
  {
    text: "Finally found a meal plan that works for my family. The variety keeps everyone happy and the nutritional balance is exactly what we needed.",
    author: "Michael B.",
    role: "New parent",
    rating: 5,
    image: "/test8.jpg",
  },
  {
    text: "Love the variety and how the app adapts to my preferences. The habit tracker keeps me motivated without being overwhelming at all.",
    author: "Sophia L.",
    role: "Designer",
    rating: 4,
    image: "/test5.jpg",
  },
];

export default function Testimonials() {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3; // number of cards visible at a time
  const maxIndex = Math.max(0, testimonials.length - visibleCount);

  const prev = () => {
    setStartIndex((prevIndex) =>
      prevIndex === 0 ? maxIndex : prevIndex - 1
    );
  };

  const next = () => {
    setStartIndex((prevIndex) =>
      prevIndex >= maxIndex ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="relative pt-20 pb-32 px-6">
      <div className="absolute inset-0 bg-gradient-to-br from-[#f0fdf4] via-white to-[#eff6ff]" />

      <div className="relative max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white shadow-sm ring-1 ring-gray-100 px-3 py-1 mb-4">
          <span className="text-[#7ab530] text-lg">⭐</span>
          <span className="text-sm text-gray-700">Loved by people building healthy habits</span>
        </div>

        <h2 className="text-4xl font-poppins mb-4" style={{ color: "#7ab530" }}>
          What Our Users Say
        </h2>
        <p className="text-gray-600 mb-10">Real stories from real routines—no fads, just food that works.</p>

        <div className="relative flex items-center">
          {/* Left Arrow */}
          <button
            onClick={prev}
            className="absolute -left-4 md:-left-8 z-10 bg-white rounded-full p-3 shadow hover:bg-green-50 transition"
          >
            &#8592;
          </button>

          {/* Cards Container */}
          <div className="flex overflow-hidden w-full mx-4 md:mx-8">
            {testimonials
              .slice(startIndex, startIndex + visibleCount)
              .map((t, i) => (
                <div
                  key={`${startIndex}-${i}`}
                  className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 mx-2 bg-white rounded-xl shadow-lg ring-1 ring-gray-100 p-6 flex flex-col items-center text-center transition-transform duration-500 hover:-translate-y-1"
                >
                  <div className="w-24 h-24 mb-4 relative rounded-full overflow-hidden ring-2 ring-[#e8f7d6]">
                    <Image
                      src={t.image}
                      alt={t.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex gap-1 mb-2" aria-label={`Rating: ${t.rating} out of 5`}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <span key={idx} className={idx < (t.rating || 5) ? "text-yellow-400" : "text-gray-300"}>★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed mb-3 text-center">
                    “{t.text}”
                  </p>
                  <p className="font-semibold">{t.author}</p>
                  {t.role && <p className="text-sm text-gray-500">{t.role}</p>}
                </div>
              ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={next}
            className="absolute -right-4 md:-right-8 z-10 bg-white rounded-full p-3 shadow hover:bg-green-50 transition"
          >
            &#8594;
          </button>
        </div>

        
      </div>
    </section>
  );
}

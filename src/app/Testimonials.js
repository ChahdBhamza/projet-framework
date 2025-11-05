"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const testimonials = [
  {
    text: "FitMeal reset my routine. Tasty plans, zero overthinking—I'm finally consistent.",
    author: "Sarah M.",
    role: "Busy mom of 2",
    rating: 5,
    image: "/test1.jpg",
  },
  {
    text: "Down 15 lbs in 8 weeks without giving up flavor. Grocery lists are clutch.",
    author: "John D.",
    role: "Sales manager",
    rating: 5,
    image: "/test1.jpg",
  },
  {
    text: "The 15‑min recipes fit my schedule. I cook more, spend less, feel better.",
    author: "Emily R.",
    role: "Grad student",
    rating: 4,
    image: "/test1.jpg",
  },
  {
    text: "I finally enjoy healthy food. The plan adapts when my week gets hectic.",
    author: "Michael B.",
    role: "New parent",
    rating: 5,
    image: "/test1.jpg",
  },
  {
    text: "Tons of variety. The habit tracker nudges me without pressure—love it.",
    author: "Sophia L.",
    role: "Designer",
    rating: 4,
    image: "/test1.jpg",
  },
];

export default function Testimonials() {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3; // number of cards visible at a time

  const prev = () => {
    setStartIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - visibleCount : prevIndex - 1
    );
  };

  const next = () => {
    setStartIndex((prevIndex) =>
      prevIndex >= testimonials.length - visibleCount ? 0 : prevIndex + 1
    );
  };

  // Auto‑advance carousel
  useEffect(() => {
    const id = setInterval(() => {
      setStartIndex((prevIndex) =>
        prevIndex >= testimonials.length - visibleCount ? 0 : prevIndex + 1
      );
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative py-20 px-6">
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
            className="absolute left-0 z-10 bg-white rounded-full p-3 shadow hover:bg-green-50 transition"
          >
            &#8592;
          </button>

          {/* Cards Container */}
          <div className="flex overflow-hidden w-full mx-8">
            {testimonials
              .slice(startIndex, startIndex + visibleCount)
              .map((t, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-1/3 mx-2 bg-white rounded-xl shadow-lg ring-1 ring-gray-100 p-6 flex flex-col items-center text-left transition-transform duration-500 hover:-translate-y-1"
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
            className="absolute right-0 z-10 bg-white rounded-full p-3 shadow hover:bg-green-50 transition"
          >
            &#8594;
          </button>
        </div>

        {/* Dots */}
        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setStartIndex(idx % testimonials.length)}
              aria-label={`Go to slide ${idx + 1}`}
              className={(idx === startIndex ? "bg-[#7ab530]" : "bg-gray-300") + " h-2 w-2 rounded-full transition-colors"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

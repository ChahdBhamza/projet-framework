"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AddPurchase } from "./Utils/purchases";
import { ShoppingCart } from "lucide-react";

export default function PopularMeals() {
  const router = useRouter();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/meals");
        const data = await res.json();
        if (data.success && Array.isArray(data.meals)) {
          // Pick 4 “popular” meals – for now just take the first 4
          setMeals(data.meals.slice(0, 4));
        } else {
          setMeals([]);
        }
      } catch (error) {
        console.error("Failed to load popular meals:", error);
        setMeals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  const handleAddToCart = async (meal) => {
    if (!meal?._id) return;
    await AddPurchase(meal._id, meal);
    router.push("/Purchases");
  };

  return (
    <section  id="PopularMeals" className="relative py-16 px-6">
      <div className="absolute inset-0 bg-gradient-to-br from-[#f0fdf4] via-white to-[#ecfeff]" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white shadow-sm ring-1 ring-gray-100 px-3 py-1 mb-3">
            <span className="text-[#7ab530] text-lg">🥗</span>
            <span className="text-sm text-gray-700">Popular this week</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold" style={{ color: "#7ab530" }}>
            Fresh Meals for You
          </h2>
          <p className="text-gray-600 mt-2">Four favorites picked for flavor, balance, and ease.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="h-10 w-10 border-2 border-[#7ab530] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : meals.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No popular meals to show yet. Add some meals to your database.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {meals.map((meal) => (
              <div
                key={meal._id}
                className="group bg-white rounded-xl overflow-hidden shadow-lg ring-1 ring-gray-100 hover:-translate-y-1 transition-transform"
              >
                <Link href={`/Products/${meal._id}`} className="block">
                  <div className="relative h-40 cursor-pointer bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-4xl mb-1 block">🥗</span>
                      <span className="text-xs font-medium text-green-800 opacity-80">
                        {meal.mealType || "Healthy Meal"}
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="p-5">
                  <Link href={`/Products/${meal._id}`}>
                    <h3 className="text-lg font-semibold mb-1 hover:text-[#7ab530] transition-colors cursor-pointer">
                      {meal.mealName}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {meal.description || "Balanced, fresh, and ready in minutes."}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#7ab530] font-semibold">
                      {meal.price || 15} TND
                    </span>
                    <button
                      onClick={() => handleAddToCart(meal)}
                      className="px-4 py-2 rounded-full bg-[#7ab530] text-white hover:bg-[#6aa42a] transition-colors flex items-center gap-1.5"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}



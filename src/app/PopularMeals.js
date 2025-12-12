"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AddPurchase } from "./Utils/purchases";
import { ShoppingCart } from "lucide-react";

// Product Image Component with error handling
function ProductImage({ meal }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative w-full h-64 overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100">
      <Link href={`/Products/${meal._id}`} className="block h-full w-full relative">
        {!imageError ? (
          <Image
            src={`/${meal.mealName}.jpg`}
            alt={meal.mealName}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => {
              setImageError(true);
            }}
            onLoad={(e) => {
              // Check if image actually loaded
              const img = e.target;
              if (img.naturalWidth === 0 || img.naturalHeight === 0) {
                setImageError(true);
              }
            }}
          />
        ) : null}
        {/* Fallback placeholder */}
        <div className={`${imageError ? 'flex' : 'hidden'} h-full w-full items-center justify-center text-center absolute inset-0`}>
          <div className="text-center">
            <span className="text-4xl mb-2 block">🥗</span>
            <span className="text-sm font-medium text-green-800 opacity-75">{meal.mealType}</span>
          </div>
        </div>
        {/* Hover Overlay - Transparent Green */}
        <div className="absolute inset-0 bg-[#7ab530]/30 transition-all duration-300 opacity-0 group-hover:opacity-100 z-10"></div>
      </Link>
    </div>
  );
}

export default function PopularMeals() {
  const router = useRouter();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setLoading(true);
        const res = await fetch("/Api/meals");
        
        // Check if response is OK and is JSON
        if (!res.ok) {
          console.error(`API error: ${res.status} ${res.statusText}`);
          setMeals([]);
          return;
        }
        
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Response is not JSON:", contentType);
          setMeals([]);
          return;
        }
        
        const data = await res.json();
        if (data.success && Array.isArray(data.meals)) {
          // Pick 4 "popular" meals – for now just take the first 4
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
    try {
      await AddPurchase(meal._id, meal);
      router.push("/Purchases");
    } catch (error) {
      // Error handling is done in AddToCart (redirects to sign-in)
      // Just prevent navigation if there's an error
      console.error("Error adding to cart:", error);
    }
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
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Product Image */}
                <ProductImage meal={meal} />

                {/* White Content Section */}
                <div className="p-5 flex flex-col">
                  {/* Product Title */}
                  <Link href={`/Products/${meal._id}`}>
                    <h3 className="text-lg font-bold text-gray-900 hover:text-[#7ab530] transition-colors mb-2 line-clamp-2">
                      {meal.mealName}
                    </h3>
                  </Link>
                  
                  {/* Tags */}
                  {meal.tags && meal.tags.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {meal.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-md capitalize">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                   
                  {/* Price and Add to Cart */}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                    <span className="text-base font-semibold text-gray-900">
                      {meal.price || 15} TND
                    </span>
                    <button
                      onClick={() => handleAddToCart(meal)}
                      className="bg-[#7ab530] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#6aa02b] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow-md"
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

"use client";

import Link from "next/link";
import Image from "next/image";
import { GetFavorites, AddFavorites, RemoveFavorites } from "../../Utils/favorites";
import { AddPurchase } from "../../Utils/purchases";
import { useState, useEffect } from "react";
import { ShoppingCart, Heart, ArrowLeft, Star, Check } from "lucide-react";
import Header from "../../Header";
import Footer from "../../Footer";

export default function ProductDetail({ params, searchParams }) {
  const id = params.id; 
  const fromSource = searchParams?.from || null;  // ✅ FIXED

  const [isFavorite, setIsFavorite] = useState(false);
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        setLoading(true);
        setImageError(false);
        const res = await fetch(`/api/meals/${id}`);
        const data = await res.json();
        if (data.success) {
          setMeal(data.meal);
        }
      } catch (error) {
        console.error("Failed to fetch meal:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMeal();
  }, [id]);

  useEffect(() => {
    const checkFavorite = async () => {
      if (meal) {
        const favorites = await GetFavorites();
        setIsFavorite(favorites.includes(meal._id));
      }
    };
    checkFavorite();
  }, [meal]);

  useEffect(() => {
    const executePendingAction = async () => {
      const pendingActionStr = localStorage.getItem("pendingAction");
      if (!pendingActionStr || !meal) return;

      try {
        const pendingAction = JSON.parse(pendingActionStr);

        if (pendingAction.mealId === meal._id) {
          if (pendingAction.action === "addToCart") {
            await AddPurchase(meal._id, meal);
            alert(`${meal.mealName} added to cart!`);
            localStorage.removeItem("pendingAction");
          } else if (pendingAction.action === "addFavorite") {
            await AddFavorites(meal._id);
            setIsFavorite(true);
            localStorage.removeItem("pendingAction");
          }
        }
      } catch (error) {
        console.error("Error executing pending action:", error);
        localStorage.removeItem("pendingAction");
      }
    };

    const token = localStorage.getItem("token");
    if (token && meal) executePendingAction();
  }, [meal]);

  const handleFavoriteToggle = async () => {
    if (!meal) return;

    try {
      if (isFavorite) {
        await RemoveFavorites(meal._id);
        setIsFavorite(false);
      } else {
        await AddFavorites(meal._id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleAddToCart = async () => {
    if (!meal) return;
    try {
      await AddPurchase(meal._id, meal);
      alert(`${meal.mealName} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // --- everything below stays the same ---

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7ab530]"></div>
      </main>
    );
  }

  if (!meal) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-gray-500 text-lg">Meal not found.</p>
          <Link href="/Products">
            <button className="mt-4 text-[#7ab530] hover:underline">Back to Products</button>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={fromSource === 'mealplan' ? "/MealPlans/result" : "/Products"}>
            <button className="flex items-center gap-2 text-gray-600 hover:text-[#7ab530] transition-colors font-medium">
              <ArrowLeft className="w-4 h-4" />
              {fromSource === 'mealplan' ? "Back to Meal Plan" : "Back to Products"}
            </button>
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Product Image */}
          <div className="relative group">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 shadow-xl">
              {meal.mealName && !imageError ? (
                <>
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
                  {/* Fallback placeholder */}
                  <div className="hidden h-full w-full items-center justify-center text-center p-8">
                    <span className="text-8xl mb-4 block">🥗</span>
                    <span className="text-2xl font-medium text-green-800 opacity-75">{meal.mealType}</span>
                  </div>
                  {/* Hover Overlay - Transparent Green */}
                  <div className="absolute inset-0 bg-[#7ab530]/30 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                </>
              ) : (
                <div className="h-full w-full flex items-center justify-center text-center p-8">
                  <span className="text-8xl mb-4 block">🥗</span>
                  <span className="text-2xl font-medium text-green-800 opacity-75">{meal.mealType}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex flex-col justify-center space-y-6">
            {/* Title & Calories */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
                {meal.mealName}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xl font-semibold text-[#7ab530]">{meal.price || 15} TND</span>
                <span className="text-gray-500 text-lg">{meal.calories} kcal</span>
              </div>
            </div>

            {/* Rating & Tags */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-2 text-sm text-gray-600">(4.8)</span>
              </div>
              {/* Categories/Tags */}
              {meal.tags && meal.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {meal.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full capitalize"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed text-base">
                {meal.description}
              </p>
            </div>

            {/* Recipe Details & Instructions */}
            {(meal.instructions || meal.readyInMinutes) && (
              <div className="pt-6 border-t border-gray-200 space-y-4">
                <div className="flex gap-6 text-sm text-gray-600">
                  {meal.readyInMinutes && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">Ready in:</span>
                      {meal.readyInMinutes} mins
                    </div>
                  )}
                  {meal.servings && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">Servings:</span>
                      {meal.servings}
                    </div>
                  )}
                </div>

                {meal.instructions && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Preparation</h2>
                    <div
                      className="text-gray-600 leading-relaxed text-base space-y-2 prose prose-green"
                      dangerouslySetInnerHTML={{ __html: meal.instructions }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Features */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-gray-700">
                <Check className="w-5 h-5 text-[#7ab530] flex-shrink-0" />
                <span className="text-sm">Fresh ingredients daily</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Check className="w-5 h-5 text-[#7ab530] flex-shrink-0" />
                <span className="text-sm">Nutritionist approved</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Check className="w-5 h-5 text-[#7ab530] flex-shrink-0" />
                <span className="text-sm">Ready in minutes</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#7ab530] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#6aa02b] transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={handleFavoriteToggle}
                className={`px-8 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2 ${isFavorite
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-white border-2 border-gray-300 text-gray-700 hover:border-red-400 hover:text-red-500"
                  }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? "fill-white" : ""}`} />
                {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Meals - Removed for now as we need to implement API fetching for related meals */}

      <Footer />
    </main>
  );
}

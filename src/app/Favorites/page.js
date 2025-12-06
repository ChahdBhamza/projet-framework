"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Footer from "../Footer";
import Header from "../Header";
import { GetFavorites, RemoveFavorites } from "../Utils/favorites";
import { AddPurchase } from "../Utils/purchases";
import { useState, useEffect } from "react";
import { Heart, Trash2, ShoppingCart, Sparkles, ArrowLeft } from "lucide-react";

export default function Favorites() {
  const router = useRouter();
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [favoriteMeals, setFavoriteMeals] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      const ids = await GetFavorites();
      setFavoriteIds(ids);
      // Fetch meals from API instead of using static data
      try {
        const res = await fetch('/api/meals');
        const data = await res.json();
        if (data.success) {
          const favorites = data.meals.filter(meal => ids.includes(meal._id));
      setFavoriteMeals(favorites);
        }
      } catch (error) {
        console.error('Error loading meals:', error);
      }
    };

    loadFavorites();
  }, []);

  const handleRemoveFavorite = async (id) => {
    try {
      await RemoveFavorites(id);
    setFavoriteIds(favoriteIds.filter(favId => favId !== id));
      setFavoriteMeals(favoriteMeals.filter(meal => meal._id !== id));
    } catch (error) {
      // Error handling is done in RemoveFavorites (redirects to sign-in)
      console.error("Error removing favorite:", error);
    }
  };

  const handleAddToCart = async (meal) => {
    try {
      await AddPurchase(meal._id, meal);
    router.push("/Purchases");
    } catch (error) {
      // Error handling is done in AddToCart (redirects to sign-in)
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <main>
      <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-[#e9fce2] via-[#f7fff3] to-[#d9f8cc]">
        {/* 🍏 Floating Fruits / Decorations */}
        <Image
          src="/apple.png"
          alt="Apple"
          width={100}
          height={100}
          className="floating absolute top-24 left-10 opacity-80 drop-shadow-md z-0"
        />
        <Image
          src="/strawberry.png"
          alt="Strawberry"
          width={110}
          height={110}
          className="floating absolute bottom-28 left-24 opacity-80 drop-shadow-md z-0"
        />
        <Image
          src="/carrot.png"
          alt="Carrot"
          width={100}
          height={100}
          className="floating absolute top-32 right-20 opacity-80 drop-shadow-md z-0"
        />
        <Image
          src="/broccoli.png"
          alt="Broccoli"
          width={90}
          height={90}
          className="floating absolute bottom-12 right-16 opacity-80 drop-shadow-md z-0"
        />

        {/* 🌿 Soft translucent overlay */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-0"></div>

        {/* Navbar */}
        <div className="relative z-10">
          <Header />
        </div>

        {/* Hero Section */}
        <section className="text-center py-16 mb-12 relative z-10 px-4">
          <div className="max-w-3xl mx-auto">
            {/* Back Button */}
            <div className="flex justify-start mb-6">
              <Link href="/Products">
                <button className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 hover:border-[#7ab530] hover:bg-white transition-all shadow-sm hover:shadow-md text-gray-700 font-medium">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Products
                </button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-3">
           
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7ab530] via-[#8bc63e] to-[#97d45b]">
                My Favorite Meals
              </h1>
          
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <p className="text-gray-600 text-base md:text-lg">
                {favoriteMeals.length > 0
                  ? `${favoriteMeals.length} favorite meal${favoriteMeals.length > 1 ? "s" : ""} saved`
                  : "No favorites yet. Start adding meals you love!"}
              </p>
            </div>
            {favoriteMeals.length > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full">
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <span className="text-sm font-semibold text-red-700">
                  {favoriteMeals.length} item{favoriteMeals.length > 1 ? "s" : ""} in favorites
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Favorites Content */}
        <div className="max-w-7xl mx-auto py-6 px-4 mb-16 relative z-10">
          {favoriteMeals.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-10 shadow-xl max-w-md mx-auto border border-gray-100">
                <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">No favorites yet</h3>
                <p className="text-gray-500 mb-6 text-sm">Start adding meals you love to your favorites!</p>
                <Link href="/Products">
                  <button className="bg-gradient-to-r from-[#7ab530] to-[#8bc63e] text-white px-6 py-2.5 rounded-xl font-semibold hover:from-[#6aa02b] hover:to-[#7ab530] transition-all shadow-md hover:shadow-lg">
                    Browse Meals
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {favoriteMeals.map((meal) => (
                <div
                  key={meal._id}
                  className="group bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Image Section */}
                  <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                    <Link href={`/Products/${meal._id}`} className="block h-full w-full flex items-center justify-center">
                      <div className="text-center p-4">
                        <span className="text-4xl mb-2 block">🥗</span>
                        <span className="text-sm font-medium text-green-800 opacity-75">{meal.mealType}</span>
                      </div>
                      <div className="absolute top-3 left-3">
                        <div className="bg-red-500 rounded-full p-1.5 shadow-md">
                          <Heart className="w-4 h-4 text-white fill-white" />
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="mb-3">
                      <Link href={`/Products/${meal._id}`}>
                        <h3 className="text-lg font-bold text-gray-800 hover:text-[#7ab530] transition-colors mb-1">
                          {meal.mealName}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-500 text-xs font-medium">{meal.calories} kcal</p>
                        <p className="text-[#7ab530] font-bold">{meal.price || 15} TND</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(meal);
                        }}
                        className="flex-1 bg-[#7ab530] text-white py-2 rounded-lg font-semibold hover:bg-[#6aa02b] active:scale-95 transition-all duration-200 flex items-center justify-center gap-1.5 text-sm shadow-sm"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Add to Cart
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFavorite(meal._id);
                        }}
                        className="flex-1 border border-red-300 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-500 hover:text-white active:scale-95 transition-all duration-200 flex items-center justify-center gap-1.5 text-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

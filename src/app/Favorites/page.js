"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Footer from "../Footer";
import Header from "../Header";
import { GetFavorites, RemoveFavorites } from "../Utils/favorites";
import { AddPurchase } from "../Utils/purchases";
import { useState, useEffect } from "react";
import { Heart, Trash2, ShoppingCart, ArrowLeft, ImageOff, ChefHat } from "lucide-react";

export default function Favorites() {
  const router = useRouter();
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [favoriteMeals, setFavoriteMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      const ids = await GetFavorites();
      setFavoriteIds(ids);
      try {
        const res = await fetch('/api/meals');
        const data = await res.json();
        if (data.success) {
          const favorites = data.meals.filter(meal => ids.includes(meal._id));
          setFavoriteMeals(favorites);
        }
      } catch (error) {
        console.error('Error loading meals:', error);
      } finally {
        setLoading(false);
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
      console.error("Error removing favorite:", error);
    }
  };

  const handleAddToCart = async (meal) => {
    try {
      await AddPurchase(meal._id, meal);
      router.push("/Purchases");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#e9fce2] via-[#f7fff3] to-[#d9f8cc] font-sans text-gray-900 relative overflow-hidden">
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

      {/* Content */}
      <div className="relative z-10">
        <Header />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/Products"
                className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#7ab530] transition-colors"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Menu
              </Link>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
              Your Favorites
            </h1>
            <p className="mt-2 text-gray-500">
              {favoriteMeals.length} {favoriteMeals.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : favoriteMeals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-500 max-w-md mb-8">
              Save your favorite meals here to easily order them later.
            </p>
            <Link href="/Products">
              <button className="px-8 py-3 bg-[#7ab530] text-white rounded-xl font-semibold hover:bg-[#6aa02b] transition-all shadow-lg hover:shadow-[#7ab530]/20 active:scale-95">
                Explore Menu
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteMeals.map((meal) => (
              <FavoriteCard
                key={meal._id}
                meal={meal}
                onRemove={handleRemoveFavorite}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <Footer />
      </div>
    </main>
  );
}

function FavoriteCard({ meal, onRemove, onAddToCart }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Link href={`/Products/${meal._id}`}>
          {!imageError ? (
            <Image
              src={`/${meal.mealName}.jpg`}
              alt={meal.mealName}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <ImageOff className="w-10 h-10 mb-2 opacity-50" />
              <span className="text-xs font-medium">No Image</span>
            </div>
          )}
          {/* Overlay gradient for better text visibility if needed, though we have white bg below */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </Link>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(meal._id);
          }}
          className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
          title="Remove from favorites"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Link href={`/Products/${meal._id}`} className="block">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#7ab530] transition-colors line-clamp-1">
                {meal.mealName}
              </h3>
            </Link>
            <span className="text-lg font-bold text-[#7ab530] whitespace-nowrap">
              {meal.price || 15} TND
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <ChefHat className="w-4 h-4" />
              {meal.calories} kcal
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="capitalize">{meal.mealType}</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-50">
          <button
            onClick={() => onAddToCart(meal)}
            className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-[#7ab530] transition-all duration-300 flex items-center justify-center gap-2 group/btn"
          >
            <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

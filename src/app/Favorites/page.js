"use client";

import Link from "next/link";
import Image from "next/image";
import Footer from "../Footer";
import { GetFavorites, RemoveFavorites } from "../Utils/favorites";
import { meals as allMeals } from "../Utils/meals";
import { useState, useEffect } from "react";
import { Heart, Trash2 } from "lucide-react"; // Optional: use icons for nicer buttons

export default function Favorites() {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [favoriteMeals, setFavoriteMeals] = useState([]);

  useEffect(() => {
    const loadFavorites = () => {
      const ids = GetFavorites();
      setFavoriteIds(ids);
      const favorites = allMeals.filter(meal => ids.includes(meal.id));
      setFavoriteMeals(favorites);
    };

    loadFavorites();
    window.addEventListener("storage", loadFavorites);
    return () => window.removeEventListener("storage", loadFavorites);
  }, []);

  const handleRemoveFavorite = (id) => {
    RemoveFavorites(id);
    setFavoriteIds(favoriteIds.filter(favId => favId !== id));
    setFavoriteMeals(favoriteMeals.filter(meal => meal.id !== id));
  };

  return (
    <main className="bg-gray-50 min-h-screen">
     {/* Navbar */}
     <header className="navbar flex items-center justify-between p-6">
        <div className="logo">
          <h2 id="logotx" className="text-1xl ">FitMeal</h2>
        </div>

        <nav className="nav-links flex gap-6">
          <a href="/">Home</a>
          <a href="/Products">Products</a>
          <a href="#">MealPlans</a>
          <a href="/Aboutus">About us</a>
        </nav>

        <div className="actions flex gap-3">
        <Link href="/Signin">
          <button className="  border border-[#7ab530] text-[#7ab530] px-4 py-2 rounded-full hover:bg-[#7ab530] hover:text-white transition">
            Sign In
          </button>
          </Link>
          <Link href="/Signup">
          <button className="bg-[#7ab530] text-white px-4 py-2 rounded-full hover:bg-[#7ab530]-900 transition">
            Sign Up
          </button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="text-center py-20 bg-gradient-to-r from-green-100 via-green-50 to-green-100">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
          My Favorite Meals ❤️
        </h1>
        <p className="mt-4 text-gray-600 text-lg md:text-xl">
          {favoriteMeals.length > 0
            ? `You have ${favoriteMeals.length} favorite meal${favoriteMeals.length > 1 ? "s" : ""}`
            : "No favorites yet. Start adding meals you love!"}
        </p>
      </section>

      {/* Favorites Grid */}
      <div className="max-w-7xl mx-auto py-16 px-4">
        {favoriteMeals.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl mb-6">You haven't added any favorites yet.</p>
            <Link href="/Products">
              <button className="bg-green-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-green-700 transition">
                Browse Meals
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {favoriteMeals.map((meal) => (
              <div
                key={meal.id}
                className="relative group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-2"
              >
                {/* Meal Image - Clickable */}
                <Link 
                  href={`/Products/${meal.id}`} 
                  className="block relative h-64 w-full cursor-pointer"
                >
                  <Image
                    src={meal.img}
                    alt={meal.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                </Link>

                {/* Content */}
                <div className="p-6 flex flex-col gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{meal.name}</h3>
                    <p className="text-gray-500 text-sm">{meal.calories}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2 mt-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">Healthy</span>
                    <span className="px-3 py-1 bg-red-100 text-red-600 text-xs rounded-full flex items-center gap-1">
                      <Heart className="w-3 h-3" /> Favorite
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-4">
                    <Link 
                      href={`/Products/${meal.id}`} 
                      className="flex-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button 
                        type="button"
                        className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 active:bg-green-800 transition flex justify-center items-center gap-2"
                      >
                        View Details
                      </button>
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFavorite(meal.id);
                      }}
                      className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 active:bg-red-700 transition flex justify-center items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

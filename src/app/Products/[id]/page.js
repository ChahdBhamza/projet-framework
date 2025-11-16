"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { meals } from "../../Utils/meals";
import { GetFavorites, AddFavorites, RemoveFavorites } from "../../Utils/favorites";
import { AddPurchase } from "../../Utils/purchases";
import { useState, useEffect } from "react";
import { ShoppingCart, Heart, ArrowLeft, Star, Check } from "lucide-react";
import Header from "../../Header";
import Footer from "../../Footer";

export default function ProductDetail() {
  const params = useParams();
  const id = parseInt(params.id);
  const [isFavorite, setIsFavorite] = useState(false);

  // Find the meal by id
  const meal = meals.find(m => m.id === id);

  useEffect(() => {
    const favorites = GetFavorites();
    setIsFavorite(favorites.includes(id));
  }, [id]);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      RemoveFavorites(id);
      setIsFavorite(false);
    } else {
      AddFavorites(id);
      setIsFavorite(true);
    }
  };

  const handleAddToCart = () => {
    if (meal) {
      AddPurchase(meal.id, meal);
      alert(`${meal.name} added to cart!`);
    }
  };

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
          <Link href="/Products">
            <button className="flex items-center gap-2 text-gray-600 hover:text-[#7ab530] transition-colors font-medium">
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </button>
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Image */}
          <div className="relative">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-xl">
              <Image
                src={meal.img}
                alt={meal.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Favorite Badge */}
            <button
              onClick={handleFavoriteToggle}
              className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
            >
              <Heart 
                className={`w-6 h-6 transition-colors ${
                  isFavorite 
                    ? "text-red-500 fill-red-500" 
                    : "text-gray-400 hover:text-red-400"
                }`}
              />
            </button>
          </div>

          {/* Right: Details */}
          <div className="flex flex-col justify-center space-y-6">
            {/* Title & Calories */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
                {meal.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xl font-semibold text-[#7ab530]">{meal.price || 15} TND</span>
                <span className="text-gray-500 text-lg">{meal.calories}</span>
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
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                  Healthy
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                  Fresh
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed text-base">
                {meal.description}
              </p>
            </div>

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
                className={`px-8 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2 ${
                  isFavorite 
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

      {/* Related Meals */}
      <section className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {meals.filter(m => m.id !== meal.id).slice(0, 4).map(m => (
              <Link 
                key={m.id} 
                href={`/Products/${m.id}`}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  <Image
                    src={m.img}
                    alt={m.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-[#7ab530] transition-colors">
                    {m.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">{m.calories}</p>
                    <p className="text-lg font-bold text-[#7ab530]">{m.price || 15} TND</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

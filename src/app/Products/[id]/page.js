"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { meals } from "../../Utils/meals";
import { GetFavorites, AddFavorites, RemoveFavorites } from "../../Utils/favorites";
import { AddPurchase } from "../../Utils/purchases";
import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";

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

  if (!meal) return <p className="text-center mt-20">Meal not found.</p>;

  return (
    <main className="min-h-screen bg-[#f8fff4] px-6 py-12">
      {/* Breadcrumb / Back Link */}
      <div className="max-w-7xl mx-auto mb-6">
        <Link href="/Products" className="text-green-600 hover:underline">&larr; Back to Products</Link>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* Left: Image */}
        <div className="relative w-full h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-lg">
          <Image
            src={meal.img}
            alt={meal.name}
            fill
            className="object-cover hover:scale-105 transition duration-500"
          />
        </div>

        {/* Right: Details */}
        <div className="space-y-6">
          <h1 className="text-2xl md:text-4xl font-semibold text-gray-800">{meal.name}</h1>
          <p className="text-gray-500 text-lg">{meal.calories}</p>

          {/* Tags */}
          <div className="flex gap-3">
            <span className="px-3 py-1 bg-[#e8f5d9] text-[#7ab530] text-xs rounded-full">Healthy</span>
            <span className="px-3 py-1 bg-[#f3f3f3] text-gray-600 text-xs rounded-full">Popular</span>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-lg">{meal.description}</p>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-4">
            <button 
              onClick={handleAddToCart}
              className="bg-[#7ab530] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#6aa02b] transition flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            <button 
              onClick={handleFavoriteToggle}
              className={`px-6 py-3 rounded-xl font-medium transition ${
                isFavorite 
                  ? "bg-red-500 text-white hover:bg-red-600" 
                  : "border border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
              }`}
            >
              {isFavorite ? "❤️ Remove from Favorites" : "🤍 Add to Favorites"}
            </button>
          </div>
        </div>
      </div>

      {/* Optional: Related Meals */}
      <section className="max-w-7xl mx-auto mt-16">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Related Meals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {meals.filter(m => m.id !== meal.id).map(m => (
            <Link key={m.id} href={`/Products/${m.id}`} className="block bg-white/90 rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all backdrop-blur-sm">
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={m.img}
                  alt={m.name}
                  fill
                  className="object-cover hover:scale-110 transition duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">{m.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{m.calories}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

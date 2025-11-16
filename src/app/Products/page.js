        "use client";

        import Link from "next/link";
        import Image from "next/image";
        import Footer from "../Footer";
        import Header from "../Header";

        import { AddFavorites, GetFavorites } from "../Utils/favorites";
        import { AddPurchase, GetPurchasesCount } from "../Utils/purchases";
        import { meals } from "../Utils/meals";
        import { useState, useEffect, useMemo } from "react";
        import { ShoppingCart, Heart, Star, Filter, Search, Sparkles } from "lucide-react";


        export default function Products() {
            const [purchasesCount, setPurchasesCount] = useState(0);
            const [favoritesCount, setFavoritesCount] = useState(0);
            const [priceRange, setPriceRange] = useState(90);
            const [searchQuery, setSearchQuery] = useState("");
            const [selectedCategory, setSelectedCategory] = useState("All Categories");
            const [selectedCalories, setSelectedCalories] = useState("Any Calories");
            const [sortBy, setSortBy] = useState("default");

            useEffect(() => {
                const updateCounts = () => {
                    setPurchasesCount(GetPurchasesCount());
                    setFavoritesCount(GetFavorites().length);
                };
                updateCounts();
                window.addEventListener("storage", updateCounts);
                return () => window.removeEventListener("storage", updateCounts);
            }, []);

            const handleAddToCart = (meal) => {
                AddPurchase(meal.id, meal);
                setPurchasesCount(GetPurchasesCount());
            };

            const handleAddFavorite = (mealId) => {
                AddFavorites(mealId);
                setFavoritesCount(GetFavorites().length);
            };

            const handlePriceChange = (e) => {
                setPriceRange(Number(e.target.value));
            };

            // Filter and sort meals
            const filteredAndSortedMeals = useMemo(() => {
                let filtered = [...meals];

                // Search filter
                if (searchQuery) {
                    filtered = filtered.filter(meal =>
                        meal.name.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                }

                // Category filter
                if (selectedCategory !== "All Categories") {
                    // For now, all meals pass since we don't have category data
                    // You can add category to meals data later
                }

                // Calories filter
                if (selectedCalories !== "Any Calories") {
                    filtered = filtered.filter(meal => {
                        const calories = parseInt(meal.calories);
                        if (selectedCalories === "< 400 kcal") return calories < 400;
                        if (selectedCalories === "400 - 500 kcal") return calories >= 400 && calories <= 500;
                        if (selectedCalories === "> 500 kcal") return calories > 500;
                        return true;
                    });
                }

                // Price filter
                filtered = filtered.filter(meal => {
                    const price = meal.price || 15; // Use meal price
                    return price <= priceRange;
                });

                // Sort
                if (sortBy === "price-low") {
                    filtered.sort((a, b) => (a.price || 15) - (b.price || 15));
                } else if (sortBy === "price-high") {
                    filtered.sort((a, b) => (b.price || 15) - (a.price || 15));
                } else if (sortBy === "name") {
                    filtered.sort((a, b) => a.name.localeCompare(b.name));
                } else if (sortBy === "calories-low") {
                    filtered.sort((a, b) => parseInt(a.calories) - parseInt(b.calories));
                } else if (sortBy === "calories-high") {
                    filtered.sort((a, b) => parseInt(b.calories) - parseInt(a.calories));
                }

                return filtered;
            }, [searchQuery, selectedCategory, selectedCalories, priceRange, sortBy]);

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
            
            <section className="text-center py-16 mb-12 relative z-10 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Sparkles className="w-6 h-6 text-[#7ab530]" />
                        <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#7ab530] via-[#8bc63e] to-[#97d45b]">
                            Explore Healthy Meals
                        </h1>
                        <Sparkles className="w-6 h-6 text-[#7ab530]" />
                    </div>
                    <p className="mt-2 text-gray-600 text-lg md:text-xl mb-8">
                        Discover delicious, nutritious meals tailored for you
                    </p>
                    
                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto mb-6">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                            <Search className="w-6 h-6 text-[#7ab530] drop-shadow-sm" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for meals..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-12 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#7ab530] focus:ring-2 focus:ring-[#7ab530]/20 outline-none transition-all bg-white/90 backdrop-blur-sm shadow-lg text-gray-700 placeholder-gray-400 font-medium"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#7ab530] transition-colors font-bold text-lg"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                </div>
            </section>


            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16 relative z-10 px-4">
                
                {/* ✅ Sidebar Filters */}
                <aside className="bg-white/95 p-6 rounded-2xl shadow-2xl lg:col-span-1 backdrop-blur-md border-2 border-green-100/50 h-fit sticky top-24">
                    <div className="flex items-center gap-2 mb-6">
                        <Filter className="w-5 h-5 text-[#7ab530]" />
                        <h2 className="text-2xl font-bold text-[#7ab530]">Filters</h2>
                    </div>

                    <div className="space-y-6">
                        {/* Quick Links */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200/50">
                            <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Quick Access</h3>
                            <div className="space-y-2">
                                <Link href="/Favorites" className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/80 transition text-green-700 font-medium text-sm">
                                    <Heart className="w-4 h-4" />
                                    My Favorites ({favoritesCount})
                                </Link>
                                <Link href="/Purchases" className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/80 transition text-green-700 font-medium text-sm">
                                    <ShoppingCart className="w-4 h-4" />
                                    My Cart ({purchasesCount})
                                </Link>
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Category</h3>
                            <select 
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-[#7ab530] focus:border-[#7ab530] transition text-sm font-medium cursor-pointer"
                            >
                                <option>All Categories</option>
                                <option>Vegan</option>
                                <option>Protein</option>
                                <option>Low Carb</option>
                                <option>Keto</option>
                            </select>
                        </div>

                        {/* Calories */}
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Calories</h3>
                            <select 
                                value={selectedCalories}
                                onChange={(e) => setSelectedCalories(e.target.value)}
                                className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-[#7ab530] focus:border-[#7ab530] transition text-sm font-medium cursor-pointer"
                            >
                                <option>Any Calories</option>
                                <option>&lt; 400 kcal</option>
                                <option>400 - 500 kcal</option>
                                <option>&gt; 500 kcal</option>
                            </select>
                        </div>

                        {/* Price Range */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Price Range</h3>
                                <div className="bg-[#7ab530] text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                                    {priceRange} TND
                                </div>
                            </div>
                            
                            {/* Price Slider Container */}
                            <div className="relative py-3">
                                <input
                                    type="range"
                                    min="15"
                                    max="90"
                                    step="1"
                                    value={priceRange}
                                    onChange={handlePriceChange}
                                    className="w-full h-3 rounded-lg appearance-none cursor-pointer price-slider"
                                    style={{
                                        background: `linear-gradient(to right, #7ab530 0%, #7ab530 ${((priceRange - 15) / (90 - 15)) * 100}%, #e5e7eb ${((priceRange - 15) / (90 - 15)) * 100}%, #e5e7eb 100%)`
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ✅ Meals Cards */}
                <section className="lg:col-span-3">
                {filteredAndSortedMeals.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-xl max-w-md mx-auto">
                            <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">No meals found</h3>
                            <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategory("All Categories");
                                    setSelectedCalories("Any Calories");
                                    setPriceRange(90);
                                }}
                                className="px-6 py-2 bg-[#7ab530] text-white rounded-xl font-semibold hover:bg-[#6aa02b] transition"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedMeals.map((meal, index) => (
                    <div
                    key={meal.id}
                    className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                   {/* Image Section */}
                   <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                        <Link href={`/Products/${meal.id}`} className="block h-full">
                            <Image
                                src={meal.img}
                                alt={meal.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </Link>
                        {/* Rating Badge - Top Left */}
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-md flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-semibold text-gray-800">4.8</span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4">
                        {/* Title and Price */}
                        <div className="mb-3">
                            <Link href={`/Products/${meal.id}`}>
                                <h3 className="text-lg font-bold text-gray-900 hover:text-[#7ab530] transition-colors mb-2 line-clamp-1">
                                    {meal.name}
                                </h3>
                            </Link>
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-500">{meal.calories}</p>
                                <p className="text-lg font-bold text-[#7ab530]">{meal.price || 15} TND</p>
                            </div>
                        </div>

                        {/* Single Tag */}
                        <div className="mb-4">
                            <span className="inline-block px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-md">
                                Healthy
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handleAddToCart(meal)}
                                className="flex-1 bg-[#7ab530] text-white py-2.5 rounded-lg font-semibold hover:bg-[#6aa02b] active:scale-95 transition-all duration-200 flex items-center justify-center gap-1.5 text-sm shadow-sm hover:shadow-md"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Add to Cart
                            </button>
                            <button
                                onClick={() => handleAddFavorite(meal.id)}
                                className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-red-400 hover:text-red-500 active:scale-95 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
                            >
                                <Heart className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
                )}
                </section>
           
              
            </div>
            </div>
            <Footer/>
            </main>
        );
        }


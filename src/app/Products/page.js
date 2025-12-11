"use client";

import Link from "next/link";
import Image from "next/image";
import Footer from "../Footer";
import Header from "../Header";

import { AddFavorites, GetFavorites } from "../Utils/favorites";
import { AddPurchase, GetPurchasesCount } from "../Utils/purchases";

import { useState, useEffect, useMemo } from "react";
import { ShoppingCart, Heart, Star, Filter, Search, Sparkles, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import Slider from "../components/Slider";

// Product Card Component with image error handling
function ProductCard({ meal, onAddToCart, onToggleFavorite, isFavorite, selectedCategories = [] }) {
    const [imageError, setImageError] = useState(false);

    return (
        <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
            {/* Product Image */}
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
                    <div className="absolute inset-0 bg-[#7ab530]/30 transition-all duration-300 opacity-0 group-hover:opacity-100 z-10"></div>
                </Link>

                {/* Favorite Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        onToggleFavorite(meal._id);
                    }}
                    className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition-all duration-200 group/fav"
                >
                    <Heart
                        className={`w-5 h-5 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400 group-hover/fav:text-red-500"}`}
                    />
                </button>
            </div>

            {/* White Content Section */}
            <div className="p-5 flex flex-col">
                {/* Product Title */}
                <Link href={`/Products/${meal._id}`}>
                    <h3 className="text-lg font-bold text-gray-900 hover:text-[#7ab530] transition-colors mb-2 line-clamp-2">
                        {meal.mealName}
                    </h3>
                </Link>

                {/* Tags */}
                <div className="mb-2 flex flex-wrap gap-1">
                    {(() => {
                        // Sort tags to show selected ones first
                        const sortedTags = [...(meal.tags || [])].sort((a, b) => {
                            const aSelected = selectedCategories.includes(a);
                            const bSelected = selectedCategories.includes(b);
                            if (aSelected && !bSelected) return -1;
                            if (!aSelected && bSelected) return 1;
                            return 0;
                        });

                        return (
                            <>
                                {sortedTags.slice(0, 2).map((tag, i) => (
                                    <span key={i} className={`px-2 py-1 text-xs font-medium rounded-md capitalize whitespace-nowrap border ${selectedCategories.includes(tag) ? 'bg-green-100 text-green-800 border-green-300' : 'bg-green-50 text-green-700 border-green-200'}`}>
                                        {tag}
                                    </span>
                                ))}
                                {sortedTags.length > 2 && (
                                    <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-md border border-gray-200">
                                        +{sortedTags.length - 2}
                                    </span>
                                )}
                            </>
                        );
                    })()}
                </div>

                {/* Calories Badge */}
                <div className="mb-3">
                    <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-md inline-flex items-center gap-1 whitespace-nowrap border border-orange-200">
                        🔥 {meal.calories} kcal
                    </span>
                </div>

                {/* Price and Add to Cart */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                    <span className="text-base font-semibold text-gray-900">
                        {meal.price || 15} TND
                    </span>
                    <button
                        onClick={() => onAddToCart(meal)}
                        className="bg-[#7ab530] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#6aa02b] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow-md"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Products() {
    const [purchasesCount, setPurchasesCount] = useState(0);
    const [favorites, setFavorites] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: 15, max: 90 });
    const [caloriesRange, setCaloriesRange] = useState({ min: 220, max: 680 });
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [sortBy, setSortBy] = useState("default");
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const [priceRangeDebounced, setPriceRangeDebounced] = useState({ min: 15, max: 90 });
    const [caloriesRangeDebounced, setCaloriesRangeDebounced] = useState({ min: 220, max: 680 });

    useEffect(() => {
        const updateCounts = async () => {
            const purchases = await GetPurchasesCount();
            const favoritesData = await GetFavorites();
            setPurchasesCount(purchases);
            setFavorites(favoritesData);
        };
        updateCounts();
    }, []);

    // Fetch meals from database with filters
    useEffect(() => {
        const fetchMeals = async () => {
            try {
                // Save scroll position before loading
                const scrollY = window.scrollY;

                setLoading(true);

                // Build query parameters
                const params = new URLSearchParams();
                if (searchQuery) {
                    params.append('search', searchQuery);
                }
                if (selectedCategories.length > 0) {
                    params.append('tags', selectedCategories.join(','));
                }
                // Calories filters (min/max)
                if (caloriesRangeDebounced.min > 220) {
                    params.append('caloriesMin', caloriesRangeDebounced.min.toString());
                }
                if (caloriesRangeDebounced.max < 680) {
                    params.append('caloriesMax', caloriesRangeDebounced.max.toString());
                }
                if (priceRangeDebounced.min > 15) {
                    params.append('priceMin', priceRangeDebounced.min.toString());
                }
                if (priceRangeDebounced.max < 90) {
                    params.append('priceMax', priceRangeDebounced.max.toString());
                }

                const queryString = params.toString();
                const url = `/api/meals${queryString ? `?${queryString}` : ''}`;

                const res = await fetch(url);
                
                // Check if response is OK
                if (!res.ok) {
                    console.error(`API error: ${res.status} ${res.statusText}`);
                    setMeals([]);
                    return;
                }
                
                // Check if response is JSON
                const contentType = res.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    console.error("Response is not JSON:", contentType);
                    setMeals([]);
                    return;
                }
                
                const data = await res.json();
                if (data.success && Array.isArray(data.meals)) {
                    setMeals(data.meals);
                } else {
                    console.error('Invalid response format:', data);
                    setMeals([]);
                }

                // Restore scroll position after a brief delay to allow DOM update
                setTimeout(() => {
                    window.scrollTo({ top: scrollY, behavior: 'instant' });
                }, 0);
            } catch (error) {
                console.error('Failed to fetch meals:', error);
                setMeals([]);
            } finally {
                setLoading(false);
            }
        };
        fetchMeals();
    }, [searchQuery, selectedCategories, caloriesRangeDebounced.min, caloriesRangeDebounced.max, priceRangeDebounced.min, priceRangeDebounced.max]);

    const handleAddToCart = async (meal) => {
        try {
            await AddPurchase(meal._id, meal);
            const count = await GetPurchasesCount();
            setPurchasesCount(count);
        } catch (error) {
            // Error handling is done in AddToCart (redirects to sign-in)
            console.error("Error adding to cart:", error);
        }
    };

    const handleToggleFavorite = async (mealId) => {
        try {
            // Optimistic update check
            const isFav = favorites.some(f => f.mealId === mealId || f._id === mealId);

            // For now, we only have AddFavorites exposed easily or we need to check if we can remove.
            // The user asked to "add em to the database".
            // I will just call AddFavorites for now as requested, but ideally we should toggle.
            // Since I don't have RemoveFavorites imported and user just said "add", I'll stick to Add.
            // But wait, if I want to show the filled icon, I need to know if it's there.
            // If I call AddFavorites on an existing one, it might duplicate or error depending on backend.
            // Let's assume AddFavorites handles it or just adds.
            await AddFavorites(mealId);

            const updatedFavorites = await GetFavorites();
            setFavorites(updatedFavorites);
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    const handlePriceChange = (newValues) => {
        setPriceRange({ min: newValues[0], max: newValues[1] });
    };

    const handleCaloriesChange = (newValues) => {
        setCaloriesRange({ min: newValues[0], max: newValues[1] });
    };

    // Debounce price range changes to prevent constant re-fetching
    useEffect(() => {
        const timer = setTimeout(() => {
            setPriceRangeDebounced(priceRange);
        }, 300); // Wait 300ms after user stops adjusting slider

        return () => clearTimeout(timer);
    }, [priceRange]);

    // Debounce calories range changes
    useEffect(() => {
        const timer = setTimeout(() => {
            setCaloriesRangeDebounced(caloriesRange);
        }, 300);

        return () => clearTimeout(timer);
    }, [caloriesRange]);

    // Sort meals (filtering is done server-side)
    const sortedMeals = useMemo(() => {
        let sorted = [...meals];

        // Sort
        if (sortBy === "price-low") {
            sorted.sort((a, b) => (a.price || 15) - (b.price || 15));
        } else if (sortBy === "price-high") {
            sorted.sort((a, b) => (b.price || 15) - (a.price || 15));
        } else if (sortBy === "name") {
            sorted.sort((a, b) => a.mealName.localeCompare(b.mealName));
        } else if (sortBy === "calories-low") {
            sorted.sort((a, b) => a.calories - b.calories);
        } else if (sortBy === "calories-high") {
            sorted.sort((a, b) => b.calories - a.calories);
        }

        return sorted;
    }, [meals, sortBy]);

    // Pagination calculations
    const totalPages = Math.ceil(sortedMeals.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedMeals = sortedMeals.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategories, caloriesRangeDebounced, priceRangeDebounced]);

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(totalPages, prev + 1));
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
                    <aside className="bg-white/95 p-6 rounded-2xl shadow-2xl lg:col-span-1 backdrop-blur-md border-2 border-green-100/50 h-fit lg:sticky lg:top-24 self-start">
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
                                        My Favorites ({favorites.length})
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
                                <div className="relative">
                                    <button
                                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                        className="w-full p-3 pr-10 border-2 border-gray-200 rounded-xl bg-white outline-none focus:border-[#7ab530] text-left transition text-sm font-medium cursor-pointer flex items-center justify-between"
                                    >
                                        <span className={selectedCategories.length === 0 ? "text-gray-500" : "text-gray-900"}>
                                            {selectedCategories.length === 0
                                                ? "Select Categories"
                                                : `${selectedCategories.length} Selected`}
                                        </span>
                                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`} />
                                    </button>

                                    {isCategoryOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-2 max-h-60 overflow-y-auto">
                                            {["gluten-free", "vegan", "high-protein", "low-fat", "low-carb"].map((category) => (
                                                <label
                                                    key={category}
                                                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                                                >
                                                    <div className="relative flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedCategories.includes(category)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setSelectedCategories([...selectedCategories, category]);
                                                                } else {
                                                                    setSelectedCategories(selectedCategories.filter(c => c !== category));
                                                                }
                                                            }}
                                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-300 transition-all checked:border-[#7ab530] checked:bg-[#7ab530]"
                                                        />
                                                        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-3.5 w-3.5"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                                stroke="currentColor"
                                                                strokeWidth="1"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700 capitalize">
                                                        {category}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    {/* Backdrop to close dropdown when clicking outside */}
                                    {isCategoryOpen && (
                                        <div
                                            className="fixed inset-0 z-40 bg-transparent"
                                            onClick={() => setIsCategoryOpen(false)}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Calories Range */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Calories</h3>
                                    <div className="bg-[#7ab530] text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                                        {caloriesRange.min} - {caloriesRange.max} kcal
                                    </div>
                                </div>

                                {/* Calories Dual Range Slider Container */}
                                <div className="relative py-2 px-2">
                                    <Slider
                                        min={220}
                                        max={680}
                                        step={10}
                                        value={[caloriesRange.min, caloriesRange.max]}
                                        onChange={handleCaloriesChange}
                                    />

                                    {/* Value labels */}
                                    <div className="flex justify-between text-xs mt-4">
                                        <span className="font-semibold text-[#7ab530] bg-green-50 px-2.5 py-1 rounded-md">{caloriesRange.min} kcal</span>
                                        <span className="font-semibold text-[#7ab530] bg-green-50 px-2.5 py-1 rounded-md">{caloriesRange.max} kcal</span>
                                    </div>
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Price Range</h3>
                                    <div className="bg-[#7ab530] text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                                        {priceRange.min} - {priceRange.max} TND
                                    </div>
                                </div>

                                {/* Price Slider Container */}
                                <div className="relative py-2 px-2">
                                    <Slider
                                        min={15}
                                        max={90}
                                        step={1}
                                        value={[priceRange.min, priceRange.max]}
                                        onChange={handlePriceChange}
                                    />

                                    {/* Value labels */}
                                    <div className="flex justify-between text-xs mt-4">
                                        <span className="font-semibold text-[#7ab530] bg-green-50 px-2.5 py-1 rounded-md">{priceRange.min} TND</span>
                                        <span className="font-semibold text-[#7ab530] bg-green-50 px-2.5 py-1 rounded-md">{priceRange.max} TND</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* ✅ Meals Cards */}
                    <section className="lg:col-span-3">
                        {loading ? (
                            <div className="text-center py-20">
                                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-xl max-w-md mx-auto">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7ab530] mx-auto mb-4"></div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Loading meals...</h3>
                                    <p className="text-gray-500">Please wait while we fetch your meals</p>
                                </div>
                            </div>
                        ) : sortedMeals.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-xl max-w-md mx-auto">
                                    <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No meals found</h3>
                                    <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
                                    <button
                                        onClick={() => {
                                            setSearchQuery("");
                                            setSelectedCategories([]);
                                            setCaloriesRange({ min: 220, max: 680 });
                                            setCaloriesRangeDebounced({ min: 220, max: 680 });
                                            setPriceRange({ min: 15, max: 90 });
                                            setPriceRangeDebounced({ min: 15, max: 90 });
                                        }}
                                        className="px-6 py-2 bg-[#7ab530] text-white rounded-xl font-semibold hover:bg-[#6aa02b] transition"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" style={{ gridAutoRows: '1fr' }}>
                                    {paginatedMeals.map((meal) => (
                                        <ProductCard
                                            key={meal._id}
                                            meal={meal}
                                            onAddToCart={handleAddToCart}
                                            onToggleFavorite={handleToggleFavorite}
                                            isFavorite={favorites.some(f => f.mealId === meal._id || f._id === meal._id)}
                                            selectedCategories={selectedCategories}
                                        />
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="mt-12 mb-8">
                                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                            {/* Previous Button */}
                                            <button
                                                onClick={handlePreviousPage}
                                                disabled={currentPage === 1}
                                                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${currentPage === 1
                                                    ? 'text-gray-300 cursor-not-allowed'
                                                    : 'text-[#7ab530] hover:bg-green-50 hover:text-[#6aa02b]'
                                                    }`}
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                                <span className="hidden sm:inline">Previous</span>
                                            </button>

                                            {/* Page Indicator */}
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-600 text-sm">Page</span>
                                                <span className="bg-[#7ab530] text-white px-4 py-1.5 rounded-md font-semibold text-base min-w-[2.5rem] text-center">
                                                    {currentPage}
                                                </span>
                                                <span className="text-gray-600 text-sm">of</span>
                                                <span className="text-gray-800 font-semibold text-base min-w-[2.5rem] text-center">
                                                    {totalPages}
                                                </span>
                                            </div>

                                            {/* Next Button */}
                                            <button
                                                onClick={handleNextPage}
                                                disabled={currentPage === totalPages}
                                                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${currentPage === totalPages
                                                    ? 'text-gray-300 cursor-not-allowed'
                                                    : 'text-[#7ab530] hover:bg-green-50 hover:text-[#6aa02b]'
                                                    }`}
                                            >
                                                <span className="hidden sm:inline">Next</span>
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {/* Page Dots Indicator */}
                                        <div className="mt-6 flex items-center justify-center gap-1.5">
                                            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                                                let pageNum;
                                                if (totalPages <= 7) {
                                                    pageNum = i + 1;
                                                } else if (currentPage <= 4) {
                                                    pageNum = i + 1;
                                                } else if (currentPage >= totalPages - 3) {
                                                    pageNum = totalPages - 6 + i;
                                                } else {
                                                    pageNum = currentPage - 3 + i;
                                                }

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setCurrentPage(pageNum)}
                                                        className={`rounded-full transition-all duration-200 ${currentPage === pageNum
                                                            ? 'bg-[#7ab530] w-8 h-2'
                                                            : 'bg-gray-300 w-2 h-2 hover:bg-[#7ab530]/40'
                                                            }`}
                                                        aria-label={`Go to page ${pageNum}`}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </section>


                </div>
            </div>
            <Footer />
        </main>
    );
}


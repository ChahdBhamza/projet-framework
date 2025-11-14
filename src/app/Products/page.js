        "use client";

        import Link from "next/link";
        import Image from "next/image";
        import Footer from "../Footer";
        import { AddFavorites } from "../Utils/favorites";
        import { AddPurchase, GetPurchasesCount } from "../Utils/purchases";
        import { meals } from "../Utils/meals";
        import { useState, useEffect } from "react";
        import { ShoppingCart, Heart, Eye, Star, Filter } from "lucide-react";


        export default function Products() {
            const [purchasesCount, setPurchasesCount] = useState(0);
            const [priceRange, setPriceRange] = useState(30);

            useEffect(() => {
                const updateCount = () => {
                    setPurchasesCount(GetPurchasesCount());
                };
                updateCount();
                window.addEventListener("storage", updateCount);
                return () => window.removeEventListener("storage", updateCount);
            }, []);

            const handleAddToCart = (meal) => {
                AddPurchase(meal.id, meal);
                setPurchasesCount(GetPurchasesCount());
            };

            const handlePriceChange = (e) => {
                setPriceRange(Number(e.target.value));
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
            <header className="navbar flex items-center justify-between p-6 bg-white/95 backdrop-blur-md shadow-lg relative z-10 border-b border-green-100/50">
                <div className="logo">
                <h2 id="logotx" className="text-1xl ">FitMeal</h2>
                </div>

                <nav className="nav-links flex gap-6 items-center">
                <a href="/" className="hover:text-[#7ab530] transition-colors font-medium">Home</a>
                <a href="/Products" className="hover:text-[#7ab530] transition-colors font-medium text-[#7ab530]">Products</a>
                <a href="#" className="hover:text-[#7ab530] transition-colors font-medium">MealPlans</a>
                <a href="/Aboutus" className="hover:text-[#7ab530] transition-colors font-medium">About us</a>
                <Link href="/Purchases" className="relative flex items-center gap-1.5 text-green-600 font-semibold hover:text-[#6aa02b] transition-colors px-3 py-1.5 rounded-lg hover:bg-green-50">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Cart</span>
                    {purchasesCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                            {purchasesCount}
                        </span>
                    )}
                </Link>
                </nav>
                <div className="actions flex gap-3">
        <Link href="/Signin">
          <button className="border-2 border-[#7ab530] text-[#7ab530] px-5 py-2 rounded-full hover:bg-[#7ab530] hover:text-white transition-all font-semibold hover:shadow-md">
            Sign In
          </button>
          </Link>
          <Link href="/Signup">
          <button className="bg-gradient-to-r from-[#7ab530] to-[#8bc63e] text-white px-5 py-2 rounded-full hover:from-[#6aa02b] hover:to-[#7ab530] transition-all font-semibold shadow-md hover:shadow-lg">
            Sign Up
          </button>
          </Link>
        </div>
            </header>
            
            <section className="text-center py-20 mb-16 relative z-10 px-4">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#7ab530] via-[#8bc63e] to-[#97d45b]">
                        Explore Healthy Meals 🍽️
                    </h1>
                    <p className="mt-4 text-gray-600 text-lg md:text-xl mb-8">
                        Delicious, nutritious meals tailored for you
                    </p>
                    {purchasesCount > 0 && (
                        <Link href="/Purchases">
                            <button className="bg-[#7ab530] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#6aa02b] transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto">
                                <ShoppingCart className="w-5 h-5" />
                                View Cart ({purchasesCount} items)
                            </button>
                        </Link>
                    )}
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
                                    My Favorites
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
                            <select className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-[#7ab530] focus:border-[#7ab530] transition text-sm font-medium">
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
                            <select className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-[#7ab530] focus:border-[#7ab530] transition text-sm font-medium">
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
                                    ${priceRange}
                                </div>
                            </div>
                            
                            {/* Price Slider Container */}
                            <div className="relative py-3">
                                <input
                                    type="range"
                                    min="5"
                                    max="30"
                                    step="1"
                                    value={priceRange}
                                    onChange={handlePriceChange}
                                    className="w-full h-3 rounded-lg appearance-none cursor-pointer price-slider"
                                    style={{
                                        background: `linear-gradient(to right, #7ab530 0%, #7ab530 ${((priceRange - 5) / (30 - 5)) * 100}%, #e5e7eb ${((priceRange - 5) / (30 - 5)) * 100}%, #e5e7eb 100%)`
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ✅ Meals Cards */}
                <section className="lg:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {meals.map((meal) => (
                    <div
                    key={meal.id}
                    className="group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 transform"
                    >
                   {/* Clickable Image with Overlay */}
                   <div className="relative h-64 w-full overflow-hidden">
                        <Link href={`/Products/${meal.id}`} className="block h-full">
                            <Image
                                src={meal.img}
                                alt={meal.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                                    <Eye className="w-5 h-5 text-[#7ab530]" />
                                </div>
                            </div>
                            <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span className="text-sm font-semibold text-gray-800">4.8</span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                        <div className="mb-3">
                            <Link href={`/Products/${meal.id}`}>
                                <h3 className="text-xl font-bold text-gray-800 hover:text-[#7ab530] transition-colors mb-1">
                                    {meal.name}
                                </h3>
                            </Link>
                            <div className="flex items-center justify-between">
                                <p className="text-gray-500 text-sm font-medium">{meal.calories}</p>
                                <p className="text-[#7ab530] font-bold text-lg">$15</p>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                                Healthy
                            </span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                                Popular
                            </span>
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full border border-purple-200">
                                Fresh
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                            <button 
                                onClick={() => handleAddToCart(meal)} 
                                className="w-full bg-gradient-to-r from-[#7ab530] to-[#8bc63e] text-white py-3 rounded-xl font-semibold hover:from-[#6aa02b] hover:to-[#7ab530] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Add to Cart
                            </button>
                            <div className="grid grid-cols-2 gap-2">
                                <Link href={`/Products/${meal.id}`} className="flex-1">
                                    <button className="w-full border-2 border-[#7ab530] text-[#7ab530] py-2.5 rounded-xl font-semibold hover:bg-[#7ab530] hover:text-white active:scale-95 transition-all duration-200 flex items-center justify-center gap-2">
                                        <Eye className="w-4 h-4" />
                                        View
                                    </button>
                                </Link>
                                <button  
                                    onClick={() => AddFavorites(meal.id)}  
                                    className="flex-1 border-2 border-pink-300 text-pink-600 py-2.5 rounded-xl font-semibold hover:bg-pink-500 hover:text-white active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    <Heart className="w-4 h-4" />
                                    Favorite
                                </button>
                            </div>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
                </section>
           
              
            </div>
            </div>
            <Footer/>
            </main>
        );
        }


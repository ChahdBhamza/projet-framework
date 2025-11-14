"use client";

import Link from "next/link";
import Image from "next/image";
import Footer from "../Footer";
import { GetPurchases, RemovePurchase, UpdatePurchaseQuantity, ClearPurchases } from "../Utils/purchases";
import { useState, useEffect } from "react";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";

export default function Purchases() {
    const [purchases, setPurchases] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const loadPurchases = () => {
            const purchaseList = GetPurchases();
            setPurchases(purchaseList);
            // Calculate total (assuming $15 per meal as default price)
            const total = purchaseList.reduce((sum, p) => sum + (p.quantity * 15), 0);
            setTotalAmount(total);
        };

        loadPurchases();
        window.addEventListener("storage", loadPurchases);
        return () => window.removeEventListener("storage", loadPurchases);
    }, []);

    const handleRemovePurchase = (id) => {
        RemovePurchase(id);
        const updated = purchases.filter(p => p.id !== id);
        setPurchases(updated);
        setTotalAmount(updated.reduce((sum, p) => sum + (p.quantity * 15), 0));
    };

    const handleUpdateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) {
            handleRemovePurchase(id);
            return;
        }
        UpdatePurchaseQuantity(id, newQuantity);
        const updated = purchases.map(p => 
            p.id === id ? { ...p, quantity: newQuantity } : p
        );
        setPurchases(updated);
        setTotalAmount(updated.reduce((sum, p) => sum + (p.quantity * 15), 0));
    };

    const handleClearAll = () => {
        if (confirm("Are you sure you want to clear all purchases?")) {
            ClearPurchases();
            setPurchases([]);
            setTotalAmount(0);
        }
    };

    return (
        <main className="bg-gray-50 min-h-screen">
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



            {/* Hero Section */}
            <section className="text-center py-20 bg-gradient-to-r from-green-100 via-green-50 to-green-100">
                <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
                    My Purchases 🛒
                </h1>
                <p className="mt-4 text-gray-600 text-lg md:text-xl">
                    {purchases.length > 0
                        ? `You have ${purchases.reduce((sum, p) => sum + p.quantity, 0)} item${purchases.reduce((sum, p) => sum + p.quantity, 0) > 1 ? 's' : ''} in your cart`
                        : "No purchases yet. Start adding meals to your cart!"}
                </p>
            </section>

            {/* Purchases Content */}
            <div className="max-w-7xl mx-auto py-16 px-4">
                {purchases.length === 0 ? (
                    <div className="text-center py-20">
                        <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
                        <p className="text-gray-500 text-xl mb-6">Your cart is empty.</p>
                        <Link href="/Products">
                            <button className="bg-green-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-green-700 transition">
                                Browse Meals
                            </button>
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Clear All Button */}
                        <div className="flex justify-end mb-6">
                            <button
                                onClick={handleClearAll}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" /> Clear All
                            </button>
                        </div>

                        {/* Purchases Grid - Rectangular Blocks */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {purchases.map((purchase) => (
                                <div
                                    key={purchase.id}
                                    className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
                                >
                                    {/* Meal Image */}
                                    <Link href={`/Products/${purchase.id}`} className="block relative h-48 w-full">
                                        <Image
                                            src={purchase.img}
                                            alt={purchase.name}
                                            fill
                                            className="object-cover hover:scale-105 transition duration-300"
                                        />
                                    </Link>

                                    {/* Purchase Details */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                            {purchase.name}
                                        </h3>
                                        <p className="text-gray-500 text-sm mb-3">{purchase.calories}</p>
                                        <p className="text-green-600 font-bold text-lg mb-4">
                                            ${(15 * purchase.quantity).toFixed(2)}
                                        </p>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-gray-700 font-medium">Quantity:</span>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => handleUpdateQuantity(purchase.id, purchase.quantity - 1)}
                                                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="text-lg font-semibold w-8 text-center">
                                                    {purchase.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(purchase.id, purchase.quantity + 1)}
                                                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => handleRemovePurchase(purchase.id)}
                                            className="w-full bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition flex items-center justify-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" /> Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Total Summary */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 max-w-2xl mx-auto">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xl font-semibold text-gray-800">Total Items:</span>
                                <span className="text-xl font-bold text-gray-800">
                                    {purchases.reduce((sum, p) => sum + p.quantity, 0)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-xl font-semibold text-gray-800">Total Amount:</span>
                                <span className="text-2xl font-bold text-green-600">
                                    ${totalAmount.toFixed(2)}
                                </span>
                            </div>
                            <button className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition text-lg">
                                Checkout
                            </button>
                        </div>
                    </>
                )}
            </div>

            <Footer />
        </main>
    );
}


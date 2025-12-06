"use client";

import Link from "next/link";
import Image from "next/image";
import Footer from "../Footer";
import Header from "../Header";
import { GetPurchases, RemovePurchase, UpdatePurchaseQuantity, ClearPurchases } from "../Utils/purchases";
import { useState, useEffect } from "react";
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, CreditCard, X } from "lucide-react";

function CartItem({ purchase, onRemove, onUpdateQuantity }) {
    const [imageError, setImageError] = useState(false);

    return (
        <div className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex gap-4">
                {/* Product Image */}
                <Link href={`/Products/${purchase.id}`} className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-100 relative">
                        {!imageError ? (
                            <Image
                                src={`/${purchase.mealName}.jpg`}
                                alt={purchase.mealName || purchase.name}
                                fill
                                className="object-cover"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-green-50">
                                <span className="text-3xl">🥗</span>
                            </div>
                        )}
                    </div>
                </Link>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <Link href={`/Products/${purchase.id}`}>
                                <h3 className="text-lg font-semibold text-gray-900 hover:text-[#7ab530] transition-colors mb-1">
                                    {purchase.mealName || purchase.name}
                                </h3>
                            </Link>
                            <p className="text-sm text-gray-500 mb-2">{purchase.calories} kcal</p>
                            <p className="text-lg font-bold text-[#7ab530]">
                                {((purchase.price || 15) * purchase.quantity).toFixed(2)} TND
                            </p>
                            {purchase.quantity > 1 && (
                                <p className="text-xs text-gray-500 mt-1">
                                    {(purchase.price || 15).toFixed(2)} TND × {purchase.quantity}
                                </p>
                            )}
                        </div>

                        {/* Remove Button */}
                        <button
                            onClick={() => onRemove(purchase.id)}
                            className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Remove item"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 mt-4">
                        <span className="text-sm font-medium text-gray-700">Quantity:</span>
                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                            <button
                                onClick={() => onUpdateQuantity(purchase.id, purchase.quantity - 1)}
                                className="p-2 hover:bg-gray-100 transition-colors rounded-l-lg"
                            >
                                <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="px-4 py-2 text-base font-semibold text-gray-900 min-w-[3rem] text-center">
                                {purchase.quantity}
                            </span>
                            <button
                                onClick={() => onUpdateQuantity(purchase.id, purchase.quantity + 1)}
                                className="p-2 hover:bg-gray-100 transition-colors rounded-r-lg"
                            >
                                <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Purchases() {
    const [purchases, setPurchases] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    const loadPurchases = async () => {
        const purchaseList = await GetPurchases();
        setPurchases(purchaseList);
        const total = purchaseList.reduce((sum, p) => sum + (p.quantity * (p.price || 15)), 0);
        setTotalAmount(total);
    };

    useEffect(() => {
        loadPurchases();

        // Listen for cart changes (localStorage events from other tabs)
        const handleStorageChange = (e) => {
            if (e.key === 'cart') {
                loadPurchases();
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const handleRemovePurchase = async (id) => {
        await RemovePurchase(id);
        await loadPurchases(); // Reload from localStorage
    };

    const handleUpdateQuantity = async (id, newQuantity) => {
        if (newQuantity < 1) {
            await handleRemovePurchase(id);
            return;
        }
        await UpdatePurchaseQuantity(id, newQuantity);
        await loadPurchases(); // Reload from localStorage
    };

    const handleClearAll = async () => {
        if (confirm("Are you sure you want to clear all purchases?")) {
            await ClearPurchases();
            await loadPurchases(); // Reload from localStorage
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Header />

            {/* Top Navigation */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/Products">
                            <button className="flex items-center gap-2 text-gray-600 hover:text-[#7ab530] transition-colors font-medium">
                                <ArrowLeft className="w-4 h-4" />
                                Continue Shopping
                            </button>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 hidden sm:block">Shopping Cart</h1>
                        {purchases.length > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="text-red-500 hover:text-red-600 transition-colors text-sm font-medium flex items-center gap-1"
                            >
                                <X className="w-4 h-4" />
                                Clear All
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {purchases.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                <ShoppingCart className="w-12 h-12 text-gray-400" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
                            <p className="text-gray-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
                            <Link href="/Products">
                                <button className="bg-[#7ab530] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#6aa02b] transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                                    Start Shopping
                                </button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items - Left Side */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Cart Items ({purchases.reduce((sum, p) => sum + p.quantity, 0)})
                                    </h2>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {purchases.map((purchase) => (
                                        <CartItem
                                            key={purchase.id}
                                            purchase={purchase}
                                            onRemove={handleRemovePurchase}
                                            onUpdateQuantity={handleUpdateQuantity}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary - Right Side */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-24">
                                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    {/* Summary Details */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Subtotal ({purchases.reduce((sum, p) => sum + p.quantity, 0)} items)</span>
                                            <span className="text-gray-900 font-medium">{totalAmount.toFixed(2)} TND</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Shipping</span>
                                            <span className="text-gray-900 font-medium">Free</span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-3">
                                            <div className="flex justify-between">
                                                <span className="text-base font-semibold text-gray-900">Total</span>
                                                <span className="text-xl font-bold text-[#7ab530]">
                                                    {totalAmount.toFixed(2)} TND
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Checkout Button */}
                                    <Link href="/Checkout">
                                        <button className="w-full bg-[#7ab530] text-white py-4 rounded-lg font-bold hover:bg-[#6aa02b] transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2 mt-6">
                                            <CreditCard className="w-5 h-5" />
                                            Proceed to Checkout
                                        </button>
                                    </Link>

                                    {/* Continue Shopping Link */}
                                    <Link href="/Products" className="block">
                                        <button className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:border-[#7ab530] hover:text-[#7ab530] transition-all mt-2">
                                            Continue Shopping
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </main >
    );
}

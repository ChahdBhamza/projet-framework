"use client";

import Link from "next/link";
import Footer from "../Footer";
import Header from "../Header";
import { GetPurchases, ClearPurchases, CreateOrder } from "../Utils/purchases";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, CheckCircle, Lock } from "lucide-react";

export default function Checkout() {
    const router = useRouter();
    const [purchases, setPurchases] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const loadPurchases = async () => {
            const purchaseList = await GetPurchases();
            if (purchaseList.length === 0) {
                router.push("/Purchases");
                return;
            }
            setPurchases(purchaseList);
            const total = purchaseList.reduce((sum, p) => sum + (p.quantity * (p.price || 15)), 0);
            setTotalAmount(total);
            setLoading(false);
        };
        loadPurchases();
    }, [router]);

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || "";
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(" ");
        } else {
            return v;
        }
    };

    const formatExpiryDate = (value) => {
        const v = value.replace(/\D/g, "");
        if (v.length >= 2) {
            return v.substring(0, 2) + "/" + v.substring(2, 4);
        }
        return v;
    };

    const validateForm = () => {
        const newErrors = {};

        if (!cardNumber || cardNumber.replace(/\s/g, "").length < 16) {
            newErrors.cardNumber = "Please enter a valid 16-digit card number";
        }

        if (!cardName || cardName.trim().length < 3) {
            newErrors.cardName = "Please enter cardholder name";
        }

        if (!expiryDate || expiryDate.length < 5) {
            newErrors.expiryDate = "Please enter expiry date (MM/YY)";
        }

        if (!cvv || cvv.length < 3) {
            newErrors.cvv = "Please enter CVV";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setProcessing(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const order = await CreateOrder(purchases, totalAmount);

            if (order) {
                await ClearPurchases();
                setPaymentSuccess(true);
                setProcessing(false);

                setTimeout(() => {
                    router.push("/");
                }, 3000);
            } else {
                setProcessing(false);
                alert("Failed to create order. Please try again.");
            }
        } catch (error) {
            console.error("Payment error:", error);
            setProcessing(false);
            alert("An error occurred during payment. Please try again.");
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-[#7ab530] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading checkout...</p>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    if (paymentSuccess) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-12 h-12 text-[#7ab530]" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
                        <p className="text-gray-600 mb-6">
                            Thank you for your order.
                        </p>
                        <p className="text-sm text-gray-500 mb-8">
                            Total: <span className="font-bold text-[#7ab530]">{totalAmount.toFixed(2)} TND</span>
                        </p>
                        <p className="text-sm text-gray-500">Redirecting...</p>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Header />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <Link href="/Purchases">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-[#7ab530] transition-colors font-medium mb-6">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Cart
                    </button>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT FORM */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Lock className="w-5 h-5 text-[#7ab530]" />
                                <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
                            </div>

                            <form onSubmit={handlePayment} className="space-y-6">

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Card Number
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="1234 5678 9012 3456"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                        maxLength={19}
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-[#7ab530] transition ${errors.cardNumber ? "border-red-500" : "border-gray-300"}`}
                                    />
                                    {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cardholder Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={cardName}
                                        onChange={(e) => setCardName(e.target.value)}
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-[#7ab530] transition ${errors.cardName ? "border-red-500" : "border-gray-300"}`}
                                    />
                                    {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Expiry Date
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            value={expiryDate}
                                            maxLength={5}
                                            onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                                            className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-[#7ab530] transition ${errors.expiryDate ? "border-red-500" : "border-gray-300"}`}
                                        />
                                        {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            CVV
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="123"
                                            value={cvv}
                                            maxLength={3}
                                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                                            className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-[#7ab530] transition ${errors.cvv ? "border-red-500" : "border-gray-300"}`}
                                        />
                                        {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-[#7ab530] text-white py-4 rounded-lg font-bold hover:bg-[#6aa02b] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {processing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5" />
                                            Complete Payment
                                        </>
                                    )}
                                </button>
                            </form>

                        </div>
                    </div>

                    {/* RIGHT SIDE ORDER SUMMARY (FIXED) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-24 h-fit">
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                            </div>

                            {/* Scrollable content */}
                            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">

                                <div className="space-y-3">
                                    {purchases.map((purchase) => (
                                        <div key={purchase.id} className="flex justify-between text-sm">
                                            <div className="flex-1">
                                                <p className="text-gray-900 font-medium">
                                                    {purchase.mealName || purchase.name}
                                                </p>
                                                <p className="text-gray-500 text-xs">
                                                    Qty: {purchase.quantity}
                                                </p>
                                            </div>
                                            <span className="text-gray-900 font-medium ml-4">
                                                {((purchase.price || 15) * purchase.quantity).toFixed(2)} TND
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-200 pt-4 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            Subtotal ({purchases.reduce((sum, p) => sum + p.quantity, 0)} items)
                                        </span>
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

                            </div>
                        </div>
                    </div>

                </div>
            </div>

         
        </main>
    );
}

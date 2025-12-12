"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { apiJson } from "../../Utils/api";
import {
  ShoppingBag,
  Package,
  Clock,
  DollarSign,
  CheckCircle,
  FileText,
  X,
  Scroll,
} from "lucide-react";

export default function AdminOrders() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const isAdmin = typeof window !== "undefined" && user && process.env.NEXT_PUBLIC_ADMIN_EMAIL 
    ? user.email?.toLowerCase()?.trim() === process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase()?.trim()
    : false;

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/Signin");
      return;
    }
    if (!isAdmin) {
      router.push("/Dashboard");
      return;
    }
  }, [user, loading, router, isAdmin]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchAllOrders();
    }
  }, [user, isAdmin]);

  const fetchAllOrders = async () => {
    try {
      setLoadingOrders(true);
      const { apiJson } = await import("../../Utils/api");
      const data = await apiJson("/Api/admin/orders");
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setSelectedOrder(null);
    setShowOrderModal(false);
  };

  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalOrders = orders.length;

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#7ab530] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col lg:ml-0">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={user}
          title="Order History"
        />

        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-[#7ab530]">{totalRevenue.toFixed(2)} TND</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Avg. Order Value</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0} TND
                    </p>
                  </div>
                  <ShoppingBag className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">All Orders</h2>
              
              {loadingOrders ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-[#7ab530] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">No orders found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="border-2 border-gray-200 rounded-xl p-5 hover:border-[#7ab530] hover:shadow-md transition-all cursor-pointer"
                      onClick={() => openOrderModal(order)}
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-[#7ab530] rounded-lg flex items-center justify-center">
                              <Package className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">
                                Order #{order._id.slice(-8).toUpperCase()}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {formatDate(order.orderDate)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <span className="capitalize">{order.paymentStatus}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-left md:text-right">
                          <p className="text-xl font-bold text-[#7ab530] flex items-center gap-1 md:justify-end">
                            <DollarSign className="w-5 h-5" />
                            {order.totalAmount.toFixed(2)} TND
                          </p>
                          <p className="text-sm text-gray-500">{order.items.length} item(s)</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openOrderModal(order);
                            }}
                            className="mt-2 flex items-center gap-1 text-[#7ab530] hover:text-[#6aa02b] text-sm font-medium"
                          >
                            <Scroll className="w-4 h-4" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={closeOrderModal}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#7ab530] rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order #{selectedOrder._id.slice(-8).toUpperCase()}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(selectedOrder.orderDate)}
                  </p>
                </div>
              </div>
              <button
                onClick={closeOrderModal}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-gray-900 capitalize">{selectedOrder.paymentStatus}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-[#7ab530] flex items-center gap-2">
                        <DollarSign className="w-7 h-7" />
                        {selectedOrder.totalAmount.toFixed(2)} TND
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{selectedOrder.items.length} item(s)</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Order Items
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-[#7ab530] transition">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-lg mb-2">
                              {item.mealData?.mealName || "Unknown Meal"}
                            </h4>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p className="flex items-center gap-2">
                                <span className="font-medium">Type:</span>
                                <span className="capitalize">{item.mealData?.mealType}</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <span className="font-medium">Quantity:</span>
                                <span>{item.quantity}</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <span className="font-medium">Unit Price:</span>
                                <span>{item.price.toFixed(2)} TND</span>
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-[#7ab530]">
                              {(item.price * item.quantity).toFixed(2)} TND
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {item.quantity} × {item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeOrderModal}
                className="w-full bg-[#7ab530] text-white py-3 rounded-xl font-semibold hover:bg-[#6aa02b] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Package,
  Loader2,
  FileCheck,
  X,
  Sparkles,
  AlertCircle,
  TrendingUp,
  Database,
  Clock,
  Info,
  Download,
  FileSpreadsheet,
} from "lucide-react";

export default function AdminProducts() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [recentUploads, setRecentUploads] = useState([]);

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
      router.push("/");
      return;
    }
  }, [user, loading, router, isAdmin]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchStats();
      fetchRecentUploads();
    }
  }, [user, isAdmin]);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const { apiJson } = await import("../../Utils/api");
      const data = await apiJson("/Api/admin/summary");
      if (data) {
        setStats({
          totalMeals: data.totalMeals || 0,
          mealTypeDistribution: data.mealTypeDistribution || [],
          recentUploads: data.recentUploads || []
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchRecentUploads = async () => {
    try {
      const { apiJson } = await import("../../Utils/api");
      const data = await apiJson("/Api/admin/uploads?limit=5");
      if (data.success) {
        setRecentUploads(data.uploads || []);
      }
    } catch (error) {
      console.error("Error fetching recent uploads:", error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        setUploadStatus({
          type: "error",
          message: "Please select a CSV file"
        });
        return;
      }
      setSelectedFile(file);
      setUploadStatus(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.name.endsWith('.csv')) {
        setUploadStatus({
          type: "error",
          message: "Please drop a CSV file"
        });
        return;
      }
      setSelectedFile(file);
      setUploadStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus({
        type: "error",
        message: "Please select a file first"
      });
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        throw new Error("Not authenticated");
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      const { apiRequest } = await import("../../Utils/api");
      const res = await apiRequest("/Api/meals/import", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || "Upload failed");
      }

      setUploadStatus({
        type: "success",
        message: data.message || `Successfully imported ${data.imported || 0} meals`,
        details: data.summary,
        errors: data.errors
      });

      // Reset file input and refresh stats
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      // Refresh stats after successful upload
      await fetchStats();
      await fetchRecentUploads();
    } catch (err) {
      setUploadStatus({
        type: "error",
        message: err.message || "Failed to upload file"
      });
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setUploadStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#7ab530] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  if (user && !isAdmin) {
    return (
      <main className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="bg-white shadow-xl rounded-3xl p-8 max-w-md w-full text-center border border-gray-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Restricted Area</h1>
            <p className="text-gray-600 mb-6">This page is only accessible to admin users.</p>
            <Link href="/Dashboard" className="inline-block px-6 py-3 bg-[#7ab530] text-white rounded-xl font-semibold hover:bg-[#6aa02b] transition shadow-md hover:shadow-lg">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const mealTypeCounts = stats?.mealTypeDistribution || [];
  const breakfastCount = mealTypeCounts.find(m => m.type === 'Breakfast')?.count || 0;
  const lunchCount = mealTypeCounts.find(m => m.type === 'Lunch')?.count || 0;
  const dinnerCount = mealTypeCounts.find(m => m.type === 'Dinner')?.count || 0;
  const snackCount = mealTypeCounts.find(m => m.type === 'Snack')?.count || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/Dashboard"
                className="p-2 rounded-lg hover:bg-gray-100 transition"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
                <p className="text-sm text-gray-500">Upload and manage meal products</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  {loadingStats ? (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  ) : null}
                </div>
                <p className="text-xs text-gray-600 mb-1">Total Meals</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loadingStats ? "..." : (stats?.totalMeals || 0)}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2">
                  <Package className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-xs text-gray-600 mb-1">Breakfast</p>
                <p className="text-2xl font-bold text-orange-600">
                  {loadingStats ? "..." : breakfastCount}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2">
                  <Package className="w-5 h-5 text-yellow-600" />
                </div>
                <p className="text-xs text-gray-600 mb-1">Lunch</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {loadingStats ? "..." : lunchCount}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2">
                  <Package className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-xs text-gray-600 mb-1">Dinner</p>
                <p className="text-2xl font-bold text-purple-600">
                  {loadingStats ? "..." : dinnerCount}
                </p>
              </div>
            </div>

            {/* Upload Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#7ab530] to-[#6aa02b] rounded-xl flex items-center justify-center">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Upload Products</h2>
                    <p className="text-sm text-gray-500">Import meals from CSV file</p>
                  </div>
                </div>

                {/* File Drop Zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-10 lg:p-12 transition-all ${
                    dragActive
                      ? "border-[#7ab530] bg-green-50"
                      : selectedFile
                      ? "border-[#7ab530] bg-green-50/30"
                      : "border-gray-300 bg-gray-50/50 hover:border-gray-400"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  
                  {selectedFile ? (
                    <div className="text-center">
                      <div className="w-20 h-20 bg-[#7ab530] rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileCheck className="w-10 h-10 text-white" />
                      </div>
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <FileText className="w-5 h-5 text-[#7ab530]" />
                        <span className="font-semibold text-gray-900 text-lg">{selectedFile.name}</span>
                        <button
                          onClick={clearFile}
                          className="p-1.5 rounded-full hover:bg-gray-200 transition ml-2"
                          title="Remove file"
                        >
                          <X className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                      <label
                        htmlFor="file-upload"
                        className="mt-4 inline-block text-sm text-[#7ab530] hover:text-[#6aa02b] font-medium cursor-pointer underline"
                      >
                        Choose different file
                      </label>
                    </div>
                  ) : (
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Upload className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-gray-900 font-semibold text-lg mb-2">
                        Drop your CSV file here or click to browse
                      </p>
                      <p className="text-sm text-gray-500">
                        CSV files only
                      </p>
                    </label>
                  )}
                </div>

                {/* Upload Button */}
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className="w-full mt-6 px-6 py-4 bg-[#7ab530] text-white rounded-xl hover:bg-[#6aa02b] transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Upload & Import
                    </>
                  )}
                </button>

                {/* Upload Status */}
                {uploadStatus && (
                  <div className={`mt-6 rounded-xl p-5 border-2 ${
                    uploadStatus.type === "success" 
                      ? "bg-green-50 border-green-200" 
                      : "bg-red-50 border-red-200"
                  }`}>
                    <div className="flex items-start gap-3">
                      {uploadStatus.type === "success" ? (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className={`font-semibold mb-3 ${
                          uploadStatus.type === "success" ? "text-green-900" : "text-red-900"
                        }`}>
                          {uploadStatus.message}
                        </p>
                        {uploadStatus.details && (
                          <div className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
                            <p className="text-sm font-semibold text-gray-700 mb-3">Import Summary:</p>
                            <div className="grid grid-cols-4 gap-3">
                              {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => (
                                <div key={type} className="text-center p-3 bg-gray-50 rounded-lg">
                                  <p className="text-xs text-gray-600 capitalize mb-1">{type}</p>
                                  <p className="text-xl font-bold text-[#7ab530]">
                                    {uploadStatus.details[type] || 0}
                                  </p>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <p className="text-base font-bold text-gray-900 text-center">
                                Total: {uploadStatus.details.total || 0} meals imported
                              </p>
                            </div>
                          </div>
                        )}
                        {uploadStatus.errors && uploadStatus.errors.length > 0 && (
                          <div className="bg-white rounded-lg p-4 border border-red-200">
                            <p className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" />
                              Errors ({uploadStatus.errors.length}):
                            </p>
                            <div className="max-h-40 overflow-y-auto">
                              <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                                {uploadStatus.errors.slice(0, 10).map((error, idx) => (
                                  <li key={idx}>{error}</li>
                                ))}
                                {uploadStatus.errors.length > 10 && (
                                  <li className="font-semibold">
                                    ... and {uploadStatus.errors.length - 10} more errors
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Info & Recent Uploads */}
          <div className="space-y-6">
            {/* CSV Format Guide */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">CSV Format</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Required Columns:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#7ab530] rounded-full"></span>
                      mealName
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#7ab530] rounded-full"></span>
                      mealType (Breakfast/Lunch/Dinner/Snack)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#7ab530] rounded-full"></span>
                      calories, price
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      protein, carbs, fats, fiber, sugar
                    </li>
                  </ul>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>First row should contain headers</span>
                </div>
              </div>
            </div>

            {/* Recent Uploads */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Recent Uploads</h3>
                </div>
              </div>
              {recentUploads.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No uploads yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentUploads.map((upload) => (
                    <div
                      key={upload._id || upload.id}
                      className="border border-gray-200 rounded-lg p-3 hover:border-[#7ab530] hover:shadow-sm transition"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {upload.fileName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(upload.createdAt)}
                          </p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                          upload.errorCount > 0 
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-green-100 text-green-800"
                        }`}>
                          {upload.importedCount}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>{upload.totalRows} rows</span>
                        {upload.errorCount > 0 && (
                          <span className="text-red-600">{upload.errorCount} errors</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            
          </div>
        </div>
      </main>
    </div>
  );
}

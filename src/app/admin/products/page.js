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
  AlertCircle,
  ArrowLeft,
  Calendar,
  User,
  Package,
  Loader2,
  Download,
} from "lucide-react";

export default function AdminProducts() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [recentUploads, setRecentUploads] = useState([]);
  const [loadingUploads, setLoadingUploads] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

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
      fetchUploadHistory();
    }
  }, [user, isAdmin]);

  const fetchUploadHistory = async () => {
    try {
      setLoadingUploads(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        throw new Error("Not authenticated");
      }

      const res = await fetch("/api/admin/uploads?limit=10", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Failed to fetch upload history");
      }

      const data = await res.json();
      setRecentUploads(data.uploads || []);
    } catch (err) {
      console.error("Error fetching upload history:", err);
      setUploadStatus({
        type: "error",
        message: "Failed to load upload history"
      });
    } finally {
      setLoadingUploads(false);
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

      const res = await fetch("/api/meals/import", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
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

      // Reset file input
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Refresh upload history
      await fetchUploadHistory();
    } catch (err) {
      setUploadStatus({
        type: "error",
        message: err.message || "Failed to upload file"
      });
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

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

  if (user && !isAdmin) {
    return (
      <main className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">Restricted Area</h1>
            <p className="text-gray-600 mb-4">This page is only accessible to admin users.</p>
            <Link href="/Dashboard" className="inline-block mt-4 px-6 py-2 bg-[#7ab530] text-white rounded-lg hover:bg-[#6aa02b] transition">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/Dashboard"
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Product Management</h1>
              <p className="text-sm text-gray-500">Upload and manage meal products</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#7ab530]" />
              Upload CSV File
            </h2>

            <div className="space-y-4">
              {/* File Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select CSV File
                </label>
                <div className="flex items-center gap-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex-1 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#7ab530] transition text-center"
                  >
                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="w-5 h-5 text-[#7ab530]" />
                        <span className="text-sm font-medium text-gray-900">{selectedFile.name}</span>
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <Upload className="w-6 h-6 mx-auto mb-2" />
                        <p className="text-sm">Click to select CSV file</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="w-full px-6 py-3 bg-[#7ab530] text-white rounded-lg hover:bg-[#6aa02b] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload & Import
                  </>
                )}
              </button>

              {/* Upload Status */}
              {uploadStatus && (
                <div className={`p-4 rounded-lg ${
                  uploadStatus.type === "success" 
                    ? "bg-green-50 border border-green-200" 
                    : "bg-red-50 border border-red-200"
                }`}>
                  <div className="flex items-start gap-3">
                    {uploadStatus.type === "success" ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        uploadStatus.type === "success" ? "text-green-800" : "text-red-800"
                      }`}>
                        {uploadStatus.message}
                      </p>
                      {uploadStatus.details && (
                        <div className="mt-2 text-xs text-gray-600">
                          <p>Breakfast: {uploadStatus.details.breakfast || 0}</p>
                          <p>Lunch: {uploadStatus.details.lunch || 0}</p>
                          <p>Dinner: {uploadStatus.details.dinner || 0}</p>
                          <p>Snack: {uploadStatus.details.snack || 0}</p>
                          <p className="font-medium mt-1">Total: {uploadStatus.details.total || 0} meals</p>
                        </div>
                      )}
                      {uploadStatus.errors && uploadStatus.errors.length > 0 && (
                        <div className="mt-2 text-xs text-red-600">
                          <p className="font-medium">Errors ({uploadStatus.errors.length}):</p>
                          <ul className="list-disc list-inside mt-1">
                            {uploadStatus.errors.slice(0, 5).map((error, idx) => (
                              <li key={idx}>{error}</li>
                            ))}
                            {uploadStatus.errors.length > 5 && (
                              <li>... and {uploadStatus.errors.length - 5} more</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* CSV Format Info */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">CSV Format Requirements:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Headers: mealName, mealType, tags, calories, price, protein, carbs, fats, fiber, sugar</li>
                      <li>mealType must be: Breakfast, Lunch, Dinner, or Snack</li>
                      <li>tags should be comma-separated (e.g., "gluten-free, low-fat")</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Uploads */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#7ab530]" />
              Recent Uploads
            </h2>

            {loadingUploads ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-[#7ab530]" />
              </div>
            ) : recentUploads.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No uploads yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentUploads.map((upload) => (
                  <div
                    key={upload.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-[#7ab530] transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Package className="w-4 h-4 text-gray-400" />
                          <h3 className="font-medium text-gray-900 truncate">{upload.fileName}</h3>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{upload.uploadedBy}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(upload.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        upload.errorCount > 0 
                          ? "bg-yellow-100 text-yellow-800" 
                          : "bg-green-100 text-green-800"
                      }`}>
                        {upload.importedCount} imported
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-gray-600">Total Rows</p>
                        <p className="font-semibold text-gray-900">{upload.totalRows}</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-gray-600">Errors</p>
                        <p className="font-semibold text-red-600">{upload.errorCount}</p>
                      </div>
                    </div>

                    {upload.summary && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs font-medium text-gray-700 mb-2">Summary:</p>
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <div>
                            <p className="text-gray-600">Breakfast</p>
                            <p className="font-semibold">{upload.summary.breakfast || 0}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Lunch</p>
                            <p className="font-semibold">{upload.summary.lunch || 0}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Dinner</p>
                            <p className="font-semibold">{upload.summary.dinner || 0}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Snack</p>
                            <p className="font-semibold">{upload.summary.snack || 0}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}


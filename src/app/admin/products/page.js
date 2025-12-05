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
} from "lucide-react";

export default function AdminProducts() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

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
      const res = await apiRequest("/api/meals/import", {
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

      // Reset file input
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Simple Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/Dashboard"
              className="p-2 rounded-lg hover:bg-gray-100 transition"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Add Products</h1>
              <p className="text-sm text-gray-500">Upload CSV file to import meals</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 lg:p-8">
        {/* Upload Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-8">
            {/* File Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-12 transition-all ${
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

            {/* Simple Info */}
            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>CSV Format:</strong> mealName, mealType (Breakfast/Lunch/Dinner/Snack), calories, price, protein, carbs, fats, fiber, sugar
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

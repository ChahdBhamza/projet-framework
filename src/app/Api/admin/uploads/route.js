import { NextResponse } from "next/server";
import { connectDB } from "../../../../../db.js";
import UploadHistory from "../../../../../models/uploadHistory.js";
import { verifyToken } from "../../utils/auth.js";

export async function GET(request) {
  try {
    // Verify authentication
    const authResult = verifyToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { message: "Unauthorized", error: authResult.error },
        { status: authResult.status }
      );
    }

    // Verify admin permissions
    const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (!ADMIN_EMAIL) {
      return NextResponse.json(
        { message: "Admin email not configured", error: "Server configuration error" },
        { status: 500 }
      );
    }

    const userEmail = authResult.email?.toLowerCase()?.trim();
    const adminEmail = ADMIN_EMAIL.toLowerCase().trim();
    
    if (userEmail !== adminEmail) {
      return NextResponse.json(
        { message: "Forbidden", error: "Admin access required" },
        { status: 403 }
      );
    }

    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 20;
    const page = parseInt(searchParams.get("page")) || 1;
    const skip = (page - 1) * limit;

    // Fetch upload history
    const uploads = await UploadHistory.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await UploadHistory.countDocuments({});

    return NextResponse.json({
      success: true,
      uploads: uploads.map(upload => ({
        id: upload._id,
        fileName: upload.fileName,
        uploadedBy: upload.uploadedBy,
        totalRows: upload.totalRows,
        importedCount: upload.importedCount,
        errorCount: upload.errorCount,
        errors: upload.errors,
        summary: upload.summary,
        createdAt: upload.createdAt,
        updatedAt: upload.updatedAt
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching upload history:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Server error", 
        details: error?.message || "Unknown error",
        error: error.toString()
      },
      { status: 500 }
    );
  }
}


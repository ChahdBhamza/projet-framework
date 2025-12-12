import { NextResponse } from "next/server";
import { connectDB } from '@/backend/db.js';
import ActivityLog from '@/backend/models/activityLog.js';
import { verifyToken } from "../../utils/auth.js";

// GET - Get activity logs for admin
export async function GET(request) {
    try {
        await connectDB();

        const authResult = verifyToken(request);
        if (authResult.error) {
            return NextResponse.json(
                { success: false, error: authResult.error },
                { status: authResult.status }
            );
        }

        // Verify admin
        const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        if (!ADMIN_EMAIL) {
            return NextResponse.json(
                { success: false, error: 'Admin email not configured' },
                { status: 500 }
            );
        }

        const userEmail = authResult.email?.toLowerCase()?.trim();
        const adminEmail = ADMIN_EMAIL?.toLowerCase()?.trim();
        
        if (userEmail !== adminEmail) {
            return NextResponse.json(
                { success: false, error: 'Admin access required' },
                { status: 403 }
            );
        }

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit")) || 50;
        const page = parseInt(searchParams.get("page")) || 1;
        const skip = (page - 1) * limit;
        const action = searchParams.get("action");

        // Build query
        const query = { userEmail: adminEmail };
        if (action) {
            query.action = action;
        }

        // Fetch activity logs
        const logs = await ActivityLog.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .lean();

        const total = await ActivityLog.countDocuments(query);

        return NextResponse.json({
            success: true,
            logs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST - Create a new activity log
export async function POST(request) {
    try {
        await connectDB();

        const authResult = verifyToken(request);
        if (authResult.error) {
            return NextResponse.json(
                { success: false, error: authResult.error },
                { status: authResult.status }
            );
        }

        const { action, description, metadata } = await request.json();

        if (!action || !description) {
            return NextResponse.json(
                { success: false, error: 'Action and description are required' },
                { status: 400 }
            );
        }

        // Get IP and user agent from headers
        const ipAddress = request.headers.get('x-forwarded-for') || 
                         request.headers.get('x-real-ip') || 
                         'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';

        const log = await ActivityLog.create({
            userId: authResult.userId,
            userEmail: authResult.email,
            action,
            description,
            metadata: metadata || {},
            ipAddress,
            userAgent
        });

        return NextResponse.json({
            success: true,
            log
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating activity log:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}



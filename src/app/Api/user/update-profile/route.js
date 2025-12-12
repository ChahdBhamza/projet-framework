import { connectDB } from '@/backend/db.js';
import Users from '@/backend/models/users.js';
import ActivityLog from '@/backend/models/activityLog.js';
import { NextResponse } from 'next/server';
import { verifyToken } from '../../utils/auth.js';
import jwt from 'jsonwebtoken';

export async function PUT(request) {
    try {
        await connectDB();

        const authResult = verifyToken(request);
        if (authResult.error) {
            return NextResponse.json(
                { success: false, error: authResult.error },
                { status: authResult.status }
            );
        }

        const { name } = await request.json();

        if (!name || name.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: 'Name is required' },
                { status: 400 }
            );
        }

        if (name.trim().length < 2) {
            return NextResponse.json(
                { success: false, error: 'Name must be at least 2 characters long' },
                { status: 400 }
            );
        }

        // Find and update user
        const user = await Users.findByIdAndUpdate(
            authResult.userId,
            { name: name.trim() },
            { new: true }
        );

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        // Generate a new JWT token with updated user data
        const newToken = jwt.sign(
            { 
                id: user._id.toString(), 
                email: user.email, 
                name: user.name,
                provider: user.provider || 'local'
            },
            process.env.JWT_SECRET,
            { expiresIn: "30m" }
        );

        // Log activity for admin users
        try {
            const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
            const userEmail = authResult.email?.toLowerCase()?.trim();
            const adminEmail = ADMIN_EMAIL?.toLowerCase()?.trim();
            
            if (ADMIN_EMAIL && userEmail === adminEmail) {
                const ipAddress = request.headers.get('x-forwarded-for') || 
                                 request.headers.get('x-real-ip') || 
                                 'unknown';
                const userAgent = request.headers.get('user-agent') || 'unknown';
                
                await ActivityLog.create({
                    userId: authResult.userId,
                    userEmail: authResult.email,
                    action: 'profile_update',
                    description: `Updated profile name to: ${user.name}`,
                    metadata: {
                        newName: user.name
                    },
                    ipAddress,
                    userAgent
                });
            }
        } catch (logError) {
            console.error('Error logging activity:', logError);
            // Don't fail the request if logging fails
        }

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                name: user.name,
                email: user.email
            },
            token: newToken // Return new token with updated name
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}



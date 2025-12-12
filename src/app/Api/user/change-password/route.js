import { connectDB } from '@/backend/db.js';
import Users from '@/backend/models/users.js';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { verifyToken } from '../../utils/auth.js';

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

        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { success: false, error: 'Current password and new password are required' },
                { status: 400 }
            );
        }

        // Validate new password strength
        if (newPassword.trim().length < 6) {
            return NextResponse.json(
                { success: false, error: 'New password must be at least 6 characters long' },
                { status: 400 }
            );
        }

        // Find user
        const user = await Users.findById(authResult.userId);
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        // Check if user has a password (OAuth users don't have passwords)
        if (!user.password) {
            return NextResponse.json(
                { success: false, error: 'This account was created with Google. Password change is not available.' },
                { status: 400 }
            );
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, error: 'Current password is incorrect' },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);

        // Update password
        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Error changing password:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}



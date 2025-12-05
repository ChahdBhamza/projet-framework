import { connectDB } from '../../../../../db.js';
import Users from '../../../../../models/users.js';
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


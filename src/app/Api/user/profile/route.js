import { connectDB } from '../../../../../db.js';
import Users from '../../../../../models/users.js';
import { NextResponse } from 'next/server';
import { verifyToken } from '../../utils/auth.js';

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

        // Fetch user from database
        const user = await Users.findById(authResult.userId).select('name email profilePicture provider');

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture || null,
                provider: user.provider || 'local'
            }
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch user profile' },
            { status: 500 }
        );
    }
}


import { connectDB } from '../../../../../db.js';
import Users from '../../../../../models/users.js';
import { NextResponse } from 'next/server';
import { verifyToken } from '../../utils/auth.js';
import jwt from 'jsonwebtoken';

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

        const formData = await request.formData();
        const file = formData.get('profilePicture');

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { success: false, error: 'File must be an image' },
                { status: 400 }
            );
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { success: false, error: 'Image size must be less than 5MB' },
                { status: 400 }
            );
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = buffer.toString('base64');
        const dataUrl = `data:${file.type};base64,${base64Image}`;

        // Update user profile picture
        const user = await Users.findByIdAndUpdate(
            authResult.userId,
            { profilePicture: dataUrl },
            { new: true }
        );

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        // Generate a new JWT token with updated user data (without profile picture to avoid token size issues)
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
            message: 'Profile picture updated successfully',
            profilePicture: user.profilePicture
        });
    } catch (error) {
        console.error('Error updating profile picture:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to update profile picture' },
            { status: 500 }
        );
    }
}


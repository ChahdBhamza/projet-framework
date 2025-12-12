import { connectDB } from '@/backend/db.js';
import favorites from '@/backend/models/favorites.js';
import { NextResponse } from 'next/server';
import { verifyToken } from '../utils/auth.js';

// GET - Get all favorites for the authenticated user
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

        const userFavorites = await favorites.find({ userId: authResult.userId }).lean();
        const favoriteIds = userFavorites.map(fav => fav.mealId);

        return NextResponse.json({
            success: true,
            favorites: favoriteIds
        });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST - Add a favorite
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

        const { mealId } = await request.json();

        if (!mealId) {
            return NextResponse.json(
                { success: false, error: 'Meal ID is required' },
                { status: 400 }
            );
        }

        // Check if favorite already exists
        const existing = await favorites.findOne({
            userId: authResult.userId,
            mealId: mealId
        });

        if (existing) {
            return NextResponse.json({
                success: true,
                message: 'Favorite already exists',
                favorite: existing
            });
        }

        const favorite = await favorites.create({
            userId: authResult.userId,
            mealId: mealId
        });

        return NextResponse.json({
            success: true,
            message: 'Favorite added successfully',
            favorite
        }, { status: 201 });
    } catch (error) {
        console.error('Error adding favorite:', error);
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, error: 'Favorite already exists' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// DELETE - Remove a favorite
export async function DELETE(request) {
    try {
        await connectDB();

        const authResult = verifyToken(request);
        if (authResult.error) {
            return NextResponse.json(
                { success: false, error: authResult.error },
                { status: authResult.status }
            );
        }

        const { searchParams } = new URL(request.url);
        const mealId = searchParams.get('mealId');

        if (!mealId) {
            return NextResponse.json(
                { success: false, error: 'Meal ID is required' },
                { status: 400 }
            );
        }

        const result = await favorites.findOneAndDelete({
            userId: authResult.userId,
            mealId: mealId
        });

        if (!result) {
            return NextResponse.json(
                { success: false, error: 'Favorite not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Favorite removed successfully'
        });
    } catch (error) {
        console.error('Error removing favorite:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}



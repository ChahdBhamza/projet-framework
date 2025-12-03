import { connectDB } from '../../../../db.js';
import purchases from '../../../../models/purchases.js';
import { NextResponse } from 'next/server';
import { verifyToken } from '../utils/auth.js';

// GET - Get all purchases for the authenticated user
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

        const userPurchases = await purchases.find({ userId: authResult.userId })
            .sort({ createdAt: -1 })
            .lean();

        // Transform to match the expected format
        const formattedPurchases = userPurchases.map(purchase => ({
            id: purchase.mealId,
            ...purchase.mealData,
            quantity: purchase.quantity,
            purchaseDate: purchase.purchaseDate
        }));

        return NextResponse.json({
            success: true,
            purchases: formattedPurchases
        });
    } catch (error) {
        console.error('Error fetching purchases:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST - Add or update a purchase
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

        const { mealId, mealData } = await request.json();

        if (!mealId || !mealData) {
            return NextResponse.json(
                { success: false, error: 'Meal ID and meal data are required' },
                { status: 400 }
            );
        }

        // Check if purchase already exists
        const existing = await purchases.findOne({
            userId: authResult.userId,
            mealId: mealId
        });

        if (existing) {
            // Increase quantity
            existing.quantity += 1;
            await existing.save();
            return NextResponse.json({
                success: true,
                message: 'Purchase quantity updated',
                purchase: existing
            });
        } else {
            // Create new purchase
            const purchase = await purchases.create({
                userId: authResult.userId,
                mealId: mealId,
                mealData: mealData,
                quantity: 1,
                purchaseDate: new Date()
            });

            return NextResponse.json({
                success: true,
                message: 'Purchase added successfully',
                purchase
            }, { status: 201 });
        }
    } catch (error) {
        console.error('Error adding purchase:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// PUT - Update purchase quantity
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

        const { mealId, quantity } = await request.json();

        if (!mealId || quantity === undefined) {
            return NextResponse.json(
                { success: false, error: 'Meal ID and quantity are required' },
                { status: 400 }
            );
        }

        if (quantity < 1) {
            return NextResponse.json(
                { success: false, error: 'Quantity must be at least 1' },
                { status: 400 }
            );
        }

        const purchase = await purchases.findOneAndUpdate(
            { userId: authResult.userId, mealId: mealId },
            { quantity: quantity },
            { new: true }
        );

        if (!purchase) {
            return NextResponse.json(
                { success: false, error: 'Purchase not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Purchase quantity updated',
            purchase
        });
    } catch (error) {
        console.error('Error updating purchase:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// DELETE - Remove a purchase
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

        const result = await purchases.findOneAndDelete({
            userId: authResult.userId,
            mealId: mealId
        });

        if (!result) {
            return NextResponse.json(
                { success: false, error: 'Purchase not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Purchase removed successfully'
        });
    } catch (error) {
        console.error('Error removing purchase:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}


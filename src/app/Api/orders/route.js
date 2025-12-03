import { connectDB } from '../../../../db.js';
import orders from '../../../../models/orders.js';
import { NextResponse } from 'next/server';
import { verifyToken } from '../utils/auth.js';

// POST - Create a new order after payment
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

        const { items, totalAmount } = await request.json();

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Order items are required' },
                { status: 400 }
            );
        }

        if (!totalAmount || totalAmount <= 0) {
            return NextResponse.json(
                { success: false, error: 'Valid total amount is required' },
                { status: 400 }
            );
        }

        // Format items for order
        const orderItems = items.map(item => ({
            mealId: item.id || item._id,
            mealData: {
                mealName: item.mealName || item.name,
                mealType: item.mealType,
                calories: item.calories,
                price: item.price,
                tags: item.tags
            },
            quantity: item.quantity,
            price: item.price || 15
        }));

        // Create order
        const order = await orders.create({
            userId: authResult.userId,
            items: orderItems,
            totalAmount: totalAmount,
            paymentStatus: 'completed',
            orderDate: new Date()
        });

        return NextResponse.json({
            success: true,
            message: 'Order created successfully',
            order: {
                id: order._id,
                totalAmount: order.totalAmount,
                orderDate: order.orderDate,
                itemsCount: order.items.length
            }
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// GET - Get all orders for the authenticated user
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

        const userOrders = await orders.find({ userId: authResult.userId })
            .sort({ orderDate: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            orders: userOrders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}


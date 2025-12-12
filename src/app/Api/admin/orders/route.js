import { connectDB } from '@/backend/db.js';
import orders from '@/backend/models/orders.js';
import Users from '@/backend/models/users.js';
import { NextResponse } from 'next/server';
import { verifyToken } from '../../utils/auth.js';

// GET - Get all orders for admin
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

        // Get all orders
        const allOrders = await orders.find({})
            .sort({ orderDate: -1 })
            .lean();

        // Get user info for each order
        const ordersWithUsers = await Promise.all(
            allOrders.map(async (order) => {
                const user = await Users.findById(order.userId).select('name email').lean();
                return {
                    ...order,
                    userInfo: user ? {
                        name: user.name,
                        email: user.email
                    } : null
                };
            })
        );

        return NextResponse.json({
            success: true,
            orders: ordersWithUsers
        });
    } catch (error) {
        console.error('Error fetching all orders:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}



import { connectDB } from '../../../../../db.js';
import meals from '../../../../../models/meals.js';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        await connectDB();

        const { id } = params;

        const meal = await meals.findById(id).lean();

        if (!meal) {
            return NextResponse.json(
                { success: false, error: 'Meal not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            meal
        });
    } catch (error) {
        console.error('Error fetching meal:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

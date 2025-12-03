import { connectDB } from '../../../../db.js';
import meals from '../../../../models/meals.js';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const mealType = searchParams.get('mealType');
        const calories = searchParams.get('calories');
        const tags = searchParams.get('tags');
        const price = searchParams.get('price');
        const search = searchParams.get('search');

        let query = {};

        // Search filter
        if (search) {
            query.mealName = { $regex: search, $options: 'i' };
        }

        // Filter by meal type
        if (mealType && mealType !== 'All Categories') {
            query.mealType = mealType;
        }

        // Filter by tags
        if (tags && tags !== 'All Categories') {
            query.tags = { $in: [tags.toLowerCase()] };
        }

        // Filter by calories
        if (calories && calories !== 'Any Calories') {
            if (calories === '< 400 kcal') {
                query.calories = { $lt: 400 };
            } else if (calories === '400 - 500 kcal') {
                query.calories = { $gte: 400, $lte: 500 };
            } else if (calories === '> 500 kcal') {
                query.calories = { $gt: 500 };
            }
        }

        // Filter by price
        if (price) {
            const maxPrice = parseInt(price);
            if (!isNaN(maxPrice)) {
                query.price = { $lte: maxPrice };
            }
        }

        const allMeals = await meals.find(query).lean();

        return NextResponse.json({
            success: true,
            meals: allMeals,
            count: allMeals.length
        });
    } catch (error) {
        console.error('Error fetching meals:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

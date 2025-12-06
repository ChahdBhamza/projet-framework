import { connectDB } from '../../../../db.js';
import meals from '../../../../models/meals.js';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const mealType = searchParams.get('mealType');
        const caloriesMin = searchParams.get('caloriesMin');
        const caloriesMax = searchParams.get('caloriesMax');
        const priceMin = searchParams.get('priceMin');
        const priceMax = searchParams.get('priceMax');
        const tags = searchParams.get('tags');
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
            const tagsArray = tags.split(',').map(tag => tag.trim().toLowerCase());
            query.tags = { $in: tagsArray };
        }

        // Filter by calories range
        if (caloriesMin || caloriesMax) {
            query.calories = {};
            if (caloriesMin) query.calories.$gte = parseInt(caloriesMin);
            if (caloriesMax) query.calories.$lte = parseInt(caloriesMax);
        }

        // Filter by price range
        if (priceMin || priceMax) {
            query.price = {};
            if (priceMin) query.price.$gte = parseInt(priceMin);
            if (priceMax) query.price.$lte = parseInt(priceMax);
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

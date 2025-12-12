import { connectDB } from '../../../../../db.js';
import meals from '../../../../../models/meals.js';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const startTime = Date.now();
    let stepTime = startTime;
    
    try {
        console.log('[API] Starting meal fetch request');
        
        // Step 1: Get params
        const paramsStart = Date.now();
        const { id } = await params;
        const paramsTime = Date.now() - paramsStart;
        console.log(`[API] Params extracted in ${paramsTime}ms, ID: ${id}`);
        stepTime = Date.now();

        // Step 2: Connect to DB
        const dbStart = Date.now();
        await connectDB();
        const dbTime = Date.now() - dbStart;
        console.log(`[API] Database connected in ${dbTime}ms`);
        stepTime = Date.now();

        // Step 3: Query meal
        const queryStart = Date.now();
        const meal = await meals.findById(id).lean();
        const queryTime = Date.now() - queryStart;
        console.log(`[API] Meal query completed in ${queryTime}ms`);
        stepTime = Date.now();

        if (!meal) {
            console.log(`[API] Meal not found for ID: ${id}`);
            return NextResponse.json(
                { success: false, error: 'Meal not found' },
                { status: 404 }
            );
        }

        const totalTime = Date.now() - startTime;
        console.log(`[API] Total request time: ${totalTime}ms (Params: ${paramsTime}ms, DB: ${dbTime}ms, Query: ${queryTime}ms)`);

        return NextResponse.json({
            success: true,
            meal
        });
    } catch (error) {
        const totalTime = Date.now() - startTime;
        console.error(`[API] Error fetching meal after ${totalTime}ms:`, error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

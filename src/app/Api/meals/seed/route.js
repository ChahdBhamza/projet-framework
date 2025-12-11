import { connectDB } from '../../../../../db.js';
import meals from '../../../../../models/meals.js';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export async function POST(request) {
    try {
        await connectDB();

        // Path to the CSV file in the root directory
        const csvFilePath = path.join(process.cwd(), 'meals.csv');

        // Check if file exists
        if (!fs.existsSync(csvFilePath)) {
            return NextResponse.json(
                { success: false, error: "meals.csv not found in project root" },
                { status: 404 }
            );
        }

        // Read the CSV file
        const csvFileContent = fs.readFileSync(csvFilePath, 'utf8');

        // Parse CSV content
        const parseResult = Papa.parse(csvFileContent, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true, // Automatically convert numbers
            transformHeader: (header) => {
                // Normalize headers to match model (camelCase, remove units)
                return header.trim().toLowerCase()
                    .replace(/\s+/g, '')              // Remove spaces
                    .replace(/_\w/g, m => m[1].toUpperCase()) // Snake to Camel if needed
                    .replace(/\(g\)/g, '')            // Remove (g)
                    .replace(/\W/g, '');              // Remove non-alphanumeric chars
            }
        });

        if (parseResult.errors.length > 0) {
            console.error('CSV Parsing Errors:', parseResult.errors);
            return NextResponse.json(
                { success: false, error: "CSV parsing failed", details: parseResult.errors },
                { status: 400 }
            );
        }

        const parsedMeals = parseResult.data;

        // Transform data to match Mongoose schema
        const mealsToInsert = parsedMeals.map(row => {
            // Handle tags: parse string "tag1, tag2" into array ["tag1", "tag2"]
            let tags = [];
            if (typeof row.tags === 'string') {
                tags = row.tags.split(',')
                    .map(t => t.trim().toLowerCase())
                    .filter(t => t.length > 0)
                    .map(t => t.replace(/\s+/g, '-')); // consistency: "gluten free" -> "gluten-free"
            }

            // Map CSV columns to Schema fields
            // Note: PapaParse dynamicTyping handles number conversion, but we double check
            return {
                mealName: row.mealname || row.name,
                mealType: row.mealtype,
                tags: tags,
                calories: Number(row.calories),
                protein: Number(row.protein),
                carbs: Number(row.carbs),
                fats: Number(row.fats),
                fiber: Number(row.fiber),
                sugar: Number(row.sugar),
                price: row.price || Math.round(Number(row.calories) / 10) // Fallback price logic
            };
        }).filter(m => m.mealName && m.mealType); // Simple validation

        // Clear existing meals
        await meals.deleteMany({});

        // Insert new meals from CSV
        const result = await meals.insertMany(mealsToInsert);

        // Get counts by meal type
        const breakfastCount = await meals.countDocuments({ mealType: 'Breakfast' });
        const lunchCount = await meals.countDocuments({ mealType: 'Lunch' });
        const dinnerCount = await meals.countDocuments({ mealType: 'Dinner' });

        return NextResponse.json({
            success: true,
            message: `Successfully seeded ${result.length} meals from CSV`,
            summary: {
                breakfast: breakfastCount,
                lunch: lunchCount,
                dinner: dinnerCount,
                total: result.length
            }
        });
    } catch (error) {
        console.error('Error seeding meals:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

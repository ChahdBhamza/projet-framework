import { connectDB } from '../../../../../db.js';
import meals from '../../../../../models/meals.js';
import UploadHistory from '../../../../../models/uploadHistory.js';
import { NextResponse } from 'next/server';
import Papa from 'papaparse';
import { verifyToken } from '../../utils/auth.js';

export async function POST(request) {
    try {
        // Verify authentication
        const authResult = verifyToken(request);
        if (authResult.error) {
            return NextResponse.json(
                { success: false, error: "Unauthorized", message: authResult.error },
                { status: authResult.status }
            );
        }

        // Verify admin permissions
        const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        if (!ADMIN_EMAIL) {
            return NextResponse.json(
                { success: false, error: "Admin email not configured" },
                { status: 500 }
            );
        }

        const userEmail = authResult.email?.toLowerCase()?.trim();
        const adminEmail = ADMIN_EMAIL.toLowerCase().trim();
        
        if (userEmail !== adminEmail) {
            return NextResponse.json(
                { success: false, error: "Forbidden", message: "Admin access required" },
                { status: 403 }
            );
        }

        await connectDB();

        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'No file provided' },
                { status: 400 }
            );
        }

        // Read file content
        const text = await file.text();

        // Parse CSV
        const parseResult = Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header) => {
                // Normalize header names (case-insensitive, handle spaces/underscores/parentheses)
                return header.trim().toLowerCase()
                    .replace(/\s+/g, '')
                    .replace(/_/g, '')
                    .replace(/\(g\)/g, '') // Remove "(g)" from column names like "Protein (g)"
                    .replace(/\(/g, '')
                    .replace(/\)/g, '');
            }
        });

        if (parseResult.errors.length > 0) {
            console.error('CSV parsing errors:', parseResult.errors);
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'CSV parsing errors',
                    details: parseResult.errors 
                },
                { status: 400 }
            );
        }

        const csvData = parseResult.data;
        
        if (!csvData || csvData.length === 0) {
            return NextResponse.json(
                { success: false, error: 'CSV file is empty or has no valid data' },
                { status: 400 }
            );
        }

        // Validate and transform CSV data to meal format
        const validMeals = [];
        const errors = [];

        for (let i = 0; i < csvData.length; i++) {
            const row = csvData[i];
            const rowNum = i + 2; // +2 because CSV has header and is 1-indexed

            try {
                // Map CSV columns to meal fields (case-insensitive)
                // After transformHeader, "Meal Name" becomes "mealname", "Protein (g)" becomes "protein", etc.
                const mealName = row.mealname || row.name || row['mealname'] || '';
                const mealType = row.mealtype || row.type || row['mealtype'] || '';
                const tagsStr = row.tags || row.tag || '';
                const calories = parseFloat(row.calories || row.calorie || 0);
                const price = parseFloat(row.price || 0);
                const protein = parseFloat(row.protein || 0);
                const carbs = parseFloat(row.carbs || row.carbohydrates || row.carb || 0);
                const fats = parseFloat(row.fats || row.fat || 0);
                const fiber = parseFloat(row.fiber || 0);
                const sugar = parseFloat(row.sugar || 0);

                // Validation
                if (!mealName) {
                    errors.push(`Row ${rowNum}: Missing mealName`);
                    continue;
                }

                if (!mealType || !['Breakfast', 'Lunch', 'Dinner', 'Snack'].includes(mealType)) {
                    errors.push(`Row ${rowNum}: Invalid mealType. Must be Breakfast, Lunch, Dinner, or Snack`);
                    continue;
                }

                if (isNaN(calories) || calories <= 0) {
                    errors.push(`Row ${rowNum}: Invalid calories value`);
                    continue;
                }

                if (isNaN(protein) || protein < 0) {
                    errors.push(`Row ${rowNum}: Invalid protein value`);
                    continue;
                }

                if (isNaN(carbs) || carbs < 0) {
                    errors.push(`Row ${rowNum}: Invalid carbs value`);
                    continue;
                }

                if (isNaN(fats) || fats < 0) {
                    errors.push(`Row ${rowNum}: Invalid fats value`);
                    continue;
                }

                if (isNaN(fiber) || fiber < 0) {
                    errors.push(`Row ${rowNum}: Invalid fiber value`);
                    continue;
                }

                if (isNaN(sugar) || sugar < 0) {
                    errors.push(`Row ${rowNum}: Invalid sugar value`);
                    continue;
                }

                // Parse tags (comma-separated string or array)
                let tags = [];
                if (tagsStr) {
                    if (Array.isArray(tagsStr)) {
                        tags = tagsStr;
                    } else {
                        // Handle tags with spaces after commas (e.g., "gluten-free, low-fat")
                        tags = tagsStr.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag.length > 0);
                        // Also handle multiple spaces (e.g., "gluten  free" -> "gluten-free")
                        tags = tags.map(tag => tag.replace(/\s+/g, '-'));
                    }
                }

                // Calculate price if not provided (based on calories)
                const finalPrice = price > 0 ? price : Math.round(calories / 10);

                const meal = {
                    mealName: mealName.trim(),
                    mealType: mealType.trim(),
                    tags: tags,
                    calories: calories,
                    price: finalPrice,
                    protein: protein,
                    carbs: carbs,
                    fats: fats,
                    fiber: fiber,
                    sugar: sugar
                };

                validMeals.push(meal);
            } catch (error) {
                errors.push(`Row ${rowNum}: ${error.message}`);
            }
        }

        if (errors.length > 0 && validMeals.length === 0) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'All rows have validation errors',
                    details: errors 
                },
                { status: 400 }
            );
        }

        if (validMeals.length === 0) {
            return NextResponse.json(
                { success: false, error: 'No valid meals found in CSV' },
                { status: 400 }
            );
        }

        // Insert meals into database
        const result = await meals.insertMany(validMeals, { ordered: false });

        // Get counts by meal type
        const breakfastCount = await meals.countDocuments({ mealType: 'Breakfast' });
        const lunchCount = await meals.countDocuments({ mealType: 'Lunch' });
        const dinnerCount = await meals.countDocuments({ mealType: 'Dinner' });
        const snackCount = await meals.countDocuments({ mealType: 'Snack' });

        const summary = {
            breakfast: breakfastCount,
            lunch: lunchCount,
            dinner: dinnerCount,
            snack: snackCount,
            total: await meals.countDocuments()
        };

        // Save upload history
        const uploadHistory = new UploadHistory({
            fileName: file.name,
            uploadedBy: authResult.email || 'Unknown',
            uploadedById: authResult.userId || null,
            totalRows: csvData.length,
            importedCount: result.length,
            errorCount: errors.length,
            errors: errors.length > 0 ? errors.slice(0, 10) : [], // Store first 10 errors
            summary: summary
        });
        await uploadHistory.save();

        return NextResponse.json({
            success: true,
            message: `Successfully imported ${result.length} meals`,
            imported: result.length,
            errors: errors.length > 0 ? errors : undefined,
            summary: summary,
            uploadId: uploadHistory._id
        });
    } catch (error) {
        console.error('Error importing meals from CSV:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}


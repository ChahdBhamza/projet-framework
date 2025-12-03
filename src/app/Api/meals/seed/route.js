import { connectDB } from '../../../../../db.js';
import meals from '../../../../../models/meals.js';
import { NextResponse } from 'next/server';

const mealsData = [
    {
        mealName: "Blueberry Almond Cloud Oats",
        mealType: "Breakfast",
        tags: ["gluten-free", "low-fat"],
        calories: 340,
        protein: 10,
        carbs: 54,
        fats: 11,
        fiber: 8,
        sugar: 19
    },
    {
        mealName: "Savory Herb Egg-White Cups",
        mealType: "Breakfast",
        tags: ["gluten-free", "low-fat", "high-protein"],
        calories: 220,
        protein: 20,
        carbs: 8,
        fats: 10,
        fiber: 2,
        sugar: 3
    },
    {
        mealName: "Tropical Sunrise Smoothie Bowl",
        mealType: "Breakfast",
        tags: ["gluten-free"],
        calories: 360,
        protein: 12,
        carbs: 58,
        fats: 12,
        fiber: 7,
        sugar: 28
    },
    {
        mealName: "Apple-Cinnamon Quinoa Porridge",
        mealType: "Breakfast",
        tags: ["gluten-free", "low-fat"],
        calories: 390,
        protein: 13,
        carbs: 59,
        fats: 12,
        fiber: 6,
        sugar: 15
    },
    {
        mealName: "Matcha Coconut Protein Pancakes",
        mealType: "Breakfast",
        tags: ["gluten-free", "high-protein"],
        calories: 390,
        protein: 24,
        carbs: 38,
        fats: 16,
        fiber: 5,
        sugar: 10
    },
    {
        mealName: "Savory Sweet Potato Waffle Stack",
        mealType: "Breakfast",
        tags: ["gluten-free", "low-fat"],
        calories: 430,
        protein: 13,
        carbs: 57,
        fats: 18,
        fiber: 9,
        sugar: 12
    },
    {
        mealName: "Mango-Chia Overnight Bircher",
        mealType: "Breakfast",
        tags: ["gluten-free", "low-fat"],
        calories: 320,
        protein: 10,
        carbs: 52,
        fats: 9,
        fiber: 8,
        sugar: 17
    },
    {
        mealName: "Mediterranean Egg Skillet Mini-Bake",
        mealType: "Breakfast",
        tags: ["gluten-free", "high-protein"],
        calories: 350,
        protein: 21,
        carbs: 9,
        fats: 25,
        fiber: 2,
        sugar: 3
    },
    {
        mealName: "Ginger-Lime Quinoa Citrus Bowl",
        mealType: "Breakfast",
        tags: ["gluten-free", "low-fat"],
        calories: 410,
        protein: 14,
        carbs: 78,
        fats: 6,
        fiber: 9,
        sugar: 18
    },
    {
        mealName: "Tomato Basil Egg-White Shakshuka",
        mealType: "Breakfast",
        tags: ["gluten-free", "low-fat", "high-protein"],
        calories: 260,
        protein: 21,
        carbs: 24,
        fats: 5,
        fiber: 4,
        sugar: 7
    },
    {
        mealName: "Spiced Lentil Soup with Lemon Foam",
        mealType: "Lunch",
        tags: ["gluten-free", "low-fat", "high-protein"],
        calories: 320,
        protein: 19,
        carbs: 54,
        fats: 4,
        fiber: 11,
        sugar: 5
    },
    {
        mealName: "Cajun Turkey Power Skillet",
        mealType: "Lunch",
        tags: ["gluten-free", "high-protein"],
        calories: 480,
        protein: 41,
        carbs: 29,
        fats: 18,
        fiber: 5,
        sugar: 6
    },
    {
        mealName: "Miso-Garlic Salmon & Wild Rice Medley",
        mealType: "Lunch",
        tags: ["gluten-free", "high-protein"],
        calories: 560,
        protein: 38,
        carbs: 46,
        fats: 24,
        fiber: 6,
        sugar: 7
    },
    {
        mealName: "Harissa Chicken & Beet Hummus Plate",
        mealType: "Lunch",
        tags: ["gluten-free", "high-protein"],
        calories: 520,
        protein: 44,
        carbs: 35,
        fats: 20,
        fiber: 7,
        sugar: 5
    },
    {
        mealName: "Coffee-Rubbed Steak & Zucchini Ribbons",
        mealType: "Lunch",
        tags: ["gluten-free", "high-protein", "low-carb"],
        calories: 610,
        protein: 48,
        carbs: 18,
        fats: 33,
        fiber: 3,
        sugar: 3
    },
    {
        mealName: "Mediterranean Lemon-Tahini Chicken Bowl",
        mealType: "Lunch",
        tags: ["gluten-free"],
        calories: 510,
        protein: 36,
        carbs: 48,
        fats: 22,
        fiber: 7,
        sugar: 6
    },
    {
        mealName: "Spicy Avocado Shrimp Bowl",
        mealType: "Lunch",
        tags: ["gluten-free", "low-carb"],
        calories: 540,
        protein: 31,
        carbs: 52,
        fats: 22,
        fiber: 8,
        sugar: 7
    },
    {
        mealName: "Roasted Veggie Cashew Curry Plate",
        mealType: "Lunch",
        tags: ["gluten-free", "low-fat", "vegan"],
        calories: 600,
        protein: 18,
        carbs: 72,
        fats: 24,
        fiber: 10,
        sugar: 9
    },
    {
        mealName: "Lime-Garlic Turkey Lettuce Wraps",
        mealType: "Lunch",
        tags: ["gluten-free", "low-carb", "high-protein"],
        calories: 420,
        protein: 33,
        carbs: 16,
        fats: 24,
        fiber: 3,
        sugar: 4
    },
    {
        mealName: "Japanese Eggplant Miso Bowl",
        mealType: "Lunch",
        tags: ["gluten-free", "vegan", "low-fat"],
        calories: 530,
        protein: 16,
        carbs: 66,
        fats: 22,
        fiber: 10,
        sugar: 12
    },
    {
        mealName: "Honey-Ginger Glazed Salmon with Broccolini",
        mealType: "Dinner",
        tags: ["gluten-free", "high-protein"],
        calories: 610,
        protein: 42,
        carbs: 28,
        fats: 38,
        fiber: 4,
        sugar: 10
    },
    {
        mealName: "Coconut-Roasted Vegetable Stir Fry",
        mealType: "Dinner",
        tags: ["gluten-free", "vegan", "low-carb"],
        calories: 450,
        protein: 14,
        carbs: 32,
        fats: 30,
        fiber: 8,
        sugar: 10
    },
    {
        mealName: "Lemon Herb Chicken & Sweet Potato Smash",
        mealType: "Dinner",
        tags: ["gluten-free", "high-protein"],
        calories: 560,
        protein: 39,
        carbs: 43,
        fats: 24,
        fiber: 6,
        sugar: 11
    },
    {
        mealName: "Turmeric Vegetable Quinoa Risotto",
        mealType: "Dinner",
        tags: ["gluten-free", "vegan", "low-fat"],
        calories: 500,
        protein: 17,
        carbs: 62,
        fats: 18,
        fiber: 9,
        sugar: 8
    },
    {
        mealName: "Pomegranate Grilled Salmon Plate",
        mealType: "Dinner",
        tags: ["gluten-free", "high-protein"],
        calories: 580,
        protein: 42,
        carbs: 21,
        fats: 34,
        fiber: 3,
        sugar: 10
    },
    {
        mealName: "Turmeric Coconut Lentil Stew",
        mealType: "Dinner",
        tags: ["gluten-free", "vegan", "high-protein"],
        calories: 490,
        protein: 22,
        carbs: 55,
        fats: 22,
        fiber: 14,
        sugar: 8
    },
    {
        mealName: "Lemon-Herb Seared Cod with Pumpkin Purée",
        mealType: "Dinner",
        tags: ["gluten-free", "high-protein"],
        calories: 510,
        protein: 36,
        carbs: 29,
        fats: 26,
        fiber: 4,
        sugar: 7
    },
    {
        mealName: "Thai Basil Turkey Lettuce Boats",
        mealType: "Dinner",
        tags: ["gluten-free", "high-protein", "low-carb"],
        calories: 430,
        protein: 30,
        carbs: 18,
        fats: 26,
        fiber: 2,
        sugar: 6
    },
    {
        mealName: "Creamy Cashew-Curry Veggie Pasta",
        mealType: "Dinner",
        tags: ["gluten-free", "vegan"],
        calories: 640,
        protein: 20,
        carbs: 78,
        fats: 27,
        fiber: 10,
        sugar: 9
    },
    {
        mealName: "Chimichurri Steak with Sweet Corn Relish",
        mealType: "Dinner",
        tags: ["gluten-free", "high-protein"],
        calories: 680,
        protein: 42,
        carbs: 34,
        fats: 40,
        fiber: 4,
        sugar: 8
    },
    {
        mealName: "Coconut-Lime Chicken with Mango Salsa",
        mealType: "Dinner",
        tags: ["gluten-free", "high-protein"],
        calories: 520,
        protein: 40,
        carbs: 33,
        fats: 26,
        fiber: 5,
        sugar: 17
    },
    {
        mealName: "Roasted Beet Buddha Bowl",
        mealType: "Lunch",
        tags: ["gluten-free", "vegan", "low-fat"],
        calories: 460,
        protein: 17,
        carbs: 58,
        fats: 18,
        fiber: 10,
        sugar: 12
    },
    {
        mealName: "Chili-Lime Shrimp Lettuce Tacos",
        mealType: "Lunch",
        tags: ["gluten-free", "low-carb", "high-protein"],
        calories: 380,
        protein: 28,
        carbs: 14,
        fats: 22,
        fiber: 3,
        sugar: 5
    },
    {
        mealName: "Sweet Potato & Black Bean Harvest Hash",
        mealType: "Lunch",
        tags: ["gluten-free", "vegan", "low-fat"],
        calories: 410,
        protein: 15,
        carbs: 62,
        fats: 10,
        fiber: 12,
        sugar: 11
    },
    {
        mealName: "Creamy Cashew Zoodle Alfredo",
        mealType: "Dinner",
        tags: ["gluten-free", "vegan"],
        calories: 450,
        protein: 14,
        carbs: 20,
        fats: 34,
        fiber: 4,
        sugar: 5
    },
    {
        mealName: "Blueberry Protein Matcha Pancakes",
        mealType: "Breakfast",
        tags: ["gluten-free", "high-protein"],
        calories: 390,
        protein: 24,
        carbs: 38,
        fats: 16,
        fiber: 5,
        sugar: 10
    },
    {
        mealName: "Savory Spinach & Mushroom Quinoa Muffins",
        mealType: "Breakfast",
        tags: ["gluten-free", "vegan", "low-fat"],
        calories: 320,
        protein: 12,
        carbs: 50,
        fats: 8,
        fiber: 6,
        sugar: 9
    },
    {
        mealName: "Pineapple Mint Chia Smoothie",
        mealType: "Breakfast",
        tags: ["gluten-free", "low-fat"],
        calories: 230,
        protein: 8,
        carbs: 42,
        fats: 4,
        fiber: 6,
        sugar: 25
    },
    {
        mealName: "Avocado Lime Shrimp Salad",
        mealType: "Lunch",
        tags: ["gluten-free", "low-carb", "high-protein"],
        calories: 370,
        protein: 29,
        carbs: 16,
        fats: 21,
        fiber: 6,
        sugar: 5
    },
    {
        mealName: "Sesame Tofu Steak with Bok Choy",
        mealType: "Lunch",
        tags: ["gluten-free", "vegan", "low-carb"],
        calories: 340,
        protein: 25,
        carbs: 14,
        fats: 18,
        fiber: 4,
        sugar: 6
    },
    {
        mealName: "Lemon Herb Cod with Garlic Zoodle Nest",
        mealType: "Dinner",
        tags: ["gluten-free", "high-protein", "low-carb"],
        calories: 440,
        protein: 36,
        carbs: 12,
        fats: 28,
        fiber: 3,
        sugar: 4
    },
    {
        mealName: "Creamy Spinach Frittata Cups",
        mealType: "Breakfast",
        tags: ["gluten-free", "high-protein", "low-carb"],
        calories: 300,
        protein: 22,
        carbs: 8,
        fats: 20,
        fiber: 2,
        sugar: 3
    },
    {
        mealName: "Pineapple-Coconut Quinoa Bowl",
        mealType: "Breakfast",
        tags: ["gluten-free", "vegan", "low-fat"],
        calories: 350,
        protein: 11,
        carbs: 52,
        fats: 10,
        fiber: 6,
        sugar: 19
    },
    {
        mealName: "Harissa Chicken & Roasted Veggie Plate",
        mealType: "Lunch",
        tags: ["gluten-free", "high-protein"],
        calories: 520,
        protein: 38,
        carbs: 35,
        fats: 20,
        fiber: 7,
        sugar: 5
    },
    {
        mealName: "Turmeric Coconut Veggie Curry",
        mealType: "Dinner",
        tags: ["gluten-free", "vegan"],
        calories: 500,
        protein: 18,
        carbs: 60,
        fats: 22,
        fiber: 12,
        sugar: 8
    },
    {
        mealName: "Lemon Garlic Grilled Salmon",
        mealType: "Dinner",
        tags: ["gluten-free", "high-protein"],
        calories: 600,
        protein: 42,
        carbs: 25,
        fats: 36,
        fiber: 4,
        sugar: 10
    },
    {
        mealName: "Quinoa & Black Bean Power Bowl",
        mealType: "Lunch",
        tags: ["gluten-free", "vegan", "high-protein"],
        calories: 480,
        protein: 25,
        carbs: 58,
        fats: 14,
        fiber: 12,
        sugar: 7
    },
    {
        mealName: "Coconut Mango Smoothie Bowl",
        mealType: "Breakfast",
        tags: ["gluten-free", "vegan", "low-fat"],
        calories: 330,
        protein: 10,
        carbs: 56,
        fats: 9,
        fiber: 6,
        sugar: 24
    },
    {
        mealName: "Matcha Green Protein Smoothie",
        mealType: "Breakfast",
        tags: ["gluten-free", "high-protein"],
        calories: 290,
        protein: 22,
        carbs: 18,
        fats: 10,
        fiber: 4,
        sugar: 8
    },
    {
        mealName: "Thai Peanut Chicken Bowl",
        mealType: "Lunch",
        tags: ["gluten-free", "high-protein"],
        calories: 540,
        protein: 38,
        carbs: 48,
        fats: 20,
        fiber: 7,
        sugar: 10
    },
    {
        mealName: "Roasted Veggie Zoodle Bowl",
        mealType: "Lunch",
        tags: ["gluten-free", "vegan", "low-carb"],
        calories: 410,
        protein: 14,
        carbs: 22,
        fats: 20,
        fiber: 8,
        sugar: 6
    },
    {
        mealName: "Feta & semi-dried tomato omelette",
        mealType: "Breakfast",
        tags: ["gluten-free"],
        calories: 266,
        protein: 18,
        carbs: 5,
        fats: 20,
        fiber: 1,
        sugar: 1.8
    }
];

export async function POST(request) {
    try {
        await connectDB();

        // Clear existing meals
        await meals.deleteMany({});

        // Add price to meals based on calories
        const mealsWithPrice = mealsData.map(meal => ({
            ...meal,
            price: Math.round(meal.calories / 10)
        }));

        console.log('First meal with price:', mealsWithPrice[0]);

        // Insert all meals
        const result = await meals.insertMany(mealsWithPrice);

        // Get counts by meal type
        const breakfastCount = await meals.countDocuments({ mealType: 'Breakfast' });
        const lunchCount = await meals.countDocuments({ mealType: 'Lunch' });
        const dinnerCount = await meals.countDocuments({ mealType: 'Dinner' });

        return NextResponse.json({
            success: true,
            message: `Successfully inserted ${result.length} meals`,
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

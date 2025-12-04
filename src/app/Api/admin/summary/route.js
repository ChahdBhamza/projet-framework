import { NextResponse } from "next/server";
import { connectDB } from "../../../../../db.js";
import Users from "../../../../../models/users.js";
import orders from "../../../../../models/orders.js";
import meals from "../../../../../models/meals.js";
import favorites from "../../../../../models/favorites.js";
import { verifyToken } from "../../utils/auth.js";

export async function GET(request) {
  try {
    // Verify authentication
    const authResult = verifyToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { message: "Unauthorized", error: authResult.error },
        { status: authResult.status }
      );
    }

    // Verify admin permissions
    const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (!ADMIN_EMAIL) {
      return NextResponse.json(
        { message: "Admin email not configured", error: "Server configuration error" },
        { status: 500 }
      );
    }

    const userEmail = authResult.email?.toLowerCase()?.trim();
    const adminEmail = ADMIN_EMAIL.toLowerCase().trim();
    
    if (userEmail !== adminEmail) {
      return NextResponse.json(
        { message: "Forbidden", error: "Admin access required" },
        { status: 403 }
      );
    }

    await connectDB();

    // Get date ranges
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // User Statistics
    const totalUsers = await Users.countDocuments({});
    const verifiedUsers = await Users.countDocuments({ isEmailVerified: true });
    const usersCreatedToday = await Users.countDocuments({
      createdAt: { $gte: today }
    });
    const usersCreatedLast7Days = await Users.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // User growth over last 7 days
    const userGrowthData = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const count = await Users.countDocuments({
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      });
      
      userGrowthData.push({
        day: dayNames[date.getDay()],
        users: count
      });
    }

    // Order Statistics
    const totalOrders = await orders.countDocuments({});
    const ordersToday = await orders.countDocuments({
      orderDate: { $gte: today }
    });
    const totalRevenue = await orders.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }
        }
      }
    ]);
    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    // Revenue over last 7 days
    const revenueData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const dayRevenue = await orders.aggregate([
        {
          $match: {
            orderDate: { $gte: startOfDay, $lte: endOfDay }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" }
          }
        }
      ]);
      
      revenueData.push({
        day: dayNames[date.getDay()],
        revenue: dayRevenue.length > 0 ? dayRevenue[0].total : 0
      });
    }

    // Meal Statistics
    const totalMeals = await meals.countDocuments({});
    const mealsByType = await meals.aggregate([
      {
        $group: {
          _id: "$mealType",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const popularPlans = mealsByType.map(item => ({
      name: item._id,
      users: item.count,
      value: item.count
    }));

    // Most favorited meals
    const favoriteMeals = await favorites.aggregate([
      {
        $group: {
          _id: "$mealId",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Get meal details for favorites
    const favoriteMealDetails = await Promise.all(
      favoriteMeals.map(async (fav) => {
        try {
          // mealId in favorites is a string, try to find meal by _id
          let meal = null;
          try {
            // Try as ObjectId first
            meal = await meals.findById(fav._id).lean();
          } catch (e) {
            // If that fails, try as string
            meal = await meals.findOne({ _id: fav._id }).lean();
          }
          return {
            mealId: fav._id,
            mealName: meal?.mealName || "Unknown Meal",
            favorites: fav.count
          };
        } catch (err) {
          return {
            mealId: fav._id,
            mealName: "Unknown Meal",
            favorites: fav.count
          };
        }
      })
    );

    // Recent orders (last 5)
    const recentOrders = await orders.find({})
      .sort({ orderDate: -1 })
      .limit(5)
      .populate('userId', 'name email')
      .lean();

    // Popular meal tags
    const tagCounts = {};
    const allMeals = await meals.find({}).lean();
    allMeals.forEach(meal => {
      if (meal.tags && Array.isArray(meal.tags)) {
        meal.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    const popularTags = Object.entries(tagCounts)
      .map(([name, usage]) => ({ name, usage }))
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 5);

    // Calculate active users (users who have made orders or added favorites in last 7 days)
    const activeUserIds = new Set();
    
    try {
      const recentOrderUsers = await orders.distinct('userId', {
        orderDate: { $gte: sevenDaysAgo }
      });
      recentOrderUsers.forEach(id => activeUserIds.add(id.toString()));
    } catch (err) {
      console.error("Error fetching recent order users:", err);
    }
    
    try {
      const recentFavoriteUsers = await favorites.distinct('userId', {
        createdAt: { $gte: sevenDaysAgo }
      });
      recentFavoriteUsers.forEach(id => activeUserIds.add(id.toString()));
    } catch (err) {
      console.error("Error fetching recent favorite users:", err);
    }
    
    const activeUsersToday = activeUserIds.size;

    // Order trends (orders per day for last 7 days)
    const orderTrends = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const count = await orders.countDocuments({
        orderDate: { $gte: startOfDay, $lte: endOfDay }
      });
      
      orderTrends.push({
        day: dayNames[date.getDay()],
        orders: count
      });
    }

    // Top selling meals (by quantity ordered)
    const topSellingMeals = await orders.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.mealId",
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 }
    ]);

    const topSellingMealDetails = await Promise.all(
      topSellingMeals.map(async (item) => {
        try {
          let meal = await meals.findById(item._id).lean();
          if (!meal) {
            meal = await meals.findOne({ _id: item._id }).lean();
          }
          return {
            mealId: item._id,
            mealName: meal?.mealName || "Unknown Meal",
            totalQuantity: item.totalQuantity,
            totalRevenue: item.totalRevenue || 0,
            orderCount: item.orderCount
          };
        } catch (err) {
          return {
            mealId: item._id,
            mealName: "Unknown Meal",
            totalQuantity: item.totalQuantity,
            totalRevenue: item.totalRevenue || 0,
            orderCount: item.orderCount
          };
        }
      })
    );

    // Conversion rate (users who made orders / total users)
    const usersWithOrders = await orders.distinct('userId');
    const conversionRate = totalUsers > 0 ? ((usersWithOrders.length / totalUsers) * 100).toFixed(1) : 0;

    // Repeat customers (users with more than 1 order)
    const repeatCustomers = await orders.aggregate([
      {
        $group: {
          _id: "$userId",
          orderCount: { $sum: 1 }
        }
      },
      {
        $match: { orderCount: { $gt: 1 } }
      }
    ]);
    const repeatCustomerRate = usersWithOrders.length > 0 
      ? ((repeatCustomers.length / usersWithOrders.length) * 100).toFixed(1) 
      : 0;

    // Meal price distribution
    const priceRanges = [
      { min: 0, max: 10, label: "0-10 TND" },
      { min: 10, max: 20, label: "10-20 TND" },
      { min: 20, max: 30, label: "20-30 TND" },
      { min: 30, max: 50, label: "30-50 TND" },
      { min: 50, max: Infinity, label: "50+ TND" }
    ];
    const priceDistribution = priceRanges.map(range => {
      const count = allMeals.filter(meal => {
        const price = meal.price || 0;
        return price >= range.min && price < range.max;
      }).length;
      return { range: range.label, count };
    });

    // Calories distribution
    const calorieRanges = [
      { min: 0, max: 300, label: "0-300" },
      { min: 300, max: 500, label: "300-500" },
      { min: 500, max: 700, label: "500-700" },
      { min: 700, max: 1000, label: "700-1000" },
      { min: 1000, max: Infinity, label: "1000+" }
    ];
    const calorieDistribution = calorieRanges.map(range => {
      const count = allMeals.filter(meal => {
        const calories = meal.calories || 0;
        return calories >= range.min && calories < range.max;
      }).length;
      return { range: range.label, count };
    });

    // User engagement metrics
    const totalFavorites = await favorites.countDocuments({});
    const avgFavoritesPerUser = totalUsers > 0 ? (totalFavorites / totalUsers).toFixed(1) : 0;
    const avgOrdersPerUser = usersWithOrders.length > 0 ? (totalOrders / usersWithOrders.length).toFixed(1) : 0;

    const response = {
      // User stats
      totalUsers,
      verifiedUsers,
      unverifiedUsers: Math.max(totalUsers - verifiedUsers, 0),
      activeUsersToday,
      usersCreatedToday,
      usersCreatedLast7Days,
      userGrowth: userGrowthData,

      // Order stats
      totalOrders,
      ordersToday,
      totalRevenue: revenue,
      revenueData,
      orderTrends,
      recentOrders: recentOrders.map(order => ({
        id: order._id,
        userId: order.userId?._id || order.userId,
        userName: order.userId?.name || "Unknown",
        userEmail: order.userId?.email || "",
        totalAmount: order.totalAmount,
        itemsCount: order.items.length,
        orderDate: order.orderDate,
        paymentStatus: order.paymentStatus
      })),

      // Meal stats
      totalMeals,
      popularPlans,
      popularTags,
      favoriteMeals: favoriteMealDetails,

      // Calculated stats
      averageOrderValue: totalOrders > 0 ? (revenue / totalOrders).toFixed(2) : 0,
      mealsPerUser: totalUsers > 0 ? (totalMeals / totalUsers).toFixed(1) : 0,
      conversionRate,
      repeatCustomerRate,
      repeatCustomersCount: repeatCustomers.length,
      topSellingMeals: topSellingMealDetails,
      priceDistribution,
      calorieDistribution,
      avgFavoritesPerUser,
      avgOrdersPerUser,
      totalFavorites,
      usersWithOrdersCount: usersWithOrders.length
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Admin summary error:", error);
    return NextResponse.json(
      { 
        message: "Server error", 
        details: error?.message || "Unknown error",
        error: error.toString()
      },
      { status: 500 }
    );
  }
}



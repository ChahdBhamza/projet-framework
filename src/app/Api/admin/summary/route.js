import { NextResponse } from "next/server";
import { connectDB } from '@/backend/db.js';
import Users from '@/backend/models/users.js';
import orders from '@/backend/models/orders.js';
import meals from '@/backend/models/meals.js';
import favorites from '@/backend/models/favorites.js';
import UploadHistory from '@/backend/models/uploadHistory.js';
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
    const fourteenDaysAgo = new Date(today);
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

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

    const formatLabel = (date) => {
      const m = date.getMonth() + 1;
      const d = date.getDate();
      return `${m}/${d}`;
    };

    // Revenue over last 14 days
    const revenueData = [];
    for (let i = 13; i >= 0; i--) {
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
        day: formatLabel(date),
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
    const normalizeTag = (tag) => {
      if (!tag || typeof tag !== "string") return null;
      return tag
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");
    };

    const tagCounts = {};
    const allMeals = await meals.find({}).lean();
    allMeals.forEach(meal => {
      if (meal.tags && Array.isArray(meal.tags)) {
        // Normalize and de-duplicate tags per meal
        const normalized = meal.tags
          .map(normalizeTag)
          .filter(Boolean);
        const uniqueTags = Array.from(new Set(normalized));
        uniqueTags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      } else if (typeof meal.tags === "string" && meal.tags.trim().length > 0) {
        // Handle legacy string tags
        const splitTags = meal.tags.split(",").map(normalizeTag).filter(Boolean);
        const uniqueTags = Array.from(new Set(splitTags));
        uniqueTags.forEach(tag => {
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
    for (let i = 13; i >= 0; i--) {
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
        day: formatLabel(date),
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

    // Growth calculations (comparing last 7 days to previous 7 days)
    const previousWeekRevenue = await orders.aggregate([
      {
        $match: {
          orderDate: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }
        }
      }
    ]);
    const prevRevenue = previousWeekRevenue.length > 0 ? previousWeekRevenue[0].total : 0;
    // last 14 days revenue total
    const lastWeekRevenue = revenueData.reduce((sum, day) => sum + (day.revenue || 0), 0);
    const revenueGrowth = prevRevenue > 0 ? (((lastWeekRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1) : 0;

    const previousWeekOrders = await orders.countDocuments({
      orderDate: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo }
    });
    const lastWeekOrders = orderTrends.reduce((sum, day) => sum + (day.orders || 0), 0);
    const ordersGrowth = previousWeekOrders > 0 ? (((lastWeekOrders - previousWeekOrders) / previousWeekOrders) * 100).toFixed(1) : 0;

    const previousWeekUsers = await Users.countDocuments({
      createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo }
    });
    const usersGrowth = previousWeekUsers > 0 ? (((usersCreatedLast7Days - previousWeekUsers) / previousWeekUsers) * 100).toFixed(1) : 0;

    // Recent uploads
    const recentUploads = await UploadHistory.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Meal type distribution
    const mealTypeDistribution = await meals.aggregate([
      {
        $group: {
          _id: "$mealType",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Peak ordering hours (last 30 days)
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const ordersByHour = await orders.aggregate([
      {
        $match: {
          orderDate: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $hour: "$orderDate" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Recent user signups (last 5)
    const recentUsers = await Users.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt isEmailVerified')
      .lean();

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
      usersWithOrdersCount: usersWithOrders.length,

      // Growth metrics
      revenueGrowth: parseFloat(revenueGrowth),
      ordersGrowth: parseFloat(ordersGrowth),
      usersGrowth: parseFloat(usersGrowth),

      // Additional metrics
      recentUploads: recentUploads.map(upload => ({
        fileName: upload.fileName,
        uploadedBy: upload.uploadedBy,
        importedCount: upload.importedCount,
        totalRows: upload.totalRows,
        createdAt: upload.createdAt
      })),
      mealTypeDistribution: mealTypeDistribution.map(item => ({
        type: item._id,
        count: item.count
      })),
      ordersByHour: ordersByHour.map(item => ({
        hour: item._id,
        count: item.count
      })),
      recentUsers: recentUsers.map(user => ({
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        isEmailVerified: user.isEmailVerified
      }))
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




import mongoose from "mongoose";

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return "Already connected to the database";
  }

  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not set");
    }

    // Validate connection string format
    if (!process.env.MONGO_URI.includes("mongodb+srv://") && !process.env.MONGO_URI.includes("mongodb://")) {
      throw new Error("Invalid MongoDB connection string format");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    
    console.log("✅ Successfully connected to MongoDB");
    return "Welcome to the database!";
  } catch (error) {
    console.error("Database connection failed:", error);
    
    // Provide more helpful error messages
    if (error.message.includes("ENOTFOUND") || error.message.includes("querySrv")) {
      throw new Error("Cannot reach MongoDB server. Please check:\n1. Your connection string is correct\n2. Your IP address is whitelisted in MongoDB Atlas\n3. Your internet connection is working");
    }
    
    throw new Error(`Database connection failed: ${error.message}`);
  }
}

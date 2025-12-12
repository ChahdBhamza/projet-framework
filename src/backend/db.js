import mongoose from "mongoose";

// Use a cached connection across lambda invocations to avoid exhausting
// MongoDB connections in serverless environments like Vercel.
const cached = globalThis._mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not set");
  }

  // Validate connection string format
  if (!process.env.MONGO_URI.includes("mongodb+srv://") && !process.env.MONGO_URI.includes("mongodb://")) {
    throw new Error("Invalid MongoDB connection string format");
  }

  try {
    if (!cached.promise) {
      cached.promise = mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      }).then((m) => {
        return m.connection;
      });
    }

    cached.conn = await cached.promise;
    globalThis._mongoose = cached;

    console.log("✅ Successfully connected to MongoDB");
    return cached.conn;
  } catch (error) {
    console.error("Database connection failed:", error);
    if (error.message.includes("ENOTFOUND") || error.message.includes("querySrv")) {
      throw new Error("Cannot reach MongoDB server. Please check:\n1. Your connection string is correct\n2. Your IP address is whitelisted in MongoDB Atlas\n3. Your internet connection is working");
    }
    throw new Error(`Database connection failed: ${error.message}`);
  }
}

import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export function verifyToken(request) {
    try {
        const authHeader = request.headers.get("authorization");
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return { error: "No token provided", status: 401 };
        }

        const token = authHeader.substring(7); // Remove "Bearer " prefix
        
        if (!process.env.JWT_SECRET) {
            return { error: "JWT secret not configured", status: 500 };
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        return { userId: decoded.id, email: decoded.email, name: decoded.name };
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return { error: "Token expired", status: 401 };
        } else if (error.name === "JsonWebTokenError") {
            return { error: "Invalid token", status: 401 };
        }
        return { error: "Token verification failed", status: 401 };
    }
}


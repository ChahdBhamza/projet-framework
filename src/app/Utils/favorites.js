import { apiJson } from './api.js';

// Get all favorites from API
export async function GetFavorites() {
    if (typeof window === "undefined") return [];
    
    const token = localStorage.getItem("token");
    if (!token) return [];

    try {
        const data = await apiJson("/api/favorites");

        return data.success ? data.favorites : [];
    } catch (error) {
        console.error("Error fetching favorites:", error);
        // If session expired, return empty array (redirect handled by apiJson)
        if (error.message && error.message.includes("Session expired")) {
            return [];
        }
        return [];
    }
}

// Add a favorite via API
export async function AddFavorites(id) {
    if (typeof window === "undefined") return;
    
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No authentication token found");
        return;
    }

    try {
        await apiJson("/api/favorites", {
            method: "POST",
            body: JSON.stringify({ mealId: id })
        });
    } catch (error) {
        console.error("Error adding favorite:", error);
        throw error;
    }
}

// Remove a favorite via API
export async function RemoveFavorites(id) {
    if (typeof window === "undefined") return;
    
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No authentication token found");
        return;
    }

    try {
        await apiJson(`/api/favorites?mealId=${id}`, {
            method: "DELETE"
        });
    } catch (error) {
        console.error("Error removing favorite:", error);
        throw error;
    }
}
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
        // Store the return URL and action for after login
        if (!window.location.pathname.includes("/Signin")) {
            const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
            const actionData = JSON.stringify({ action: 'addFavorite', mealId: id });
            localStorage.setItem('pendingAction', actionData);
            window.location.href = `/Signin?reason=loginRequired&message=Please sign in to add items to your favorites&returnUrl=${returnUrl}`;
        }
        throw new Error("Please sign in to add items to your favorites");
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
        // Store the return URL and action for after login
        if (!window.location.pathname.includes("/Signin")) {
            const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
            const actionData = JSON.stringify({ action: 'removeFavorite', mealId: id });
            localStorage.setItem('pendingAction', actionData);
            window.location.href = `/Signin?reason=loginRequired&message=Please sign in to manage your favorites&returnUrl=${returnUrl}`;
        }
        throw new Error("Please sign in to manage your favorites");
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
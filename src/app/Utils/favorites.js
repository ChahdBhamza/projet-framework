// Get authentication token
function getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
}

// Get all favorites from API
export async function GetFavorites() {
    if (typeof window === "undefined") return [];
    
    const token = getToken();
    if (!token) return [];

    try {
        const res = await fetch("/api/favorites", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.ok) {
            const data = await res.json();
            return data.success ? data.favorites : [];
        }
        return [];
    } catch (error) {
        console.error("Error fetching favorites:", error);
        return [];
    }
}

// Add a favorite via API
export async function AddFavorites(id) {
    if (typeof window === "undefined") return;
    
    const token = getToken();
    if (!token) {
        console.error("No authentication token found");
        return;
    }

    try {
        const res = await fetch("/api/favorites", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ mealId: id })
        });

        if (!res.ok) {
            const data = await res.json();
            console.error("Error adding favorite:", data.error);
        }
    } catch (error) {
        console.error("Error adding favorite:", error);
    }
}

// Remove a favorite via API
export async function RemoveFavorites(id) {
    if (typeof window === "undefined") return;
    
    const token = getToken();
    if (!token) {
        console.error("No authentication token found");
        return;
    }

    try {
        const res = await fetch(`/api/favorites?mealId=${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            const data = await res.json();
            console.error("Error removing favorite:", data.error);
        }
    } catch (error) {
        console.error("Error removing favorite:", error);
    }
}
// Centralized API utility with session handling
export async function apiRequest(url, options = {}) {
    if (typeof window === "undefined") {
        throw new Error("API requests can only be made on the client side");
    }

    const token = localStorage.getItem("token");
    
    const defaultHeaders = {};

    // Only set Content-Type for JSON, not for FormData (browser sets it automatically with boundary)
    if (!(options.body instanceof FormData)) {
        defaultHeaders["Content-Type"] = "application/json";
    }

    if (token) {
        defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const res = await fetch(url, config);

        // Handle unauthorized (401) - token expired or invalid
        if (res.status === 401) {
            // Clear token and redirect to signin
            localStorage.removeItem("token");
            
            // Only redirect if not already on signin page
            if (!window.location.pathname.includes("/Signin")) {
                window.location.href = "/Signin?reason=sessionExpired";
            }
            
            throw new Error("Session expired. Please sign in again.");
        }

        // Handle forbidden (403) - insufficient permissions
        if (res.status === 403) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.message || "Access forbidden");
        }

        return res;
    } catch (error) {
        // Re-throw if it's already our custom error
        if (error.message && error.message.includes("Session expired")) {
            throw error;
        }
        
        // Handle network errors
        if (error.name === "TypeError" && error.message.includes("fetch")) {
            throw new Error("Network error. Please check your connection.");
        }
        
        throw error;
    }
}

// Helper to get JSON response with error handling
export async function apiJson(url, options = {}) {
    const res = await apiRequest(url, options);
    
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        const text = await res.text();
        if (!text || text.trim().length === 0) {
            throw new Error("Empty response from server");
        }
        try {
            return JSON.parse(text);
        } catch (parseError) {
            throw new Error(`Invalid JSON response: ${res.status} ${res.statusText}`);
        }
    }
    
    throw new Error(`Unexpected response type: ${res.status} ${res.statusText}`);
}


// Import cart functions for temporary storage
import { GetCart, AddToCart, RemoveFromCart, UpdateCartQuantity, ClearCart, GetCartCount } from './cart.js';

// Get authentication token
function getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
}

// Get all cart items (from localStorage - temporary cart)
export async function GetPurchases() {
    return GetCart();
}

// Add item to cart (localStorage only, not DB)
export async function AddPurchase(mealId, mealData) {
    AddToCart(mealId, mealData);
}

// Remove item from cart
export async function RemovePurchase(mealId) {
    RemoveFromCart(mealId);
}

// Update cart item quantity
export async function UpdatePurchaseQuantity(mealId, quantity) {
    UpdateCartQuantity(mealId, quantity);
}

// Clear cart
export async function ClearPurchases() {
    ClearCart();
}

// Get total cart count
export async function GetPurchasesCount() {
    return GetCartCount();
}

// Create order after payment (saves to DB)
export async function CreateOrder(items, totalAmount) {
    if (typeof window === "undefined") return null;
    
    const token = getToken();
    if (!token) {
        console.error("No authentication token found");
        return null;
    }

    try {
        const res = await fetch("/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ items, totalAmount })
        });

        if (res.ok) {
            const data = await res.json();
            return data.success ? data.order : null;
        } else {
            const data = await res.json();
            console.error("Error creating order:", data.error);
            return null;
        }
    } catch (error) {
        console.error("Error creating order:", error);
        return null;
    }
}


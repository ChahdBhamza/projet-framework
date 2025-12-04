// Import cart functions for temporary storage
import { GetCart, AddToCart, RemoveFromCart, UpdateCartQuantity, ClearCart, GetCartCount } from './cart.js';
import { apiJson } from './api.js';

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
    
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No authentication token found");
        return null;
    }

    try {
        const data = await apiJson("/api/orders", {
            method: "POST",
            body: JSON.stringify({ items, totalAmount })
        });

        return data.success ? data.order : null;
    } catch (error) {
        console.error("Error creating order:", error);
        // If session expired, redirect is handled by apiJson
        return null;
    }
}


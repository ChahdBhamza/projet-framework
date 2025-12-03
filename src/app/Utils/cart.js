// Cart utility functions - uses localStorage for temporary cart storage
// Items are only saved to DB after payment is completed

export function GetCart() {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("cart") || "[]");
}

export function AddToCart(mealId, mealData) {
    if (typeof window === "undefined") return;
    
    const cart = GetCart();
    
    // Check if meal already exists in cart
    const existingIndex = cart.findIndex(item => item.id === mealId);
    
    if (existingIndex >= 0) {
        // If exists, increase quantity
        cart[existingIndex].quantity += 1;
    } else {
        // If new, add with quantity 1
        cart.push({
            id: mealId,
            ...mealData,
            quantity: 1
        });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
}

export function RemoveFromCart(mealId) {
    if (typeof window === "undefined") return;
    const cart = GetCart();
    const updated = cart.filter(item => item.id !== mealId);
    localStorage.setItem("cart", JSON.stringify(updated));
}

export function UpdateCartQuantity(mealId, quantity) {
    if (typeof window === "undefined") return;
    const cart = GetCart();
    const updated = cart.map(item =>
        item.id === mealId ? { ...item, quantity: Math.max(1, quantity) } : item
    );
    localStorage.setItem("cart", JSON.stringify(updated));
}

export function ClearCart() {
    if (typeof window === "undefined") return;
    localStorage.setItem("cart", "[]");
}

export function GetCartCount() {
    if (typeof window === "undefined") return 0;
    const cart = GetCart();
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
}


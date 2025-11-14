// Purchases utility functions
export function GetPurchases(){
    if(typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("purchases") || "[]");
}

export function AddPurchase(mealId, mealData){
    if(typeof window === "undefined") return;
    const purchases = GetPurchases();
    
    // Check if meal already exists in purchases
    const existingIndex = purchases.findIndex(p => p.id === mealId);
    
    if(existingIndex >= 0){
        // If exists, increase quantity
        purchases[existingIndex].quantity += 1;
    } else {
        // If new, add with quantity 1
        purchases.push({
            id: mealId,
            ...mealData,
            quantity: 1,
            purchaseDate: new Date().toISOString()
        });
    }
    
    localStorage.setItem("purchases", JSON.stringify(purchases));
}

export function RemovePurchase(mealId){
    if(typeof window === "undefined") return;
    const purchases = GetPurchases();
    const updated = purchases.filter(p => p.id !== mealId);
    localStorage.setItem("purchases", JSON.stringify(updated));
}

export function UpdatePurchaseQuantity(mealId, quantity){
    if(typeof window === "undefined") return;
    const purchases = GetPurchases();
    const updated = purchases.map(p => 
        p.id === mealId ? { ...p, quantity: Math.max(1, quantity) } : p
    );
    localStorage.setItem("purchases", JSON.stringify(updated));
}

export function ClearPurchases(){
    if(typeof window === "undefined") return;
    localStorage.setItem("purchases", "[]");
}

export function GetPurchasesCount(){
    if(typeof window === "undefined") return 0;
    const purchases = GetPurchases();
    return purchases.reduce((total, p) => total + p.quantity, 0);
}


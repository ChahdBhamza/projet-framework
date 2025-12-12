# API Testing with cURL - Products Page

## Base URL
Replace `http://localhost:3000` with your actual deployment URL (e.g., `https://your-app.vercel.app`)

---

## 1. Get All Meals (Products List)

### Basic Request
```bash
curl -X GET "http://localhost:3000/api/meals" \
  -H "Content-Type: application/json"
```

### With Search Filter
```bash
curl -X GET "http://localhost:3000/api/meals?search=chicken" \
  -H "Content-Type: application/json"
```

### Filter by Meal Type
```bash
curl -X GET "http://localhost:3000/api/meals?mealType=Breakfast" \
  -H "Content-Type: application/json"
```

### Filter by Price Range
```bash
curl -X GET "http://localhost:3000/api/meals?priceMin=10&priceMax=25" \
  -H "Content-Type: application/json"
```

### Filter by Calories Range
```bash
curl -X GET "http://localhost:3000/api/meals?caloriesMin=300&caloriesMax=500" \
  -H "Content-Type: application/json"
```

### Filter by Tags
```bash
curl -X GET "http://localhost:3000/api/meals?tags=gluten-free,high-protein" \
  -H "Content-Type: application/json"
```

### Combined Filters
```bash
curl -X GET "http://localhost:3000/api/meals?mealType=Lunch&priceMin=15&priceMax=30&caloriesMin=400&caloriesMax=600&tags=gluten-free" \
  -H "Content-Type: application/json"
```

---

## 2. Get Single Meal by ID

### Basic Request
```bash
# Replace MEAL_ID with an actual meal ID from your database
curl -X GET "http://localhost:3000/api/meals/MEAL_ID" \
  -H "Content-Type: application/json"
```

### Example with Actual ID Format
```bash
curl -X GET "http://localhost:3000/api/meals/507f1f77bcf86cd799439011" \
  -H "Content-Type: application/json"
```

---

## 3. Pretty Print JSON Response

Add `| jq` to format the JSON output (requires jq installed):

```bash
curl -X GET "http://localhost:3000/api/meals" \
  -H "Content-Type: application/json" | jq
```

Or use Python for pretty printing:

```bash
curl -X GET "http://localhost:3000/api/meals" \
  -H "Content-Type: application/json" | python -m json.tool
```

---

## 4. Test with Verbose Output

See request/response headers and status:

```bash
curl -v -X GET "http://localhost:3000/api/meals" \
  -H "Content-Type: application/json"
```

---

## 5. Test Error Handling

### Invalid Meal ID
```bash
curl -X GET "http://localhost:3000/api/meals/invalid-id-123" \
  -H "Content-Type: application/json"
```

### Expected Response: 404 Not Found
```json
{
  "success": false,
  "error": "Meal not found"
}
```

---

## 6. Test with Authentication (if needed)

If the endpoint requires authentication:

```bash
curl -X GET "http://localhost:3000/api/meals" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 7. Save Response to File

```bash
curl -X GET "http://localhost:3000/api/meals" \
  -H "Content-Type: application/json" \
  -o products-response.json
```

---

## 8. Test Production Deployment

Replace with your actual Vercel/deployment URL:

```bash
curl -X GET "https://your-app.vercel.app/api/meals" \
  -H "Content-Type: application/json"
```

---

## Expected Response Format

### Success Response (All Meals)
```json
{
  "success": true,
  "meals": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "mealName": "Chicken Salad",
      "mealType": "Lunch",
      "tags": ["gluten-free", "high-protein"],
      "calories": 450,
      "price": 20,
      "protein": 35,
      "carbs": 25,
      "fats": 18
    }
  ],
  "count": 1
}
```

### Success Response (Single Meal)
```json
{
  "success": true,
  "meal": {
    "_id": "507f1f77bcf86cd799439011",
    "mealName": "Chicken Salad",
    "mealType": "Lunch",
    "tags": ["gluten-free", "high-protein"],
    "calories": 450,
    "price": 20,
    "protein": 35,
    "carbs": 25,
    "fats": 18
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message here",
  "meals": [],
  "count": 0
}
```

---

## Quick Test Script

Save this as `test-products-api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"

echo "Testing Products API..."
echo ""

echo "1. Get all meals:"
curl -s -X GET "$BASE_URL/api/meals" | jq '.count'
echo ""

echo "2. Search for 'chicken':"
curl -s -X GET "$BASE_URL/api/meals?search=chicken" | jq '.count'
echo ""

echo "3. Filter by Breakfast:"
curl -s -X GET "$BASE_URL/api/meals?mealType=Breakfast" | jq '.count'
echo ""

echo "4. Filter by price range (10-25 TND):"
curl -s -X GET "$BASE_URL/api/meals?priceMin=10&priceMax=25" | jq '.count'
echo ""

echo "Tests completed!"
```

Make it executable:
```bash
chmod +x test-products-api.sh
./test-products-api.sh
```





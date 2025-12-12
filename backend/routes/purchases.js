import express from 'express';
import { requireAuth } from '../utils/auth.js';
import Purchases from '../models/purchases.js';

const router = express.Router();

// Get user purchases
router.get('/', requireAuth, async (req, res) => {
  try {
    const purchases = await Purchases.find({ userId: req.user.userId });
    res.json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ message: 'Failed to fetch purchases' });
  }
});

// Create purchase
router.post('/', requireAuth, async (req, res) => {
  try {
    const { mealPlanId, price } = req.body;

    if (!mealPlanId || !price) {
      return res.status(400).json({ message: 'Meal plan ID and price are required' });
    }

    const purchase = await Purchases.create({
      userId: req.user.userId,
      mealPlanId,
      price,
      purchaseDate: new Date()
    });

    res.status(201).json(purchase);
  } catch (error) {
    console.error('Error creating purchase:', error);
    res.status(500).json({ message: 'Failed to create purchase' });
  }
});

export default router;

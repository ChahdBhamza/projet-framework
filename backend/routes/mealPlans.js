import express from 'express';
import { requireAuth } from '../utils/auth.js';
import MealPlans from '../models/mealPlans.js';

const router = express.Router();

// Get all meal plans
router.get('/', async (req, res) => {
  try {
    const plans = await MealPlans.find().limit(100);
    res.json(plans);
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    res.status(500).json({ message: 'Failed to fetch meal plans' });
  }
});

// Get user meal plans
router.get('/user/my-plans', requireAuth, async (req, res) => {
  try {
    const plans = await MealPlans.find({ userId: req.user.userId });
    res.json(plans);
  } catch (error) {
    console.error('Error fetching user plans:', error);
    res.status(500).json({ message: 'Failed to fetch meal plans' });
  }
});

// Create meal plan
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, meals, duration, price } = req.body;

    if (!name || !meals) {
      return res.status(400).json({ message: 'Name and meals are required' });
    }

    const plan = await MealPlans.create({
      userId: req.user.userId,
      name,
      meals,
      duration,
      price
    });

    res.status(201).json(plan);
  } catch (error) {
    console.error('Error creating meal plan:', error);
    res.status(500).json({ message: 'Failed to create meal plan' });
  }
});

export default router;

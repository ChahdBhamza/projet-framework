import express from 'express';
import { requireAuth } from '../utils/auth.js';
import Meals from '../models/meals.js';

const router = express.Router();

// Get all meals
router.get('/', async (req, res) => {
  try {
    const meals = await Meals.find().limit(100);
    res.json(meals);
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({ message: 'Failed to fetch meals' });
  }
});

// Get meal by ID
router.get('/:id', async (req, res) => {
  try {
    const meal = await Meals.findById(req.params.id);
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    res.json(meal);
  } catch (error) {
    console.error('Error fetching meal:', error);
    res.status(500).json({ message: 'Failed to fetch meal' });
  }
});

// Create meal (admin only)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const meal = await Meals.create({
      name,
      description,
      price,
      image,
      category
    });

    res.status(201).json(meal);
  } catch (error) {
    console.error('Error creating meal:', error);
    res.status(500).json({ message: 'Failed to create meal' });
  }
});

export default router;

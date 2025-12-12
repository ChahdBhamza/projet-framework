import express from 'express';
import { requireAuth } from '../utils/auth.js';
import Favorites from '../models/favorites.js';

const router = express.Router();

// Get user favorites
router.get('/', requireAuth, async (req, res) => {
  try {
    const favorites = await Favorites.find({ userId: req.user.userId }).populate('mealId');
    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Failed to fetch favorites' });
  }
});

// Add to favorites
router.post('/', requireAuth, async (req, res) => {
  try {
    const { mealId } = req.body;

    if (!mealId) {
      return res.status(400).json({ message: 'Meal ID is required' });
    }

    const existing = await Favorites.findOne({ userId: req.user.userId, mealId });
    if (existing) {
      return res.status(400).json({ message: 'Already in favorites' });
    }

    const favorite = await Favorites.create({
      userId: req.user.userId,
      mealId
    });

    res.status(201).json(favorite);
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ message: 'Failed to add favorite' });
  }
});

// Remove from favorites
router.delete('/:mealId', requireAuth, async (req, res) => {
  try {
    await Favorites.deleteOne({ userId: req.user.userId, mealId: req.params.mealId });
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ message: 'Failed to remove favorite' });
  }
});

export default router;

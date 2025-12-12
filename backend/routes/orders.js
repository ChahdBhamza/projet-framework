import express from 'express';
import { requireAuth } from '../utils/auth.js';
import Orders from '../models/orders.js';

const router = express.Router();

// Get all orders (admin)
router.get('/', requireAuth, async (req, res) => {
  try {
    const orders = await Orders.find().populate('userId').limit(100);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Get user orders
router.get('/my-orders', requireAuth, async (req, res) => {
  try {
    const orders = await Orders.find({ userId: req.user.userId });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Create order
router.post('/', requireAuth, async (req, res) => {
  try {
    const { items, totalPrice } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Items are required' });
    }

    const order = await Orders.create({
      userId: req.user.userId,
      items,
      totalPrice,
      status: 'pending'
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

export default router;

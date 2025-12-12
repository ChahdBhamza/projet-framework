import express from 'express';
import { requireAuth } from '../utils/auth.js';
import Users from '../models/users.js';

const router = express.Router();

// Get all activity logs (admin)
router.get('/activity-logs', requireAuth, async (req, res) => {
  try {
    res.json({ message: 'Activity logs endpoint' });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ message: 'Failed to fetch activity logs' });
  }
});

// Get admin summary
router.get('/summary', requireAuth, async (req, res) => {
  try {
    const totalUsers = await Users.countDocuments();
    res.json({
      totalUsers,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ message: 'Failed to fetch summary' });
  }
});

export default router;

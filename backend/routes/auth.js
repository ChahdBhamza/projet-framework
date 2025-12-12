import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Users from '../models/users.js';
import ActivityLog from '../models/activityLog.js';
import { verifyToken } from '../utils/auth.js';
import { sendVerificationEmail, sendResetPasswordEmail } from '../lib/email.js';

const router = express.Router();

// Helper function to create JWT token
function createToken(userId, email, name) {
  return jwt.sign(
    { id: userId, email, name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Sign in
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = (email || '').trim().toLowerCase();
    const trimmedPassword = (password || '').trim();

    if (!normalizedEmail || !trimmedPassword) {
      return res.status(400).json({ message: 'Email and password cannot be empty' });
    }

    const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const user = await Users.findOne({
      email: { $regex: new RegExp(`^${escapedEmail}$`, 'i') }
    });

    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    if (user.provider === 'google' || user.googleId) {
      return res.status(400).json({ message: 'This account was created with Google. Please sign in with Google instead.' });
    }

    if (!user.password || typeof user.password !== 'string') {
      return res.status(500).json({ message: 'Account error. Please contact support.' });
    }

    const isMatch = await bcrypt.compare(trimmedPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: 'Please verify your email first' });
    }

    const token = createToken(user._id, user.email, user.name);

    // Log activity
    await ActivityLog.create({
      userId: user._id,
      action: 'signin',
      details: { email: user.email }
    });

    res.json({
      message: 'Signed in successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({ message: 'Sign in failed' });
  }
});

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await Users.findOne({
      email: { $regex: new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Users.create({
      email: normalizedEmail,
      password: hashedPassword,
      name,
      isEmailVerified: false
    });

    const verificationToken = createToken(newUser._id, newUser.email, newUser.name);

    // Send verification email
    await sendVerificationEmail(newUser.email, newUser.name, verificationToken);

    res.status(201).json({
      message: 'Account created. Please verify your email.',
      userId: newUser._id
    });
  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).json({ message: 'Sign up failed' });
  }
});

// Verify email
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    user.isEmailVerified = true;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// Resend verification email
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    const user = await Users.findOne({
      email: { $regex: new RegExp(`^${escapedEmail}$`, 'i') }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    const verificationToken = createToken(user._id, user.email, user.name);
    await sendVerificationEmail(user.email, user.name, verificationToken);

    res.json({ message: 'Verification email sent' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ message: 'Failed to send verification email' });
  }
});

// Request password reset
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    const user = await Users.findOne({
      email: { $regex: new RegExp(`^${escapedEmail}$`, 'i') }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = createToken(user._id, user.email, user.name);
    await sendResetPasswordEmail(user.email, user.name, resetToken);

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Failed to send reset email' });
  }
});

// Confirm password reset
router.post('/reset-password/confirm', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Confirm password reset error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

export default router;

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

// GET all users
router.get('/users', authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password -verificationToken -verificationTokenExpiry').sort('-createdAt');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update user role
router.put('/users/:id/role', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role.' });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE user
router.delete('/users/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const authMiddleware = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

const DEFAULT_CATEGORIES = [
  { name: 'Medicines', slug: 'medicines', icon: '💊', description: 'Prescription and OTC medicines', color: '#1a4fa8' },
  { name: 'Syrups', slug: 'syrups', icon: '🍶', description: 'Liquid formulations and syrups', color: '#2d7a4f' },
  { name: 'Creams & Ointments', slug: 'creams', icon: '🧴', description: 'Topical creams and ointments', color: '#1a7a6e' },
  { name: 'Serums', slug: 'serums', icon: '💉', description: 'Medical and cosmetic serums', color: '#4a1a8a' },
  { name: 'Vitamins & Supplements', slug: 'supplements', icon: '🌿', description: 'Health supplements and vitamins', color: '#7a4a1a' },
  { name: 'Skin Care', slug: 'skincare', icon: '✨', description: 'Dermatological skin care products', color: '#8a1a4a' }
];

// GET all active categories (public). Seeds the original default set on first run.
router.get('/', async (req, res) => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) await Category.insertMany(DEFAULT_CATEGORIES);
    const categories = await Category.find({ isActive: true }).sort('name');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create category (admin)
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update category (admin)
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE category (admin)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

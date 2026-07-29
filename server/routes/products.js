const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// GET all products with filters
router.get('/', async (req, res) => {
  try {
    const { category, search, featured, limit = 20, page = 1, sort = '-createdAt' } = req.query;
    const query = { isActive: true };
    if (category && category !== 'all') query.category = category;
    if (featured === 'true') query.isFeatured = true;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
    const skip = (page - 1) * limit;
    const products = await Product.find(query).sort(sort).skip(skip).limit(Number(limit));
    const total = await Product.countDocuments(query);
    res.json({ products, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single product by Mongo _id or slug
// The frontend links to products by Mongo _id (e.g. sitemap.js, product/[id]/page.js),
// but this route historically only looked up by slug. Support both.
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const query = mongoose.Types.ObjectId.isValid(slug)
      ? { _id: slug, isActive: true }
      : { slug, isActive: true };
    const product = await Product.findOne(query);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create product (admin)
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Product removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

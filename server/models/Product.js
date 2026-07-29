const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  category: { type: String, required: true },
  subCategory: { type: String },
  images: [{ type: String }],
  stock: { type: Number, default: 100 },
  sku: { type: String },
  ingredients: [{ type: String }],
  usage: { type: String },
  sideEffects: { type: String },
  manufacturer: { type: String, default: 'Lifemed Pharma' },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  ratings: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 0 },
  tags: [{ type: String }]
}, { timestamps: true });
module.exports = mongoose.model('Product', ProductSchema);

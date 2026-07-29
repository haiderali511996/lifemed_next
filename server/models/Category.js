const mongoose = require('mongoose');
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String, default: '💊' },
  description: { type: String },
  color: { type: String, default: '#1a4fa8' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = mongoose.model('Category', CategorySchema);

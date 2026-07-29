const mongoose = require('mongoose');
const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String },
  content: { type: String, required: true },
  author: { type: String, default: 'Lifemed Pharma Team' },
  category: { type: String, required: true },
  tags: [{ type: String }],
  image: { type: String },
  isPublished: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  readTime: { type: Number, default: 5 }
}, { timestamps: true });
module.exports = mongoose.model('Blog', BlogSchema);

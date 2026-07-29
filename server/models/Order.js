const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },

  customer: {
    name:    { type: String, required: true },
    email:   { type: String, required: true },
    phone:   { type: String, required: true },
    address: { type: String, required: true },
    city:    { type: String, required: true },
  },

  items: [{
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:     { type: String, required: true },
    price:    { type: Number, required: true },
    quantity: { type: Number, required: true },
    image:    { type: String },
  }],

  subtotal:     { type: Number, required: true },
  shippingCost: { type: Number, required: true },
  total:        { type: Number, required: true },

  // ✅ Checkout.js ke sab payment methods allow hain
  paymentMethod: {
    type: String,
    enum: ['cod', 'card', 'easypaisa', 'jazzcash', 'online', 'cash'],
    required: true,
  },

  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },

  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },

  notes: { type: String, default: '' },

}, { timestamps: true });

// Auto-generate order number
OrderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    this.orderNumber = 'LMP-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
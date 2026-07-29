const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authMiddleware = require('../middleware/auth');
const { sendOrderNotification, sendOrderConfirmation } = require('../utils/sendEmail');

// ─────────────────────────────────────────────
// Helper: check required customer fields
// ─────────────────────────────────────────────
function validateOrderBody(body) {
  const errors = [];

  const requiredCustomer = ['name', 'email', 'phone', 'address', 'city'];
  requiredCustomer.forEach((field) => {
    if (!body.customer?.[field] || String(body.customer[field]).trim() === '') {
      errors.push(`customer.${field} is required`);
    }
  });

  if (!Array.isArray(body.items) || body.items.length === 0) {
    errors.push('items array is required and must not be empty');
  } else {
    body.items.forEach((item, i) => {
      if (!item.name)     errors.push(`items[${i}].name is required`);
      if (item.price == null) errors.push(`items[${i}].price is required`);
      if (item.quantity == null) errors.push(`items[${i}].quantity is required`);
    });
  }

  if (body.subtotal == null)     errors.push('subtotal is required');
  if (body.shippingCost == null) errors.push('shippingCost is required');
  if (body.total == null)        errors.push('total is required');

  if (!body.paymentMethod) {
    errors.push('paymentMethod is required (online | cash)');
  } else if (!['cod', 'card', 'easypaisa', 'jazzcash', 'online', 'cash'].includes(body.paymentMethod)) {
    errors.push('paymentMethod must be "online" or "cash"');
  }

  return errors;
}

// ─────────────────────────────────────────────
// POST /api/orders — Create order (auth required)
// ─────────────────────────────────────────────
router.post('/', authMiddleware, async (req, res) => {
  try {
    // 1. Validate incoming body
    const errors = validateOrderBody(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    // 2. Build order data — NOTE: userId NOT in schema, so we don't force it
    //    If you want to track who placed the order, add userId to your schema.
    const orderData = {
      customer:      req.body.customer,
      items:         req.body.items,
      subtotal:      req.body.subtotal,
      shippingCost:  req.body.shippingCost,
      total:         req.body.total,
      paymentMethod: req.body.paymentMethod,
      notes:         req.body.notes || '',
    };

    const order = new Order(orderData);
    await order.save();

    // 3. Send emails (silently fail — never block the response)
    try { await sendOrderNotification(order); } catch (e) { console.error('Admin email error:', e.message); }
    try { await sendOrderConfirmation(order); } catch (e) { console.error('Customer email error:', e.message); }

    return res.status(201).json({
      success: true,
      message: `Order ${order.orderNumber} placed successfully!`,
      orderNumber: order.orderNumber,
      order,
    });

  } catch (err) {
    console.error('Create order error:', err);
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: 'Validation failed', errors: messages });
    }
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ─────────────────────────────────────────────
// GET /api/orders — All orders (admin only)
// Supports: ?page=1&limit=20&status=pending&search=LMP-
// ─────────────────────────────────────────────
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access only.' });
    }

    const page   = Math.max(1, parseInt(req.query.page)  || 1);
    const limit  = Math.min(100, parseInt(req.query.limit) || 20);
    const skip   = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (req.query.status)        filter.orderStatus  = req.query.status;
    if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;
    if (req.query.search) {
      filter.$or = [
        { orderNumber: { $regex: req.query.search, $options: 'i' } },
        { 'customer.name':  { $regex: req.query.search, $options: 'i' } },
        { 'customer.email': { $regex: req.query.search, $options: 'i' } },
        { 'customer.phone': { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      orders,
    });

  } catch (err) {
    console.error('Get all orders error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─────────────────────────────────────────────
// GET /api/orders/my-orders — Logged-in user's orders
// ─────────────────────────────────────────────
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    console.log('=== MY ORDERS DEBUG ===');
    console.log('req.user:', req.user);
    console.log('req.user.email:', req.user?.email);
    
    const orders = await Order.find({ 'customer.email': req.user.email }).sort({ createdAt: -1 });
    console.log('orders found:', orders.length);
    
    return res.json({ success: true, orders });
  } catch (err) {
    console.error('Get my orders FULL error:', err); // ← poora error
    return res.status(500).json({ success: false, message: err.message }); // ← message bhi bhejo
  }
});

// ─────────────────────────────────────────────
// GET /api/orders/:id — Single order
// Admin sees any order; user only sees their own
// ─────────────────────────────────────────────
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Non-admin can only view their own order (matched by email)
    if (req.user.role !== 'admin' && order.customer.email !== req.user.email) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    return res.json({ success: true, order });

  } catch (err) {
    console.error('Get order error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid order ID.' });
    }
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─────────────────────────────────────────────
// PUT /api/orders/:id — Update order (admin only)
// Allowed fields: orderStatus, paymentStatus, notes
// ─────────────────────────────────────────────
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access only.' });
    }

    // Whitelist only safe updatable fields
    const allowed = ['orderStatus', 'paymentStatus', 'notes'];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields to update.' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    return res.json({ success: true, message: 'Order updated.', order });

  } catch (err) {
    console.error('Update order error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: 'Validation failed', errors: messages });
    }
    if (err.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid order ID.' });
    }
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─────────────────────────────────────────────
// PATCH /api/orders/:id/cancel — Cancel order
// User can cancel their own; admin can cancel any
// ─────────────────────────────────────────────
router.patch('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Permission check
    if (req.user.role !== 'admin' && order.customer.email !== req.user.email) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    // Can only cancel if not already shipped/delivered
    const nonCancellable = ['shipped', 'delivered', 'cancelled'];
    if (nonCancellable.includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel an order that is already "${order.orderStatus}".`,
      });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    return res.json({ success: true, message: 'Order cancelled successfully.', order });

  } catch (err) {
    console.error('Cancel order error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid order ID.' });
    }
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─────────────────────────────────────────────
// DELETE /api/orders/:id — Hard delete (admin only)
// ─────────────────────────────────────────────
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access only.' });
    }

    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    return res.json({ success: true, message: `Order ${order.orderNumber} deleted.` });

  } catch (err) {
    console.error('Delete order error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid order ID.' });
    }
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
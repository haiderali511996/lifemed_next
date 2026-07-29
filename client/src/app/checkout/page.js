'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import api from '@/lib/api';

const paymentMethods = [
  { value: 'cod', label: 'Cash on Delivery' },
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Credit / Debit Card' },
  { value: 'easypaisa', label: 'EasyPaisa' },
  { value: 'jazzcash', label: 'JazzCash' },
  { value: 'online', label: 'Online Transfer' },
];

export default function CheckoutPage() {
  const { user, token, loading: authLoading } = useAuth();
  const { items, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 'cod',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !token) {
      router.push('/login?redirect=/checkout');
    }
  }, [authLoading, token, router]);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: user.name || f.name,
        email: user.email || f.email,
        phone: user.phone || f.phone,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const shippingCost = cartTotal >= 5000 ? 0 : 200;
  const total = cartTotal + shippingCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        customer: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
        },
        items: items.map((i) => ({
          product: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        subtotal: cartTotal,
        shippingCost,
        total,
        paymentMethod: form.paymentMethod,
        notes: form.notes,
      };
      const res = await api.post('/orders', payload);
      clearCart();
      router.push(`/order-success?order=${res.data.orderNumber}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !token) {
    return (
      <div className="container state-box">
        <div className="spinner" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container state-box">
        <h3>Your cart is empty</h3>
        <p>Add products to your cart before checking out.</p>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h1>Checkout</h1>
      <div className="cart-layout">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" value={form.phone} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input id="city" name="city" value={form.city} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="address">Delivery Address</label>
            <textarea id="address" name="address" rows={3} value={form.address} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="paymentMethod">Payment Method</label>
            <select id="paymentMethod" name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
              {paymentMethods.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="notes">Order Notes (optional)</label>
            <textarea id="notes" name="notes" rows={2} value={form.notes} onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          {items.map((item) => (
            <div className="summary-row" key={item.productId}>
              <span>{item.name} x{item.quantity}</span>
              <span>PKR {(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="summary-row">
            <span>Subtotal</span>
            <span>PKR {cartTotal.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shippingCost === 0 ? 'Free' : `PKR ${shippingCost.toLocaleString()}`}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>PKR {total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { FiPackage, FiTrash2 } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="container state-box">
        <h3>Your cart is empty</h3>
        <p>Browse our shop to find products you&apos;ll love.</p>
        <Link href="/shop" className="btn btn-primary mt-2">Go to Shop</Link>
      </div>
    );
  }

  const shippingCost = cartTotal >= 5000 ? 0 : 200;
  const total = cartTotal + shippingCost;

  return (
    <div className="container cart-page">
      <h1>Your Cart</h1>
      <div className="cart-layout">
        <div>
          {items.map((item) => (
            <div className="cart-item" key={item.productId}>
              <div className="cart-item-thumb">
                {item.image ? <img src={item.image} alt={item.name} /> : <FiPackage />}
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', margin: '0 0 4px' }}>{item.name}</h3>
                <span className="price">PKR {item.price?.toLocaleString()}</span>
              </div>
              <div className="qty-control">
                <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
              </div>
              <button
                className="btn-link"
                onClick={() => removeFromCart(item.productId)}
                aria-label="Remove item"
                style={{ color: 'var(--danger)' }}
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
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
          <Link href="/checkout" className="btn btn-primary btn-block mt-2">Proceed to Checkout</Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiCheckCircle } from 'react-icons/fi';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const order = searchParams.get('order');

  return (
    <div className="container state-box">
      <FiCheckCircle size={56} color="var(--accent)" style={{ marginBottom: 16 }} />
      <h3>Order Placed Successfully!</h3>
      {order && (
        <p>
          Your order number is <strong>{order}</strong>. We&apos;ll send you updates by email and
          phone.
        </p>
      )}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
        <Link href="/shop" className="btn btn-outline">Continue Shopping</Link>
        <Link href="/" className="btn btn-primary">Back to Home</Link>
      </div>
    </div>
  );
}

export default function OrderSuccessClient() {
  return (
    <Suspense fallback={<div className="state-box"><div className="spinner" /></div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}

'use client';

import Link from 'next/link';
import { FiHeart, FiShield, FiUsers, FiTrendingUp } from 'react-icons/fi';

export default function AboutClient() {
  const values = [
    { icon: <FiHeart />, title: 'Care First', text: 'Every product we sell is chosen with our customers\' wellbeing in mind.' },
    { icon: <FiShield />, title: 'Authenticity', text: 'We source only genuine, quality-checked medicines and health products.' },
    { icon: <FiUsers />, title: 'Community', text: 'Serving families across Lahore and Pakistan with reliable healthcare access.' },
    { icon: <FiTrendingUp />, title: 'Growth', text: 'Continuously expanding our range to meet the needs of modern Pakistan.' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>About Lifemed Pharma</h1>
        <p>Pakistan&apos;s trusted online pharmacy, based in Lahore.</p>
      </div>

      <div className="container">
        <section className="section" style={{ paddingTop: 0 }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <h2>Our Story</h2>
            <p>
              Lifemed Pharma was founded with a simple mission: make quality healthcare products
              accessible to every household in Pakistan. From essential medicines to skincare and
              supplements, we work directly with trusted manufacturers to bring authentic products
              to your doorstep at fair prices.
            </p>
            <p>
              Based in Lahore, our team combines pharmaceutical expertise with a customer-first
              approach — verifying every product, packaging with care, and delivering quickly across
              the city and beyond.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2>Our Values</h2>
          </div>
          <div className="category-grid">
            {values.map((v) => (
              <div key={v.title} className="category-card">
                <span className="category-icon">{v.icon}</span>
                <h3>{v.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{v.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section text-center">
          <h2>Ready to shop with us?</h2>
          <p>Browse our full range of medicines, supplements and skincare products.</p>
          <Link href="/shop" className="btn btn-primary">Visit the Shop</Link>
        </section>
      </div>
    </div>
  );
}

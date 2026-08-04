'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  FiTruck, FiShield, FiHeadphones, FiChevronLeft, FiChevronRight,
  FiActivity, FiSun, FiHeart, FiCheckCircle, FiClock, FiAward,
} from 'react-icons/fi';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';

const slides = [
  {
    key: 'health',
    theme: 'slide-a',
    eyebrow: "Pakistan's Trusted Online Pharmacy",
    title: 'Better Health. Better Life.',
    text: 'Genuine medicines, supplements and skincare — delivered to your door across Lahore and beyond.',
    icon: <FiActivity />,
    chips: ['100% Genuine', 'Licensed Pharmacy', 'Fast Delivery'],
  },
  {
    key: 'delivery',
    theme: 'slide-b',
    eyebrow: 'Free Shipping Above PKR 5,000',
    title: 'Delivered To Your Doorstep.',
    text: 'Order before 4pm for same-day dispatch in Lahore, with nationwide delivery across Pakistan.',
    icon: <FiTruck />,
    chips: ['Same-Day Dispatch', 'Nationwide', 'Secure Packaging'],
  },
  {
    key: 'wellness',
    theme: 'slide-c',
    eyebrow: 'Wellness & Skincare',
    title: 'Care That Goes Deeper.',
    text: 'Dermatologist-backed serums, vitamins and daily essentials chosen by our pharmacists.',
    icon: <FiSun />,
    chips: ['Expert Picked', 'Quality Checked', 'Trusted Brands'],
  },
];

const SLIDE_MS = 6000;

function useReveal(deps) {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]:not(.revealed)');
    if (!els.length) return;
    // Never leave content hidden if the browser can't observe or the user
    // asked for reduced motion — just show everything.
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      els.forEach((el) => el.classList.add('revealed'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);

  const go = useCallback((i) => setActive((i + slides.length) % slides.length), []);
  const next = useCallback(() => go(active + 1), [active, go]);
  const prev = useCallback(() => go(active - 1), [active, go]);

  useEffect(() => {
    if (paused) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer.current = setTimeout(() => setActive((a) => (a + 1) % slides.length), SLIDE_MS);
    return () => clearTimeout(timer.current);
  }, [active, paused]);

  return (
    <section
      className="hero-slider"
      aria-roledescription="carousel"
      aria-label="Lifemed Pharma highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="hero-orbs" aria-hidden="true">
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="orb orb-3" />
      </div>

      {slides.map((slide, i) => (
        <div
          key={slide.key}
          className={`hero-slide ${slide.theme} ${i === active ? 'is-active' : ''}`}
          aria-hidden={i !== active}
        >
          <div className="container hero-slide-inner">
            <div className="hero-copy">
              <span className="hero-eyebrow">{slide.eyebrow}</span>
              <h1>{slide.title}</h1>
              <p>{slide.text}</p>
              <div className="hero-chips">
                {slide.chips.map((chip) => (
                  <span key={chip} className="hero-chip">
                    <FiCheckCircle /> {chip}
                  </span>
                ))}
              </div>
              <div className="hero-actions">
                <Link href="/shop" className="btn btn-primary btn-lg">Shop Now</Link>
                <Link href="/about" className="btn btn-ghost btn-lg">Learn More</Link>
              </div>
            </div>

            <div className="hero-figure" aria-hidden="true">
              <div className="hero-ring">
                <div className="hero-icon">{slide.icon}</div>
              </div>
              <span className="float-card float-1"><FiShield /> Verified</span>
              <span className="float-card float-2"><FiClock /> 24–48h</span>
              <span className="float-card float-3"><FiAward /> Top Rated</span>
            </div>
          </div>
        </div>
      ))}

      <div className="hero-controls">
        <button className="hero-nav" onClick={prev} aria-label="Previous slide">
          <FiChevronLeft />
        </button>

        <div className="hero-dots" role="tablist" aria-label="Choose slide">
          {slides.map((slide, i) => (
            <button
              key={slide.key}
              role="tab"
              aria-selected={i === active}
              aria-label={slide.title}
              className={`hero-dot ${i === active ? 'is-active' : ''}`}
              onClick={() => go(i)}
            >
              <span className="hero-dot-fill" style={{ animationDuration: `${SLIDE_MS}ms` }} />
            </button>
          ))}
        </div>

        <button className="hero-nav" onClick={next} aria-label="Next slide">
          <FiChevronRight />
        </button>
      </div>
    </section>
  );
}

export default function HomeClient() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products', { params: { featured: true, limit: 8 } }),
        ]);
        if (!cancelled) {
          setCategories(catRes.data || []);
          setFeatured(prodRes.data?.products || []);
        }
      } catch (e) {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useReveal([loading, categories.length, featured.length]);

  return (
    <>
      <HeroSlider />

      <section className="trust-bar">
        <div className="container trust-grid">
          <div className="trust-item"><FiTruck /><div><strong>Fast Delivery</strong><span>Across Lahore &amp; Pakistan</span></div></div>
          <div className="trust-item"><FiShield /><div><strong>100% Genuine</strong><span>Quality-checked stock</span></div></div>
          <div className="trust-item"><FiHeadphones /><div><strong>Pharmacist Support</strong><span>Guidance every day</span></div></div>
          <div className="trust-item"><FiHeart /><div><strong>Trusted Since 2018</strong><span>Thousands served</span></div></div>
        </div>
      </section>

      <section className="section container">
        <div className="section-header" data-reveal>
          <h2>Shop by Category</h2>
          <p>Explore our range of pharmaceutical and wellness products.</p>
        </div>
        {loading ? (
          <div className="state-box"><div className="spinner" /></div>
        ) : (
          <div className="category-grid">
            {categories.map((cat, i) => (
              <Link
                key={cat._id}
                href={`/shop?category=${cat.slug}`}
                className="category-card"
                data-reveal
                style={{ transitionDelay: `${Math.min(i, 6) * 60}ms` }}
              >
                {cat.icon?.startsWith('http') || cat.icon?.startsWith('/uploads') ? (
                  <img src={cat.icon} alt={cat.name} className="category-icon-img" />
                ) : (
                  <span className="category-icon">{cat.icon}</span>
                )}
                <h3>{cat.name}</h3>
                <span className="category-go">Browse →</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="section container">
        <div className="section-header" data-reveal>
          <h2>Featured Products</h2>
          <p>Handpicked essentials trusted by our customers.</p>
        </div>
        {loading ? (
          <div className="state-box"><div className="spinner" /></div>
        ) : error || featured.length === 0 ? (
          <div className="state-box">
            <h3>No featured products right now</h3>
            <p>Check back soon, or browse the full shop.</p>
            <Link href="/shop" className="btn btn-primary mt-2">Browse Shop</Link>
          </div>
        ) : (
          <div className="product-grid">
            {featured.map((p, i) => (
              <div key={p._id} data-reveal style={{ transitionDelay: `${Math.min(i, 6) * 60}ms` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="cta-band">
        <div className="container cta-inner" data-reveal>
          <div>
            <h2>Need help choosing a product?</h2>
            <p>Our pharmacists are happy to guide you — call, email or drop by our Lahore store.</p>
          </div>
          <Link href="/contact" className="btn btn-lg btn-on-dark">Talk to a Pharmacist</Link>
        </div>
      </section>
    </>
  );
}

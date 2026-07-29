'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get('category') || 'all';
  const search = searchParams.get('search') || '';

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    api
      .get('/products', { params: { category, search, limit: 50 } })
      .then((res) => {
        if (!cancelled) setProducts(res.data?.products || []);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [category, search]);

  const setCategory = (slug) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === 'all') params.delete('category');
    else params.set('category', slug);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="container">
      <div className="page-header" style={{ margin: '0 -20px 40px', borderRadius: 0 }}>
        <h1>Shop</h1>
        <p>{search ? `Search results for "${search}"` : 'Browse our full range of products'}</p>
      </div>

      <div className="shop-layout">
        <aside className="filters-panel">
          <h4>Categories</h4>
          <button
            className={`filter-option ${category === 'all' ? 'active' : ''}`}
            onClick={() => setCategory('all')}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-option ${category === cat.slug ? 'active' : ''}`}
              onClick={() => setCategory(cat.slug)}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </aside>

        <div>
          {loading ? (
            <div className="state-box"><div className="spinner" /></div>
          ) : error ? (
            <div className="state-box">
              <h3>Couldn&apos;t load products</h3>
              <p>Please try again later.</p>
            </div>
          ) : products.length === 0 ? (
            <div className="state-box">
              <h3>No products found</h3>
              <p>Try a different category or search term.</p>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopClient() {
  return (
    <Suspense fallback={<div className="state-box"><div className="spinner" /></div>}>
      <ShopContent />
    </Suspense>
  );
}

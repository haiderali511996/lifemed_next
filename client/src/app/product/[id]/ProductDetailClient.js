'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiPackage } from 'react-icons/fi';
import api from '@/lib/api';
import { useCart } from '@/context/CartContext';

export default function ProductDetailClient({ id }) {
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState('description');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then((res) => {
        if (!cancelled) setProduct(res.data);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container state-box">
        <div className="spinner" />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="container state-box">
        <h3>Product not found</h3>
        <p>This product may have been removed or is no longer available.</p>
        <Link href="/shop" className="btn btn-primary mt-2">Back to Shop</Link>
      </div>
    );
  }

  const hasSale = product.salePrice != null && product.salePrice < product.price;
  const displayPrice = hasSale ? product.salePrice : product.price;
  const images = product.images?.length ? product.images : [];

  const handleAddToCart = () => {
    addToCart(
      {
        productId: product._id,
        name: product.name,
        price: displayPrice,
        image: images[0],
      },
      quantity
    );
  };

  return (
    <div className="container">
      <div className="product-detail">
        <div>
          <div className="product-gallery-main">
            {images[activeImage] ? (
              <img src={images[activeImage]} alt={product.name} />
            ) : (
              <FiPackage />
            )}
          </div>
          {images.length > 1 && (
            <div className="gallery-thumbs">
              {images.map((img, i) => (
                <img
                  key={img}
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  className={i === activeImage ? 'active' : ''}
                  onClick={() => setActiveImage(i)}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>
          {product.shortDescription && <p style={{ color: 'var(--text-muted)' }}>{product.shortDescription}</p>}

          <div className="product-price-row" style={{ marginBottom: 10 }}>
            <span className="price" style={{ fontSize: '1.4rem' }}>PKR {displayPrice?.toLocaleString()}</span>
            {hasSale && <span className="price-strike">PKR {product.price?.toLocaleString()}</span>}
          </div>

          <div className="detail-meta">
            <span>Manufacturer: {product.manufacturer || 'Lifemed Pharma'}</span>
            <span>{product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}</span>
            {product.sku && <span>SKU: {product.sku}</span>}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '20px 0' }}>
            <div className="qty-control">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              Add to Cart
            </button>
          </div>

          <div className="tabs">
            <button className={`tab-btn ${tab === 'description' ? 'active' : ''}`} onClick={() => setTab('description')}>Description</button>
            {product.ingredients?.length > 0 && (
              <button className={`tab-btn ${tab === 'ingredients' ? 'active' : ''}`} onClick={() => setTab('ingredients')}>Ingredients</button>
            )}
            {(product.usage || product.sideEffects) && (
              <button className={`tab-btn ${tab === 'usage' ? 'active' : ''}`} onClick={() => setTab('usage')}>Usage &amp; Safety</button>
            )}
          </div>

          {tab === 'description' && <p>{product.description}</p>}
          {tab === 'ingredients' && (
            <ul>
              {product.ingredients.map((ing) => (
                <li key={ing}>{ing}</li>
              ))}
            </ul>
          )}
          {tab === 'usage' && (
            <div>
              {product.usage && <p><strong>Usage: </strong>{product.usage}</p>}
              {product.sideEffects && <p><strong>Side Effects: </strong>{product.sideEffects}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

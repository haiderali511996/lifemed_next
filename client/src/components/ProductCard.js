'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiPackage } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [imageFailed, setImageFailed] = useState(false);
  const hasSale = product.salePrice != null && product.salePrice < product.price;
  const displayPrice = hasSale ? product.salePrice : product.price;
  const rawImage = product.images?.[0];
  const image = imageFailed ? null : rawImage;

  const handleAdd = () => {
    addToCart({
      productId: product._id,
      name: product.name,
      price: displayPrice,
      image,
    });
  };

  return (
    <div className="product-card">
      <Link href={`/product/${product._id}`} className="product-thumb">
        {hasSale && <span className="sale-badge">SALE</span>}
        {image ? (
          <img src={image} alt={product.name} onError={() => setImageFailed(true)} />
        ) : (
          <FiPackage className="placeholder-icon" />
        )}
      </Link>
      <div className="product-body">
        <span className="product-category">{product.category}</span>
        <Link href={`/product/${product._id}`} className="product-name">
          {product.name}
        </Link>
        <div className="product-price-row">
          <span className="price">PKR {displayPrice?.toLocaleString()}</span>
          {hasSale && <span className="price-strike">PKR {product.price?.toLocaleString()}</span>}
        </div>
        <div className="product-actions">
          <button className="btn btn-primary btn-sm btn-block" onClick={handleAdd}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

import ProductDetailClient from './ProductDetailClient';

// Generate dynamic metadata per product for SEO
export async function generateMetadata({ params }) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/products/${params.id}`,
      { next: { revalidate: 3600 } }
    );
    if (res.ok) {
      const product = await res.json();
      return {
        title: `${product.name} — Lifemed Pharma`,
        description: product.shortDescription || product.description?.slice(0, 160),
        openGraph: {
          title: `${product.name} | Lifemed Pharma`,
          description: product.shortDescription || product.description?.slice(0, 160),
          images: [{ url: product.images?.[0] || product.image || '/og-image.jpg' }],
          url: `https://lifemedpharmaceutical.com/product/${params.id}`,
        },
      };
    }
  } catch {}
  return {
    title: 'Product — Lifemed Pharma',
    description: 'Quality pharmaceutical product from Lifemed Pharma Pakistan.',
  };
}

export default function ProductPage({ params }) {
  return <ProductDetailClient id={params.id} />;
}

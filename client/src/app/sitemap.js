export default async function sitemap() {
  const baseUrl = 'https://lifemedpharmaceutical.com';

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  // Dynamic product pages
  let productPages = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/products?limit=200`);
    if (res.ok) {
      const data = await res.json();
      const products = Array.isArray(data?.products) ? data.products : Array.isArray(data) ? data : [];
      productPages = products.map(p => ({
        url: `${baseUrl}/product/${p._id}`,
        lastModified: new Date(p.updatedAt || Date.now()),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    }
  } catch {}

  // Dynamic blog pages
  let blogPages = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/blogs?limit=100`);
    if (res.ok) {
      const data = await res.json();
      const blogs = Array.isArray(data?.blogs) ? data.blogs : Array.isArray(data) ? data : [];
      blogPages = blogs.map(b => ({
        url: `${baseUrl}/blog/${b.slug}`,
        lastModified: new Date(b.updatedAt || Date.now()),
        changeFrequency: 'monthly',
        priority: 0.7,
      }));
    }
  } catch {}

  return [...staticPages, ...productPages, ...blogPages];
}

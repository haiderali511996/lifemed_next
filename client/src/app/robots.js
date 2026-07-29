export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/checkout/', '/order-success/', '/cart/'],
      },
    ],
    sitemap: 'https://lifemedpharmaceutical.com/sitemap.xml',
    host: 'https://lifemedpharmaceutical.com',
  };
}

import BlogDetailClient from './BlogDetailClient';

export async function generateMetadata({ params }) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/blogs/${params.slug}`,
      { next: { revalidate: 3600 } }
    );
    if (res.ok) {
      const blog = await res.json();
      return {
        title: blog.title,
        description: blog.excerpt?.slice(0, 160),
        keywords: blog.tags?.join(', '),
        authors: [{ name: blog.author }],
        openGraph: {
          type: 'article',
          title: blog.title,
          description: blog.excerpt,
          images: [{ url: blog.image || '/og-image.jpg' }],
          url: `https://lifemedpharmaceutical.com/blog/${params.slug}`,
          publishedTime: blog.createdAt,
          authors: [blog.author],
          tags: blog.tags,
        },
        twitter: {
          card: 'summary_large_image',
          title: blog.title,
          description: blog.excerpt,
          images: [blog.image || '/og-image.jpg'],
        },
      };
    }
  } catch {}
  return {
    title: 'Health Article — Lifemed Pharma',
    description: 'Expert health advice from Lifemed Pharma Pakistan.',
  };
}

// Pre-generate popular blog slugs at build time
export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/blogs?limit=50`
    );
    if (res.ok) {
      const data = await res.json();
      const blogs = Array.isArray(data?.blogs) ? data.blogs : Array.isArray(data) ? data : [];
      return blogs.map(blog => ({ slug: blog.slug }));
    }
  } catch {}
  return [];
}

export default function BlogDetailPage({ params }) {
  return <BlogDetailClient slug={params.slug} />;
}

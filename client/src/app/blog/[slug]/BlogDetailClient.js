'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function BlogDetailClient({ slug }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .get(`/blogs/${slug}`)
      .then((res) => {
        if (!cancelled) setBlog(res.data);
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
  }, [slug]);

  if (loading) {
    return (
      <div className="container state-box">
        <div className="spinner" />
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="container state-box">
        <h3>Article not found</h3>
        <Link href="/blog" className="btn btn-primary mt-2">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <article className="blog-article">
        <div className="blog-meta">
          <span>{blog.category}</span>
          <span>{blog.author}</span>
          <span>{blog.readTime} min read</span>
          <span>{blog.views} views</span>
        </div>
        <h1>{blog.title}</h1>
        {blog.image && <img src={blog.image} alt={blog.title} />}
        <div className="blog-article-content">{blog.content}</div>
        {blog.tags?.length > 0 && (
          <div style={{ marginTop: 30, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {blog.tags.map((tag) => (
              <span key={tag} className="badge">{tag}</span>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}

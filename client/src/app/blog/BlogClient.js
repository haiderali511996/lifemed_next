'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function BlogClient() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .get('/blogs', { params: { limit: 30 } })
      .then((res) => {
        if (!cancelled) setBlogs(res.data?.blogs || []);
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
  }, []);

  return (
    <div className="container">
      <div className="page-header" style={{ margin: '0 -20px 40px', borderRadius: 0 }}>
        <h1>Health Blog</h1>
        <p>Expert tips, medical advice and guides from our pharmaceutical team.</p>
      </div>

      {loading ? (
        <div className="state-box"><div className="spinner" /></div>
      ) : error || blogs.length === 0 ? (
        <div className="state-box">
          <h3>No articles yet</h3>
          <p>Check back soon for health tips and news.</p>
        </div>
      ) : (
        <div className="blog-grid">
          {blogs.map((blog) => (
            <Link key={blog._id} href={`/blog/${blog.slug}`} className="blog-card">
              {blog.image && (
                <div className="blog-thumb">
                  <img src={blog.image} alt={blog.title} />
                </div>
              )}
              <div className="blog-body">
                <div className="blog-meta">
                  <span>{blog.category}</span>
                  <span>{blog.readTime} min read</span>
                </div>
                <h3>{blog.title}</h3>
                <p className="blog-excerpt">{blog.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

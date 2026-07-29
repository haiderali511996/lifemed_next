'use client';

import { useState } from 'react';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '@/lib/api';

const initialForm = { name: '', email: '', phone: '', subject: '', message: '' };

export default function ContactClient() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/contact', form);
      toast.success(res.data?.message || 'Message sent successfully.');
      setForm(initialForm);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Contact Us</h1>
        <p>We&apos;d love to hear from you.</p>
      </div>

      <div className="container">
        <div className="section" style={{ paddingTop: 0, display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 40 }}>
          <div>
            <h2>Get in Touch</h2>
            <ul className="footer-contact" style={{ color: 'var(--text)', marginTop: 20 }}>
              <li><FiMapPin /> 182-D Khayban-e-Ameen, Lahore, Pakistan</li>
              <li><FiPhone /> <a href="tel:+923205342942">+92 320 5342942</a></li>
              <li><FiMail /> <a href="mailto:info@lifemedpharma.com">info@lifemedpharma.com</a></li>
            </ul>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" value={form.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input id="subject" name="subject" value={form.subject} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={5} value={form.message} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

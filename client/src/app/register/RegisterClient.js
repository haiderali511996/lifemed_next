'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const initialForm = { name: '', email: '', password: '', phone: '' };

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const result = await register(form.name, form.email, form.password, form.phone);
    setSubmitting(false);
    if (result.success) {
      setDone(true);
    } else {
      setError(result.message || 'Registration failed.');
    }
  };

  if (done) {
    return (
      <div className="form-card text-center">
        <h1>Check your email</h1>
        <p className="form-subtitle">
          We&apos;ve sent a verification link to <strong>{form.email}</strong>. Please verify your
          email before logging in.
        </p>
        <Link href="/login" className="btn btn-primary btn-block">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="form-card">
      <h1>Create Account</h1>
      <p className="form-subtitle">Join Lifemed Pharma for a better shopping experience.</p>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" value={form.phone} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            minLength={6}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <p className="form-footer">
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </div>
  );
}

'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNeedsVerification(false);
    setSubmitting(true);
    const result = await login(form.email, form.password);
    setSubmitting(false);
    if (result.success) {
      router.push(redirect);
    } else if (result.needsVerification) {
      setNeedsVerification(true);
      setError(result.message || 'Please verify your email before logging in.');
    } else {
      setError(result.message || 'Login failed.');
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await api.post('/auth/resend-verification', { email: form.email });
      toast.success(res.data?.message || 'Verification email resent.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend verification email.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="form-card">
      <h1>Welcome Back</h1>
      <p className="form-subtitle">Log in to your Lifemed Pharma account.</p>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {needsVerification && (
        <button className="btn btn-outline btn-block mt-2" onClick={handleResend} disabled={resending}>
          {resending ? 'Resending...' : 'Resend Verification Email'}
        </button>
      )}

      <p className="form-footer">
        Don&apos;t have an account? <Link href="/register">Register</Link>
      </p>
    </div>
  );
}

export default function LoginClient() {
  return (
    <Suspense fallback={<div className="state-box"><div className="spinner" /></div>}>
      <LoginForm />
    </Suspense>
  );
}

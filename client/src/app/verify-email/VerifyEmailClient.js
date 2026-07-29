'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link — no token provided.');
      return;
    }
    api
      .get('/auth/verify-email', { params: { token } })
      .then((res) => {
        setStatus('success');
        setMessage(res.data?.message || 'Email verified successfully!');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification link is invalid or has expired.');
      });
  }, [token]);

  return (
    <div className="form-card text-center">
      {status === 'loading' && (
        <>
          <div className="spinner" />
          <p>Verifying your email...</p>
        </>
      )}
      {status === 'success' && (
        <>
          <h1>Email Verified</h1>
          <p className="form-success">{message}</p>
          <Link href="/login" className="btn btn-primary btn-block">Go to Login</Link>
        </>
      )}
      {status === 'error' && (
        <>
          <h1>Verification Failed</h1>
          <p className="form-error">{message}</p>
          <Link href="/login" className="btn btn-outline btn-block">Back to Login</Link>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailClient() {
  return (
    <Suspense fallback={<div className="state-box"><div className="spinner" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

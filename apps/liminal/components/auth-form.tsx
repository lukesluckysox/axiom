'use client';

import { useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LiminalLogo } from './logo';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      router.push(from.startsWith('/') ? from : '/');
      router.refresh();
    } catch {
      setError('A network error occurred. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }

  const isLogin = mode === 'login';

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        background: 'rgb(var(--color-bg))',
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          color: 'rgb(var(--color-text))',
          textDecoration: 'none',
          marginBottom: '3rem',
        }}
      >
        <LiminalLogo size={40} />
      </Link>

      <div
        style={{
          width: '100%',
          maxWidth: '400px',
        }}
      >
        {/* Heading */}
        <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
          <h1
            style={{
              fontFamily: 'var(--font-display), Georgia, serif',
              fontSize: 'clamp(1.75rem, 1.4rem + 1vw, 2.25rem)',
              fontWeight: 400,
              fontStyle: 'italic',
              color: 'rgb(var(--color-text))',
              marginBottom: '0.5rem',
            }}
          >
            {isLogin ? 'Enter the threshold.' : 'Begin.'}
          </h1>
          <p
            style={{
              fontSize: 'clamp(0.875rem, 0.8rem + 0.3vw, 1rem)',
              color: 'rgb(var(--color-text-muted))',
            }}
          >
            {isLogin
              ? 'Sign in to access your instruments.'
              : 'Create an account to begin.'}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          noValidate
        >
          <div>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: 'clamp(0.75rem, 0.7rem + 0.2vw, 0.8125rem)',
                fontWeight: 500,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'rgb(var(--color-text-muted))',
                marginBottom: '0.5rem',
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="liminal-input"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontSize: 'clamp(0.75rem, 0.7rem + 0.2vw, 0.8125rem)',
                fontWeight: 500,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'rgb(var(--color-text-muted))',
                marginBottom: '0.5rem',
              }}
            >
              Password
              {!isLogin && (
                <span
                  style={{
                    marginLeft: '0.5rem',
                    fontSize: '0.75rem',
                    letterSpacing: 0,
                    textTransform: 'none',
                    color: 'rgb(var(--color-text-faint))',
                    fontWeight: 400,
                  }}
                >
                  (min. 8 characters)
                </span>
              )}
            </label>
            <input
              id="password"
              type="password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="liminal-input"
              disabled={loading}
            />
          </div>

          {error && (
            <div
              className="inline-error"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !email || !password}
            style={{ marginTop: '0.5rem', width: '100%', padding: '0.75rem' }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: 16, height: 16 }} />
                <span>{isLogin ? 'Entering…' : 'Creating account…'}</span>
              </>
            ) : isLogin ? (
              'Enter'
            ) : (
              'Create account'
            )}
          </button>
        </form>

        {/* Toggle */}
        <p
          style={{
            marginTop: '1.75rem',
            textAlign: 'center',
            fontSize: 'clamp(0.8rem, 0.75rem + 0.2vw, 0.875rem)',
            color: 'rgb(var(--color-text-muted))',
          }}
        >
          {isLogin ? (
            <>
              No account?{' '}
              <Link
                href="/signup"
                style={{
                  color: 'rgb(var(--color-gold))',
                  textDecoration: 'none',
                }}
              >
                Begin here.
              </Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link
                href="/login"
                style={{
                  color: 'rgb(var(--color-gold))',
                  textDecoration: 'none',
                }}
              >
                Enter.
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

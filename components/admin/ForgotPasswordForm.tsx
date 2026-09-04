'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Icon } from '@/components/ui/Icon';

function recoveryErrorMessage(message: string, status?: number) {
  const normalized = message.toLowerCase();
  if (status === 429 || normalized.includes('rate limit') || normalized.includes('email rate')) {
    return 'Supabase has temporarily limited recovery emails. Wait before retrying, or ask an administrator to reset the account securely.';
  }
  if (normalized.includes('redirect')) {
    return 'The recovery redirect is not allowed yet. Add this site URL in Supabase Authentication → URL Configuration.';
  }
  return 'The reset email could not be sent. Confirm the administrator address and try again.';
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage('');
    setError('');

    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/admin/reset-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });

      if (resetError) {
        setError(recoveryErrorMessage(resetError.message, resetError.status));
        return;
      }

      setMessage('Check your email for the newest secure reset link. Older recovery links should be ignored.');
    } catch {
      setError('The recovery service is temporarily unavailable. Try again after confirming the site is connected to Supabase.');
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <form className="login-form" onSubmit={submit}>
        <label>
          <span>Email address</span>
          <input type="email" name="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="educator@example.org" />
        </label>
        {error ? <div className="form-error" role="alert">{error}</div> : null}
        {message ? <div className="form-success" role="status">{message}</div> : null}
        <button className="button button--primary button--large button--full" type="submit" disabled={pending}>
          {pending ? 'Sending…' : 'Send reset link'} <Icon name="arrow" />
        </button>
      </form>
      <p className="login-security"><Icon name="lock" size={16} /> Recovery links are single-use and expire automatically.</p>
      <Link className="back-link" href="/admin/login">← Back to sign in</Link>
    </>
  );
}

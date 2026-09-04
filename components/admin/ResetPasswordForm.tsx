'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Icon } from '@/components/ui/Icon';

function passwordIssue(password: string) {
  if (password.length < 12) return 'Use at least 12 characters.';
  if (!/[a-z]/.test(password)) return 'Include at least one lowercase letter.';
  if (!/[A-Z]/.test(password)) return 'Include at least one uppercase letter.';
  if (!/[0-9]/.test(password)) return 'Include at least one number.';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Include at least one symbol.';
  return '';
}

export function ResetPasswordForm() {
  const supabase = useMemo(() => createClient(), []);
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [pending, setPending] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function initializeRecovery() {
      try {
        const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        const accessToken = hash.get('access_token');
        const refreshToken = hash.get('refresh_token');
        const code = new URL(window.location.href).searchParams.get('code');

        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (sessionError) throw sessionError;
          window.history.replaceState({}, '', '/admin/reset-password');
        } else if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
          window.history.replaceState({}, '', '/admin/reset-password');
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;
        setReady(Boolean(session));
        if (!session) setError('This recovery link is missing, expired, or has already been used. Request a fresh link.');
      } catch (caught) {
        if (!mounted) return;
        setReady(false);
        setError(caught instanceof Error ? caught.message : 'The recovery session could not be verified.');
      } finally {
        if (mounted) setChecking(false);
      }
    }

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === 'PASSWORD_RECOVERY' || Boolean(session)) {
        setReady(true);
        setChecking(false);
        setError('');
      }
    });

    void initializeRecovery();
    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');

    const issue = passwordIssue(password);
    if (issue) {
      setError(issue);
      return;
    }
    if (password !== confirmation) {
      setError('The passwords do not match.');
      return;
    }

    setPending(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setPending(false);
      setError('The password could not be updated. The recovery link may have expired.');
      return;
    }

    await supabase.auth.signOut({ scope: 'local' });
    setMessage('Password updated. Returning to instructor sign in…');
    window.setTimeout(() => window.location.assign('/admin/login?reason=password-updated'), 700);
  }

  if (checking) {
    return <div className="setup-card" role="status"><Icon name="lock" size={30} /><h3>Preparing secure recovery</h3><p>Validating your single-use recovery session…</p></div>;
  }

  if (!ready) {
    return <div className="setup-card" role="alert"><Icon name="lock" size={30} /><h3>Recovery link unavailable</h3><p>{error || 'Request a fresh password-reset link.'}</p><Link className="back-link" href="/admin/forgot-password">Request a new recovery link</Link></div>;
  }

  return (
    <>
      <form className="login-form" onSubmit={submit}>
        <label><span>New password</span><input type="password" autoComplete="new-password" required minLength={12} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 12 characters" /></label>
        <label><span>Confirm new password</span><input type="password" autoComplete="new-password" required minLength={12} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="Re-enter your password" /></label>
        {error ? <div className="form-error" role="alert">{error}</div> : null}
        {message ? <div className="form-success" role="status">{message}</div> : null}
        <button className="button button--primary button--large button--full" type="submit" disabled={pending}>{pending ? 'Updating…' : 'Update password'} <Icon name="arrow" /></button>
      </form>
      <p className="login-security"><Icon name="lock" size={16} /> Use a unique password you do not reuse elsewhere.</p>
    </>
  );
}

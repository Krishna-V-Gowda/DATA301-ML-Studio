'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
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

export function ChangePasswordForm({ email }: { email: string }) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');

    const issue = passwordIssue(newPassword);
    if (issue) {
      setError(issue);
      return;
    }
    if (newPassword !== confirmation) {
      setError('The new passwords do not match.');
      return;
    }
    if (newPassword === currentPassword) {
      setError('Choose a password different from your current password.');
      return;
    }

    setPending(true);
    try {
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });
      if (verifyError) {
        setError('Your current password is incorrect.');
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
        data: { must_change_password: false },
      });
      if (updateError) {
        setError(updateError.message || 'The password could not be updated.');
        return;
      }

      setMessage('Password updated successfully. Sign in again with the new password.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmation('');
      await supabase.auth.signOut();
      window.setTimeout(() => router.replace('/admin/login?reason=password-updated'), 900);
    } catch {
      setError('The password service is temporarily unavailable. Please try again.');
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="admin-form account-form" onSubmit={submit}>
      <div className="form-grid">
        <label className="form-field form-field--wide">
          <span>Current password</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
        </label>
        <label className="form-field">
          <span>New password</span>
          <input
            type="password"
            autoComplete="new-password"
            minLength={12}
            required
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            aria-describedby="password-requirements"
          />
        </label>
        <label className="form-field">
          <span>Confirm new password</span>
          <input
            type="password"
            autoComplete="new-password"
            minLength={12}
            required
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
          />
        </label>
      </div>
      <p id="password-requirements" className="field-help">
        Use 12+ characters with uppercase, lowercase, a number, and a symbol.
      </p>
      {error ? <div className="form-error" role="alert">{error}</div> : null}
      {message ? <div className="form-success" role="status">{message}</div> : null}
      <div className="admin-form__actions">
        <button className="button button--primary" type="submit" disabled={pending}>
          {pending ? 'Updating…' : 'Update password'} <Icon name="lock" size={17} />
        </button>
      </div>
    </form>
  );
}

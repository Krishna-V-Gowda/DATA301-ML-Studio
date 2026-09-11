'use client';

import { useActionState } from 'react';
import { login, type LoginState } from '@/app/actions/auth';
import { Icon } from '@/components/ui/Icon';

const initialState: LoginState = {};

export function LoginForm({ nextPath }: { nextPath?: string }) {
  const [state, action, pending] = useActionState(login, initialState);
  return (
    <form className="login-form" action={action}>
      <input type="hidden" name="next" value={nextPath ?? '/admin'} />
      <label><span>Email address</span><input type="email" name="email" autoComplete="email" required placeholder="instructor@vidyashilp.edu.in" /></label>
      <label><span>Password</span><input type="password" name="password" autoComplete="current-password" required placeholder="••••••••••••" /></label>
      {state.error ? <div className="form-error" role="alert">{state.error}</div> : null}
      <button className="button button--primary button--large button--full" type="submit" disabled={pending}>{pending ? 'Signing in…' : 'Sign in securely'} <Icon name="arrow" /></button>
      <p><a className="back-link" href="/admin/forgot-password">Forgot your password?</a></p>
      <p className="login-security"><Icon name="lock" size={16} /> Access is restricted to approved admin and editor accounts.</p>
    </form>
  );
}

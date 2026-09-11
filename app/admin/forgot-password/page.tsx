import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { ForgotPasswordForm } from '@/components/admin/ForgotPasswordForm';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Reset Instructor Password', robots: { index: false, follow: false } };

export default function ForgotPasswordPage() {
  return (
    <main className="login-page">
      <div className="login-visual">
        <Link className="login-logo" href="/"><Image src="/brand/vidyashilp-university.png" alt="Vidyashilp University" width={190} height={70} /></Link>
        <div className="login-visual__content">
          <span className="eyebrow eyebrow--light">DATA301 administration</span>
          <h1>Recover secure course access.</h1>
          <p>Request a single-use password reset link for an approved administrator or editor account.</p>
          <div className="login-capabilities">
            <div><Icon name="lock" /><span><strong>Private</strong> Recovery stays inside the authenticated Supabase flow</span></div>
            <div><Icon name="check" /><span><strong>Single-use</strong> Reset links expire automatically</span></div>
            <div><Icon name="upload" /><span><strong>Continue</strong> Return to the instructor portal after recovery</span></div>
          </div>
        </div>
        <div className="login-field-art" aria-hidden="true"><i /><i /><i /><i /><i /><span /></div>
      </div>
      <div className="login-panel">
        <div className="login-panel__inner">
          <Link className="back-link" href="/admin/login">← Instructor sign in</Link>
          <span className="eyebrow">Account recovery</span>
          <h2>Reset your password</h2>
          <p>We'll send a secure recovery link to your administrator email.</p>
          {isSupabaseConfigured ? <ForgotPasswordForm /> : <div className="setup-card"><Icon name="settings" size={30} /><h3>Backend connection required</h3><p>Connect Supabase before using account recovery.</p></div>}
        </div>
      </div>
    </main>
  );
}

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { ResetPasswordForm } from '@/components/admin/ResetPasswordForm';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Set New Instructor Password', robots: { index: false, follow: false } };

export default function ResetPasswordPage() {
  return (
    <main className="login-page">
      <div className="login-visual">
        <Link className="login-logo" href="/"><Image src="/brand/data301-studio.svg" alt="DATA301 Machine Learning Studio" width={230} height={66} /></Link>
        <div className="login-visual__content">
          <span className="eyebrow eyebrow--light">DATA301 administration</span>
          <h1>Finish the secure recovery.</h1>
          <p>Set a new password and return to the protected instructor portal.</p>
          <div className="login-capabilities">
            <div><Icon name="lock" /><span><strong>Protected</strong> Recovery is valid only inside Supabase Auth</span></div>
            <div><Icon name="check" /><span><strong>Verified</strong> Your recovery session is checked before update</span></div>
            <div><Icon name="upload" /><span><strong>Ready</strong> Return directly to course administration</span></div>
          </div>
        </div>
        <div className="login-field-art" aria-hidden="true"><i /><i /><i /><i /><i /><span /></div>
      </div>
      <div className="login-panel">
        <div className="login-panel__inner">
          <Link className="back-link" href="/admin/login">← Instructor sign in</Link>
          <span className="eyebrow">Secure recovery</span>
          <h2>Set a new password</h2>
          <p>Your recovery link is single-use. Choose a strong password you will remember.</p>
          {isSupabaseConfigured ? <ResetPasswordForm /> : <div className="setup-card"><Icon name="settings" size={30} /><h3>Backend connection required</h3><p>Connect Supabase before using account recovery.</p></div>}
        </div>
      </div>
    </main>
  );
}

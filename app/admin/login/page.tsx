import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/admin/LoginForm';
import { Icon } from '@/components/ui/Icon';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getStaffUser } from '@/lib/supabase/auth';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Instructor Login', robots: { index: false, follow: false } };

const notices: Record<string, string> = {
  'authentication-required': 'Sign in with an approved instructor account to continue.',
  'password-updated': 'Your password was updated. Sign in with the new password.',
  'authentication-failed': 'The authentication link could not be completed. Please sign in again.',
  'missing-auth-code': 'The authentication link was incomplete. Please sign in again.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; reason?: string }>;
}) {
  const [params, staff] = await Promise.all([searchParams, getStaffUser()]);
  if (staff) redirect('/admin');

  const notice = params.reason ? notices[params.reason] : undefined;

  return (
    <main className="login-page">
      <div className="login-visual">
        <Link className="login-logo" href="/">
          <Image src="/brand/data301-studio.svg" alt="DATA301 Machine Learning Studio" width={230} height={66} />
        </Link>
        <div className="login-visual__content">
          <span className="eyebrow eyebrow--light">DATA301 administration</span>
          <h1>Publish the course as it unfolds.</h1>
          <p>Add presentations, notes, labs, datasets, and assignments without rebuilding the student website.</p>
          <div className="login-capabilities">
            <div><Icon name="upload" /><span><strong>Upload</strong>PDF, PPTX, DOCX, data, and lab files</span></div>
            <div><Icon name="check" /><span><strong>Review</strong>Draft, schedule, publish, and archive</span></div>
            <div><Icon name="lock" /><span><strong>Protect</strong>Role-based access and private storage</span></div>
          </div>
        </div>
        <div className="login-field-art" aria-hidden="true"><i /><i /><i /><i /><i /><span /></div>
      </div>
      <div className="login-panel">
        <div className="login-panel__inner">
          <Link className="back-link" href="/">← Student website</Link>
          <span className="eyebrow">Secure access</span>
          <h2>Instructor sign in</h2>
          <p>Use an approved administrator or editor account.</p>
          {notice ? <div className="form-success" role="status">{notice}</div> : null}
          {isSupabaseConfigured ? (
            <LoginForm nextPath={params.next} />
          ) : (
            <div className="setup-card">
              <Icon name="settings" size={30} />
              <h3>Backend connection required</h3>
              <p>Connect the application to Supabase before using the instructor workspace.</p>
              <ol>
                <li>Create the Supabase project.</li>
                <li>Run <code>supabase/schema.sql</code>.</li>
                <li>Add the values from <code>.env.example</code>.</li>
                <li>Create an Auth user and promote the profile to <code>admin</code>.</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

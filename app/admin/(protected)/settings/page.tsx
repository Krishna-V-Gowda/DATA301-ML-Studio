export const dynamic = 'force-dynamic';

import { ChangePasswordForm } from '@/components/admin/ChangePasswordForm';
import { Icon } from '@/components/ui/Icon';
import { requireStaff } from '@/lib/supabase/auth';

export default async function AdminSettingsPage() {
  const user = await requireStaff();

  return (
    <>
      <div className="admin-page-heading">
        <div>
          <span className="eyebrow">Account and security</span>
          <h1>Settings</h1>
          <p>Review your instructor account and maintain a strong sign-in password.</p>
        </div>
      </div>

      <div className="admin-settings-grid">
        <section className="admin-card">
          <div className="admin-card__heading">
            <div><span className="eyebrow">Signed-in account</span><h2>Profile</h2></div>
            <Icon name="lock" size={24} />
          </div>
          <dl className="account-details">
            <div><dt>Display name</dt><dd>{user.displayName}</dd></div>
            <div><dt>Email</dt><dd>{user.email}</dd></div>
            <div><dt>Access role</dt><dd><span className="role-pill">{user.role}</span></dd></div>
          </dl>
        </section>

        <section className="admin-card admin-card--wide">
          <div className="admin-card__heading">
            <div><span className="eyebrow">Credential security</span><h2>Change password</h2></div>
          </div>
          <p className="admin-card__intro">Verify your current password, then choose a unique replacement. You will be signed out after the update.</p>
          <ChangePasswordForm email={user.email} />
        </section>
      </div>
    </>
  );
}

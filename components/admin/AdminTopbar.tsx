import Link from 'next/link';
import { logout } from '@/app/actions/auth';
import { Icon } from '@/components/ui/Icon';
import type { StaffUser } from '@/lib/supabase/auth';

export function AdminTopbar({ user }: { user: StaffUser }) {
  const initials = user.displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return (
    <header className="admin-topbar">
      <div><span className="status-dot" /> <span>Instructor workspace</span></div>
      <div className="admin-user">
        <Link className="admin-user__profile" href="/admin/settings" aria-label="Open account settings">
          <span className="admin-avatar">{initials}</span>
          <div><strong>{user.displayName}</strong><small>{user.email}</small></div>
        </Link>
        <form action={logout}>
          <button className="icon-button" type="submit" aria-label="Sign out" title="Sign out"><Icon name="lock" size={18} /></button>
        </form>
      </div>
    </header>
  );
}

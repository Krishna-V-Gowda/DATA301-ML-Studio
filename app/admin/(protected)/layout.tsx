export const dynamic = 'force-dynamic';

import { AdminSidebar } from '@/components/admin/AdminSidebar';
import Link from 'next/link';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { requireStaff } from '@/lib/supabase/auth';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStaff();
  return (
    <div className="admin-shell">
      <AdminSidebar role={user.role} />
      <div className="admin-workspace"><AdminTopbar user={user} />{user.mustChangePassword ? <div className="admin-security-banner"><strong>Temporary password active.</strong><span>Replace it before managing course content.</span><Link href="/admin/settings">Change password →</Link></div> : null}<main className="admin-main">{children}</main></div>
    </div>
  );
}

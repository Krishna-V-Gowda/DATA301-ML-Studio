export const dynamic = 'force-dynamic';

import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { requireStaff } from '@/lib/supabase/auth';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStaff();
  return (
    <div className="admin-shell">
      <AdminSidebar role={user.role} />
      <div className="admin-workspace"><AdminTopbar user={user} /><main className="admin-main">{children}</main></div>
    </div>
  );
}

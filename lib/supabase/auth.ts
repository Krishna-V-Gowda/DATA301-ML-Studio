import { redirect } from 'next/navigation';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createClient } from '@/lib/supabase/server';

export type StaffRole = 'admin' | 'editor';

export type StaffUser = {
  id: string;
  email: string;
  displayName: string;
  role: StaffRole;
};

export async function getStaffUser(): Promise<StaffUser | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, role')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || !['admin', 'editor'].includes(profile.role)) return null;

  return {
    id: user.id,
    email: user.email ?? '',
    displayName: profile.display_name || user.email || 'Course administrator',
    role: profile.role as StaffRole,
  };
}

export async function requireStaff() {
  const staff = await getStaffUser();
  if (!staff) redirect('/admin/login?reason=authentication-required');
  return staff;
}

'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createClient } from '@/lib/supabase/server';
import { safeAdminPath } from '@/lib/security';

export type LoginState = { error?: string };

const LoginSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
  next: z.string().optional(),
});

export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  if (!isSupabaseConfigured) return { error: 'Supabase has not been connected yet.' };

  const parsed = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    next: formData.get('next') || undefined,
  });

  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check the form.' };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) return { error: 'The email or password is incorrect, or this account cannot sign in.' };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id ?? '')
    .maybeSingle();

  if (!profile || !['admin', 'editor'].includes(profile.role)) {
    await supabase.auth.signOut();
    return { error: 'This account does not have course-administration access.' };
  }

  redirect(safeAdminPath(parsed.data.next));
}

export async function logout() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect('/admin/login');
}

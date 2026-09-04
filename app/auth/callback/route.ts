import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { safeAdminPath } from '@/lib/security';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = safeAdminPath(url.searchParams.get('next'));

  if (!code) {
    return NextResponse.redirect(new URL('/admin/login?reason=missing-auth-code', request.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL('/admin/login?reason=authentication-failed', request.url));
  }

  return NextResponse.redirect(new URL(next, request.url));
}

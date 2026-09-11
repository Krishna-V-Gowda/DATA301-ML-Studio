import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  const publicAdminPaths = new Set(['/admin/login', '/admin/forgot-password', '/admin/reset-password']);

  if (pathname.startsWith('/admin') && !publicAdminPaths.has(pathname) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }


  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/auth/:path*'],
};

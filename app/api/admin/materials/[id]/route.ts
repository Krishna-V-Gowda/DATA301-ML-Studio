import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getStaffUser } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { isSupabaseServerConfigured } from '@/lib/supabase/server-config';

const MaterialId = z.string().uuid();

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const staff = await getStaffUser();
  if (!staff) {
    return NextResponse.redirect(new URL('/admin/login?reason=authentication-required', _request.url), 307);
  }

  if (!isSupabaseServerConfigured) {
    return NextResponse.json({ error: 'Private storage is not configured.' }, { status: 503 });
  }

  const parsedId = MaterialId.safeParse((await params).id);
  if (!parsedId.success) {
    return NextResponse.json({ error: 'Material not found.' }, { status: 404 });
  }

  const admin = createAdminClient();
  const { data: material, error } = await admin
    .from('materials')
    .select('storage_bucket,storage_path,file_name,mime_type')
    .eq('id', parsedId.data)
    .maybeSingle();

  if (error || !material) {
    return NextResponse.json({ error: 'Material not found.' }, { status: 404 });
  }

  const shouldDownload = !material.mime_type?.startsWith('application/pdf');
  const options = shouldDownload ? { download: material.file_name } : undefined;
  const { data: signed, error: signedError } = await admin.storage
    .from(material.storage_bucket)
    .createSignedUrl(material.storage_path, 90, options);

  if (signedError || !signed?.signedUrl) {
    return NextResponse.json({ error: 'Unable to create a private material link.' }, { status: 500 });
  }

  const response = NextResponse.redirect(signed.signedUrl, 307);
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}

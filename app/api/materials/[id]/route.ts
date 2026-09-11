import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { isSupabaseServerConfigured } from '@/lib/supabase/server-config';

const MaterialId = z.string().uuid();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const parsedId = MaterialId.safeParse((await params).id);
  if (!parsedId.success) {
    return NextResponse.json({ error: 'Material not found.' }, { status: 404 });
  }

  if (!isSupabaseServerConfigured) {
    return NextResponse.json({ error: 'Storage is not configured.' }, { status: 503 });
  }

  const admin = createAdminClient();
  const { data: material, error } = await admin
    .from('materials')
    .select('storage_bucket, storage_path, file_name, status, visibility, publish_at')
    .eq('id', parsedId.data)
    .eq('visibility', 'public')
    .in('status', ['published', 'scheduled'])
    .maybeSingle();

  if (error || !material || !material.publish_at) {
    return NextResponse.json({ error: 'Material not found.' }, { status: 404 });
  }

  if (new Date(material.publish_at) > new Date()) {
    return NextResponse.json({ error: 'Material is not published yet.' }, { status: 404 });
  }

  const { data: signed, error: signedError } = await admin.storage
    .from(material.storage_bucket)
    .createSignedUrl(material.storage_path, 90);

  if (signedError || !signed?.signedUrl) {
    return NextResponse.json({ error: 'Unable to create a download link.' }, { status: 500 });
  }

  const response = NextResponse.redirect(signed.signedUrl, 307);
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}

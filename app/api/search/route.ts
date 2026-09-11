import { NextResponse, type NextRequest } from 'next/server';
import { buildSearchDocuments } from '@/lib/search-index';
import { searchDocuments } from '@/lib/search-query';
import { getPublishedMaterials } from '@/lib/supabase/queries';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim().slice(0, 120) ?? '';
  const requestedType = request.nextUrl.searchParams.get('type')?.trim();
  const materials = await getPublishedMaterials();
  const documents = buildSearchDocuments(materials);
  const results = searchDocuments(documents, query, requestedType);

  return NextResponse.json({ query, count: results.length, results }, {
    headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' },
  });
}

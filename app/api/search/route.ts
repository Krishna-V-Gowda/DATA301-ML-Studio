import { NextResponse, type NextRequest } from 'next/server';
import { buildSearchDocuments } from '@/lib/search-index';
import { getPublishedMaterials } from '@/lib/supabase/queries';

function normalize(value: string) {
  return value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s-]/g, ' ');
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim().slice(0, 120) ?? '';
  const requestedType = request.nextUrl.searchParams.get('type')?.trim();
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const materials = await getPublishedMaterials();
  const documents = buildSearchDocuments(materials);

  const results = documents
    .filter((document) => !requestedType || requestedType === 'All' || document.type === requestedType)
    .map((document) => {
      const normalizedTitle = normalize(document.title);
      const normalizedDescription = normalize(document.description);
      const normalizedKeywords = document.keywords.map(normalize);
      const score = terms.reduce((total, term) => {
        return total
          + (normalizedTitle.includes(term) ? 5 : 0)
          + (normalizedDescription.includes(term) ? 2 : 0)
          + (normalizedKeywords.some((keyword) => keyword.includes(term)) ? 3 : 0);
      }, 0);
      return { ...document, score };
    })
    .filter((document) => terms.length === 0 || document.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, 30);

  return NextResponse.json({ query, count: results.length, results }, {
    headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' },
  });
}

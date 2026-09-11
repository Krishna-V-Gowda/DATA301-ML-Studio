import type { SearchDocument } from '@/lib/search-index';

function normalize(value: string) {
  return value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s-]/g, ' ');
}

export function searchDocuments(documents: SearchDocument[], query: string, requestedType?: string) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);

  return documents
    .filter((document) => !requestedType || requestedType === 'All' || document.type === requestedType)
    .map((document) => {
      const normalizedTitle = normalize(document.title);
      const normalizedDescription = normalize(document.description);
      const normalizedKeywords = document.keywords.map(normalize);
      const score = terms.reduce((total, term) => total
        + (normalizedTitle.includes(term) ? 5 : 0)
        + (normalizedDescription.includes(term) ? 2 : 0)
        + (normalizedKeywords.some((keyword) => keyword.includes(term)) ? 3 : 0), 0);
      return { ...document, score };
    })
    .filter((document) => terms.length === 0 || document.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, 30);
}
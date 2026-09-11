import type { Metadata } from 'next';
import { SearchClient } from '@/components/SearchClient';
import { buildSearchDocuments } from '@/lib/search-index';
import { getPublishedMaterials } from '@/lib/supabase/queries';

export const metadata: Metadata = { title: 'Search', description: 'Search DATA301 concepts, modules, labs, and course materials.' };

export default async function SearchPage() {
  const materials = await getPublishedMaterials();
  const documents = buildSearchDocuments(materials);

  return (
    <main id="main-content">
      <section className="search-hero">
        <div className="shell"><span className="eyebrow">Course search</span><h1>Find the concept behind the phrase.</h1><p>Search across explanations, related ideas, interactive labs, modules, and published materials.</p></div>
      </section>
      <section className="shell search-section"><SearchClient documents={documents} /></section>
    </main>
  );
}

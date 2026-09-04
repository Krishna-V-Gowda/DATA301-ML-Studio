import type { Metadata } from 'next';
import { ResourceLibrary } from '@/components/ResourceLibrary';
import { bibliography } from '@/lib/course-data';
import { getPublishedMaterials } from '@/lib/supabase/queries';

export const metadata: Metadata = { title: 'Resources', description: 'DATA301 notes, presentations, course documents, and reference material.' };

export default async function ResourcesPage() {
  const materials = await getPublishedMaterials();

  return (
    <main id="main-content">
      <section className="page-hero page-hero--resources">
        <div className="shell page-hero__grid">
          <div><span className="eyebrow">Resource library</span><h1>Course material that stays current with the class.</h1><p>Published files are versioned, organized by module and session, and managed through a secure instructor dashboard.</p></div>
          <div className="resource-count-card"><strong>{materials.length}</strong><span>published files</span><small>New material appears here without rebuilding the website.</small></div>
        </div>
      </section>
      <section className="section shell"><ResourceLibrary materials={materials} /></section>
      <section className="section section--paper">
        <div className="shell bibliography-grid">
          <div><span className="eyebrow">Reading foundation</span><h2>Textbooks and references that inform the curriculum.</h2><p>The studio presents bibliographic citations without redistributing copyrighted books or inventing download links.</p></div>
          <div className="bibliography-list">
            <section><h3>Textbooks</h3><ol>{bibliography.textbooks.map((item) => <li key={item}>{item}</li>)}</ol></section>
            <section><h3>References</h3><ol>{bibliography.references.map((item) => <li key={item}>{item}</li>)}</ol></section>
          </div>
        </div>
      </section>
    </main>
  );
}

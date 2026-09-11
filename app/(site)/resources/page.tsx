import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ResourceLibrary } from '@/components/ResourceLibrary';
import { Icon } from '@/components/ui/Icon';
import { bibliography } from '@/lib/course-data';
import { getPublishedMaterials } from '@/lib/supabase/queries';

export const metadata: Metadata = {
  title: 'Course Resources',
  description: 'The DATA301 Course Overview, Module 1 and Module 2 presentations, and instructor-managed learning resources.',
};

export default async function ResourcesPage() {
  const materials = await getPublishedMaterials();
  const hasModule2 = materials.some((material) => material.moduleSlug === 'supervised-learning');

  return (
    <main id="main-content">
      <section className="resource-hero-cosmic">
        <Image src="/campus/vu-campus-courtyard.webp" alt="" fill priority sizes="100vw" />
        <div className="resource-hero-cosmic__veil" />
        <div className="shell resource-hero-cosmic__grid">
          <div>
            <span className="eyebrow eyebrow--light">DATA301 resource library</span>
            <h1>Start with the course.<br /><em>Continue with the class.</em></h1>
            <p>The Course Overview is always first. Released module presentations, notes, datasets, labs, and assignments follow as the semester progresses.</p>
          </div>
          <aside className="resource-hero-cosmic__status">
            <span>Live library</span>
            <strong>{materials.length}</strong>
            <small>published resource{materials.length === 1 ? '' : 's'}</small>
            <div><i className={hasModule2 ? 'is-live' : ''} /><span>Module 2 {hasModule2 ? 'available' : 'syncing'}</span></div>
          </aside>
        </div>
      </section>

      <section className="section shell resource-library-cosmic">
        <div className="resource-order-note">
          <Icon name="book" size={24} />
          <div><strong>Learning order</strong><span>Course Overview → Module 2 → Module 1 → latest released material</span></div>
        </div>
        <ResourceLibrary materials={materials} />
        <aside className="private-resource-callout">
          <Icon name="lock" size={24} />
          <div><strong>Detailed Course Plan</strong><p>The internal 15-week planning document is retained in private course storage and is available only to approved administrators through the instructor portal.</p></div>
          <Link href="/admin/login">Instructor access <Icon name="arrow" size={16} /></Link>
        </aside>
      </section>

      <section className="section section--paper">
        <div className="shell bibliography-grid">
          <div><span className="eyebrow">Reading foundation</span><h2>Textbooks and references named in the course material.</h2><p>The supplied files list bibliographic references but do not provide verified download URLs for most titles, so the platform presents citations without fabricating links.</p></div>
          <div className="bibliography-list">
            <section><h3>Textbooks</h3><ol>{bibliography.textbooks.map((item) => <li key={item}>{item}</li>)}</ol></section>
            <section><h3>References</h3><ol>{bibliography.references.map((item) => <li key={item}>{item}</li>)}</ol></section>
          </div>
        </div>
      </section>
    </main>
  );
}

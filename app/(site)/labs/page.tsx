import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { labs } from '@/lib/labs-data';

export const metadata: Metadata = {
  title: 'Interactive Labs',
  description: 'Explore machine-learning concepts through focused interactive visualizations.',
};

export default function LabsPage() {
  return (
    <main id="main-content">
      <section className="page-hero page-hero--labs">
        <div className="shell page-hero__grid">
          <div><span className="eyebrow">Interactive labs</span><h1>Change one thing. Watch the model respond.</h1><p>Each experiment isolates a real concept so you can connect an action to its mathematical and practical consequence.</p></div>
          <div className="lab-principle-card"><Icon name="lab" size={34} /><strong>Every interaction must answer:</strong><p>“Does this help a student understand something better?”</p></div>
        </div>
      </section>

      <section className="section shell">
        <div className="lab-directory">
          {labs.map((lab) => (
            <Link className={`lab-directory-card lab-directory-card--${lab.accent}`} href={lab.href} key={lab.href}>
              <div className="lab-directory-card__index">{lab.index}</div>
              <div><span className="status-badge status-badge--live"><i /> Live</span><h2>{lab.title}</h2><p>{lab.description}</p><div className="topic-tags">{lab.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
              <div className="lab-directory-card__launch"><span>Launch</span><Icon name="arrow" /></div>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}

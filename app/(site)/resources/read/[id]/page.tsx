import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { materials } from '@/lib/course-data';

type PublicDoc = { id: string; title: string; eyebrow: string; paragraphs: string[]; note: string };

const docs: Record<string, PublicDoc> = {
  'public-course-guide': {
    id: 'public-course-guide',
    title: 'DATA301 Machine Learning Studio',
    eyebrow: 'Course Overview',
    paragraphs: [
      'Use the Course Overview to understand the four-module structure, then follow the learning roadmap into concept lessons, interactive laboratories, and published course materials.',
      'The live university deployment retrieves official presentations and documents from private course storage. This public source repository intentionally does not redistribute instructor-authored course binaries.',
    ],
    note: 'Public course guide · maintained with the released platform.',
  },
  'public-lab-guide': {
    id: 'public-lab-guide',
    title: 'Interactive Laboratory Guide',
    eyebrow: 'Module 1 — Implementation Guide',
    paragraphs: [
      'Each browser laboratory isolates a cause-and-effect relationship in Machine Learning. Change one control, observe the model response, interpret the result, and then continue into the course ML Lab repository for Python and Jupyter practice.',
    ],
    note: 'Public implementation guide · browser practice to Python/Jupyter.',
  },
  'public-module-2-guide': {
    id: 'public-module-2-guide',
    title: 'Module 2: Supervised Learning',
    eyebrow: 'Course Guide',
    paragraphs: [
      'This public guide introduces regression, classification, model evaluation, and generalization. Use the interactive laboratories to connect the concepts to model behaviour, then continue with the instructor-managed presentation when it is released.',
    ],
    note: 'Public module guide · supervised learning and evaluation.',
  },
};

export function generateStaticParams() { return Object.keys(docs).map((id) => ({ id })); }

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const doc = docs[id];
  return doc ? { title: doc.title, description: doc.paragraphs[0] } : { title: 'Resource' };
}

export default async function PublicResourceReader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doc = docs[id];
  if (!doc) notFound();
  const material = materials.find((item) => item.id === id);

  return (
    <main id="main-content" className="d6-page d6-resource-reader">
      <section className="d6-resource-reader__hero">
        <div className="d6-shell d6-resource-reader__hero-grid">
          <div>
            <Link className="d6-resource-reader__back" href="/resources">← Back to Resources</Link>
            <p className="d6-eyebrow" style={{ marginTop: 28 }}>{doc.eyebrow}</p>
            <h1>{doc.title}</h1>
          </div>
          <div className="d6-resource-reader__meta">
            <span>Public document</span>
            <strong>{material?.sizeLabel ?? '< 1 KB'}</strong>
            <span>Format</span>
            <strong>Readable web document</strong>
          </div>
        </div>
      </section>
      <section className="d6-resource-reader__body">
        <div className="d6-shell d6-resource-reader__sheet">
          <article className="d6-resource-reader__content">
            <h2>{doc.eyebrow}</h2>
            {doc.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </article>
          <aside className="d6-resource-reader__aside">
            <strong>Document context</strong>
            <p>{doc.note}</p>
          </aside>
        </div>
      </section>
    </main>
  );
}

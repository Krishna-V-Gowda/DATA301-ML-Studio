import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedMaterials } from '@/lib/supabase/queries';
import { ResourceLibrary } from '@/components/ResourceLibrary';
import { platform } from '@/lib/platform';

export const metadata: Metadata = { title: 'Resources', description: 'Published DATA301 course materials, references, and learning resources.' };

const bibliography = {
  textbooks: ['Tom M. Mitchell, Machine Learning.', 'Ethem Alpaydin, Introduction to Machine Learning.'],
  references: ['Christopher M. Bishop, Pattern Recognition and Machine Learning.', 'Trevor Hastie, Robert Tibshirani, Jerome Friedman, The Elements of Statistical Learning.'],
};

export default async function ResourcesPage() {
  const materials = await getPublishedMaterials();
  return <main id="main-content" className="d6-page d6-resources">
    <section className="d6-resource-hero"><div className="d6-shell d6-resource-hero__grid"><div><p className="d6-eyebrow">Resource library · DATA301</p><h1>Find the material.<em>Keep moving.</em></h1></div><div><p>The library is deliberately quiet: published course material, reliable metadata and a fast path to the next useful resource.</p><div className="d6-resource-count"><span>Published resources</span><strong>{materials.length}</strong></div></div></div></section>
    <section className="d6-resource-zone"><div className="d6-shell"><div className="d6-resource-layout"><div><p className="d6-resource-order">Course Overview → released modules → laboratories → latest published material</p><ResourceLibrary materials={materials}/></div><aside className="d6-resource-toolbar"><p className="d6-resource-toolbar__label">Library notes</p><p style={{margin:0,color:'var(--d6-ink-2)',fontSize:13,lineHeight:1.6}}>Public students see released material only. Instructor-managed planning remains protected behind authenticated access.</p><Link className="d6-text-link" href="/admin/login" style={{marginTop:20}}>Instructor portal <span>→</span></Link></aside></div><div className="d6-resource-reference"><div><p className="d6-eyebrow">Reading foundation</p><h2>References named in the course material.</h2><p>The library separates published files from bibliographic context; it never invents download links that are not supplied by the academic source.</p></div><div><div><p className="d6-smallcaps">Textbooks</p><ol>{bibliography.textbooks.map((item)=><li key={item}>{item}</li>)}</ol></div><div style={{marginTop:26}}><p className="d6-smallcaps">References</p><ol>{bibliography.references.map((item)=><li key={item}>{item}</li>)}</ol></div></div></div></div></section>
  </main>;
}

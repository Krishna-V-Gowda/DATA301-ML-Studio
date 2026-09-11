import type { Metadata } from 'next';
import Link from 'next/link';
import { LabRepositoryBridge } from '@/components/LabRepositoryBridge';
import { KnnLab } from '@/components/labs/KnnLab';

export const metadata: Metadata = { title: 'KNN Neighbourhood Lab', description: 'Explore K-nearest neighbours through an interactive local vote.' };

export default function KnnPage() {
  return (
    <main id="main-content" className="lab-page"><section className="lab-page-hero lab-page-hero--violet"><div className="shell"><Link className="back-link" href="/labs">← Interactive labs</Link><span className="eyebrow">Module 2 · Classification</span><h1>KNN Neighbourhood Lab</h1><p>Change K, move the query, and inspect exactly which nearby examples determine the class.</p></div></section><section className="shell lab-page__content"><KnnLab /></section><section className="shell lab-explanation"><div><span className="eyebrow">What to notice</span><h2>K controls how local the decision is.</h2></div><div className="explanation-grid"><article><span>01</span><h3>Small K</h3><p>Highly local decisions can follow detail but are sensitive to noise.</p></article><article><span>02</span><h3>Large K</h3><p>Broader neighbourhoods are smoother but can erase real minority structure.</p></article><article><span>03</span><h3>Scale first</h3><p>Distance only makes sense when feature units have been treated deliberately.</p></article></div></section><LabRepositoryBridge />
  </main>
  );
}

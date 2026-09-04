import type { Metadata } from 'next';
import Link from 'next/link';
import { KMeansLab } from '@/components/labs/KMeansLab';

export const metadata: Metadata = { title: 'K-Means Iteration Lab', description: 'Step through K-means assignments, centroid updates, and convergence.' };

export default function KMeansPage() {
  return (
    <main id="main-content" className="lab-page"><section className="lab-page-hero lab-page-hero--teal"><div className="shell"><Link className="back-link" href="/labs">← Interactive labs</Link><span className="eyebrow">Module 3 · Clustering</span><h1>K-Means Iteration Lab</h1><p>Advance the alternating optimization loop and watch centroids migrate toward compact groups.</p></div></section><section className="shell lab-page__content"><KMeansLab /></section><section className="shell lab-explanation"><div><span className="eyebrow">What to notice</span><h2>Assignments and centroids define each other.</h2></div><div className="explanation-grid"><article><span>01</span><h3>Initialization matters</h3><p>Different starting centroids can lead to different local solutions.</p></article><article><span>02</span><h3>Inertia falls</h3><p>Each update is designed not to increase within-cluster squared distance.</p></article><article><span>03</span><h3>Geometry is assumed</h3><p>K-means prefers compact, roughly spherical clusters with comparable scale.</p></article></div></section></main>
  );
}

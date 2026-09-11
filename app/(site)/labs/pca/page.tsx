import type { Metadata } from 'next';
import Link from 'next/link';
import { LabRepositoryBridge } from '@/components/LabRepositoryBridge';
import { PcaLab } from '@/components/labs/PcaLab';

export const metadata: Metadata = {
  title: 'PCA Projection Studio',
  description: 'Compare candidate projections with computed principal components and understand explained variance and standardization.',
};

export default function PcaPage() {
  return (
    <main id="main-content" className="lab-page">
      <section className="lab-page-hero"><div className="shell"><Link className="back-link" href="/labs">← Interactive labs</Link><span className="eyebrow">Module 3 · Dimensionality reduction</span><h1>PCA Projection Studio</h1><p>Compare any projection direction with the computed principal components—and see how feature scaling changes the result.</p></div></section>
      <section className="shell lab-page__content"><PcaLab /></section>
      <section className="shell lab-explanation"><div><span className="eyebrow">What to notice</span><h2>PCA preserves geometric variance, not target relevance.</h2></div><div className="explanation-grid"><article><span>01</span><h3>PC1</h3><p>The first principal component is the direction with maximum variance in the transformed features.</p></article><article><span>02</span><h3>Orthogonality</h3><p>PC2 is perpendicular to PC1 and captures the largest remaining variance.</p></article><article><span>03</span><h3>Scaling choice</h3><p>Standardize when measurement units would otherwise dominate the covariance structure for irrelevant numerical reasons.</p></article></div></section>
    <LabRepositoryBridge />
  </main>
  );
}

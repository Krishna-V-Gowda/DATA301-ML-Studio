import type { Metadata } from 'next';
import Link from 'next/link';
import { LabRepositoryBridge } from '@/components/LabRepositoryBridge';
import { SvmLab } from '@/components/labs/SvmLab';

export const metadata: Metadata = { title: 'Support Vector Machine Lab', description: 'Explore support vectors, margins, hinge loss, and the C penalty in a linear SVM.' };

export default function SvmPage() {
  return <main id="main-content" className="lab-page">
    <section className="lab-page-hero lab-page-hero--violet"><div className="shell"><Link className="back-link" href="/labs">← Interactive labs</Link><span className="eyebrow">Module 2 · Classification</span><h1>Support Vector Machine Lab</h1><p>See which observations become support vectors and how C trades a wide margin against classification violations.</p></div></section>
    <section className="shell lab-page__content"><SvmLab /></section>
    <section className="shell lab-explanation"><div><span className="eyebrow">What to notice</span><h2>The closest and violating points define the separator.</h2></div><div className="explanation-grid"><article><span>01</span><h3>Support vectors matter</h3><p>Most distant observations can move slightly without changing the optimum.</p></article><article><span>02</span><h3>C is a trade-off</h3><p>Low C regularizes more; high C penalizes violations more strongly.</p></article><article><span>03</span><h3>Margins express confidence</h3><p>The signed distance from the hyperplane is more informative than class alone.</p></article></div></section>
  <LabRepositoryBridge />
  </main>;
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { OverfittingLab } from '@/components/labs/OverfittingLab';

export const metadata: Metadata = {
  title: 'Overfitting & Generalization Lab',
  description: 'Change polynomial complexity, noise, and sample size to compare training error with unseen-data error.',
};

export default function OverfittingPage() {
  return (
    <main id="main-content" className="lab-page">
      <section className="lab-page-hero lab-page-hero--amber"><div className="shell"><Link className="back-link" href="/labs">← Interactive labs</Link><span className="eyebrow">Module 4 · Model building</span><h1>Overfitting & Generalization Lab</h1><p>Watch training error fall as complexity rises—then see why unseen-data error is the result that matters.</p></div></section>
      <section className="shell lab-page__content"><OverfittingLab /></section>
      <section className="shell lab-explanation"><div><span className="eyebrow">What to notice</span><h2>A flexible model can memorize evidence without learning the underlying relationship.</h2></div><div className="explanation-grid"><article><span>01</span><h3>Underfitting</h3><p>A model with too little capacity leaves systematic structure unexplained in both training and validation data.</p></article><article><span>02</span><h3>Useful complexity</h3><p>Add complexity only while it improves performance on observations that were not used to fit the model.</p></article><article><span>03</span><h3>Overfitting</h3><p>A widening train–validation gap signals that the model is learning sample-specific noise rather than only the reusable pattern.</p></article></div></section>
    </main>
  );
}

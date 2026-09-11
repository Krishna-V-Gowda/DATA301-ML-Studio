import type { Metadata } from 'next';
import Link from 'next/link';
import { LabRepositoryBridge } from '@/components/LabRepositoryBridge';
import { ConfusionMatrixLab } from '@/components/labs/ConfusionMatrixLab';

export const metadata: Metadata = { title: 'Confusion Matrix Explorer', description: 'Understand classification metrics by manipulating confusion-matrix outcomes.' };

export default function ConfusionMatrixPage() {
  return (
    <main id="main-content" className="lab-page"><section className="lab-page-hero lab-page-hero--amber"><div className="shell"><Link className="back-link" href="/labs">← Interactive labs</Link><span className="eyebrow">Modules 2–4 · Evaluation</span><h1>Confusion Matrix Explorer</h1><p>Change the four outcome counts and see how each metric answers a different operational question.</p></div></section><section className="shell lab-page__content"><ConfusionMatrixLab /></section><section className="shell lab-explanation"><div><span className="eyebrow">What to notice</span><h2>No metric is meaningful without the cost of errors.</h2></div><div className="explanation-grid"><article><span>01</span><h3>False alarms</h3><p>Increasing false positives lowers precision even when recall stays unchanged.</p></article><article><span>02</span><h3>Missed positives</h3><p>Increasing false negatives lowers recall and can be critical in high-stakes screening.</p></article><article><span>03</span><h3>Imbalance</h3><p>Accuracy can remain high while minority-class performance is unacceptable.</p></article></div></section><LabRepositoryBridge />
  </main>
  );
}

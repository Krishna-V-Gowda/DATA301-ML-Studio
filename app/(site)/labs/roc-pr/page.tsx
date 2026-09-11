import type { Metadata } from 'next';
import Link from 'next/link';
import { LabRepositoryBridge } from '@/components/LabRepositoryBridge';
import { RocPrLab } from '@/components/labs/RocPrLab';

export const metadata: Metadata = { title: 'ROC & Precision–Recall Lab', description: 'Link a classification threshold to ROC, precision–recall, confusion-matrix outcomes, and class imbalance.' };

export default function RocPrPage() {
  return <main id="main-content" className="lab-page">
    <section className="lab-page-hero lab-page-hero--teal"><div className="shell"><Link className="back-link" href="/labs">← Interactive labs</Link><span className="eyebrow">Module 2 · Evaluation</span><h1>ROC & Precision–Recall Lab</h1><p>Move the threshold once and follow the same operating point across two complementary evaluation curves.</p></div></section>
    <section className="shell lab-page__content"><RocPrLab /></section>
    <section className="shell lab-explanation"><div><span className="eyebrow">What to notice</span><h2>Threshold choice is a decision, not a property of the model.</h2></div><div className="explanation-grid"><article><span>01</span><h3>ROC separates rates</h3><p>It compares true-positive and false-positive rates across thresholds.</p></article><article><span>02</span><h3>PR focuses on positives</h3><p>Precision–recall is especially revealing when the positive class is rare.</p></article><article><span>03</span><h3>AUC summarizes ranking</h3><p>AUC compresses the curve, but the operating point still depends on real error costs.</p></article></div></section>
  <LabRepositoryBridge />
  </main>;
}

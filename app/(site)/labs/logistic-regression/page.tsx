import type { Metadata } from 'next';
import Link from 'next/link';
import { LabRepositoryBridge } from '@/components/LabRepositoryBridge';
import { LogisticRegressionLab } from '@/components/labs/LogisticRegressionLab';

export const metadata: Metadata = {
  title: 'Logistic Regression Lab',
  description: 'Shape probabilities with the sigmoid function, then move the classification threshold and watch the precision–recall trade-off.',
};

export default function LogisticRegressionPage() {
  return (
    <main id="main-content" className="lab-page">
      <section className="lab-page-hero lab-page-hero--violet"><div className="shell"><Link className="back-link" href="/labs">← Interactive labs</Link><span className="eyebrow">Module 2 · Classification</span><h1>Logistic Regression Lab</h1><p>Separate predicted probability from the final class decision—and see why the threshold depends on the cost of mistakes.</p></div></section>
      <section className="shell lab-page__content"><LogisticRegressionLab /></section>
      <section className="shell lab-explanation"><div><span className="eyebrow">What to notice</span><h2>The model outputs a probability; the threshold creates the class.</h2></div><div className="explanation-grid"><article><span>01</span><h3>Sigmoid mapping</h3><p>The linear score can range from negative to positive infinity, while the sigmoid maps it smoothly into 0–1.</p></article><article><span>02</span><h3>Decision boundary</h3><p>The boundary is the input where the predicted probability equals the selected threshold.</p></article><article><span>03</span><h3>Operational trade-off</h3><p>A screening system may favor recall, while a costly intervention may require higher precision.</p></article></div></section>
    <LabRepositoryBridge />
  </main>
  );
}

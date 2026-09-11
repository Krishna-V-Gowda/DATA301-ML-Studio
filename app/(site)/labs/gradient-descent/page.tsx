import type { Metadata } from 'next';
import Link from 'next/link';
import { LabRepositoryBridge } from '@/components/LabRepositoryBridge';
import { GradientDescentLab } from '@/components/labs/GradientDescentLab';

export const metadata: Metadata = {
  title: 'Gradient Descent Lab',
  description: 'Watch iterative optimization move down a loss function and see why learning rate controls convergence.',
};

export default function GradientDescentPage() {
  return (
    <main id="main-content" className="lab-page">
      <section className="lab-page-hero lab-page-hero--teal"><div className="shell"><Link className="back-link" href="/labs">← Interactive labs</Link><span className="eyebrow">Module 2 · Optimization</span><h1>Gradient Descent Lab</h1><p>Step through the update rule and see exactly when a learning rate converges, oscillates, or diverges.</p></div></section>
      <section className="shell lab-page__content"><GradientDescentLab /></section>
      <section className="shell lab-explanation"><div><span className="eyebrow">What to notice</span><h2>The gradient gives direction; the learning rate controls distance.</h2></div><div className="explanation-grid"><article><span>01</span><h3>Local slope</h3><p>The gradient points toward increasing loss, so the update moves in the opposite direction.</p></article><article><span>02</span><h3>Step size</h3><p>A very small learning rate is stable but slow; an excessive one can cross the minimum and amplify error.</p></article><article><span>03</span><h3>Convergence evidence</h3><p>Do not judge optimization from one step. Track both parameter movement and loss across iterations.</p></article></div></section>
    <LabRepositoryBridge />
  </main>
  );
}

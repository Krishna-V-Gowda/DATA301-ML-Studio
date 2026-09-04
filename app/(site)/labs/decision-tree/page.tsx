import type { Metadata } from 'next';
import Link from 'next/link';
import { DecisionTreeLab } from '@/components/labs/DecisionTreeLab';

export const metadata: Metadata = { title: 'Decision Tree Lab', description: 'Explore Gini impurity, recursive splits, tree depth, and overfitting in a live classifier.' };

export default function DecisionTreePage() {
  return <main id="main-content" className="lab-page">
    <section className="lab-page-hero lab-page-hero--amber"><div className="shell"><Link className="back-link" href="/labs">← Interactive labs</Link><span className="eyebrow">Module 2 · Classification</span><h1>Decision Tree Lab</h1><p>Watch a tree turn Gini reduction into recursive decision regions—and see when extra depth starts fitting noise.</p></div></section>
    <section className="shell lab-page__content"><DecisionTreeLab /></section>
    <section className="shell lab-explanation"><div><span className="eyebrow">What to notice</span><h2>A tree learns a sequence of conditional questions.</h2></div><div className="explanation-grid"><article><span>01</span><h3>Impurity drives splits</h3><p>A candidate split is useful only when its children are purer than the parent node.</p></article><article><span>02</span><h3>Depth controls flexibility</h3><p>Shallow trees may underfit; deep trees can isolate individual noisy observations.</p></article><article><span>03</span><h3>Leaves are regions</h3><p>Every colored region corresponds to a leaf and one final class prediction.</p></article></div></section>
  </main>;
}

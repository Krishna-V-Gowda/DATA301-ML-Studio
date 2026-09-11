import type { Metadata } from 'next';
import Link from 'next/link';
import { LabRepositoryBridge } from '@/components/LabRepositoryBridge';
import { EnsembleLab } from '@/components/labs/EnsembleLab';

export const metadata: Metadata = { title: 'Ensemble Learning Lab', description: 'Compare one decision tree with a bootstrap ensemble and inspect majority-vote confidence.' };

export default function EnsemblePage() {
  return <main id="main-content" className="lab-page">
    <section className="lab-page-hero lab-page-hero--cobalt"><div className="shell"><Link className="back-link" href="/labs">← Interactive labs</Link><span className="eyebrow">Module 2 · Ensemble learning</span><h1>Ensemble Learning Lab</h1><p>Compare one unstable tree with a bagged majority vote and watch agreement produce a steadier boundary.</p></div></section>
    <section className="shell lab-page__content"><EnsembleLab /></section>
    <section className="shell lab-explanation"><div><span className="eyebrow">What to notice</span><h2>Diversity is useful only when learners are combined.</h2></div><div className="explanation-grid"><article><span>01</span><h3>Bootstrap samples differ</h3><p>Each tree sees a slightly different training set and therefore makes different errors.</p></article><article><span>02</span><h3>Voting reduces variance</h3><p>Majority aggregation stabilizes predictions that depend too heavily on one sample.</p></article><article><span>03</span><h3>Agreement is confidence</h3><p>The vote fraction exposes where the ensemble is decisive or uncertain.</p></article></div></section>
  <LabRepositoryBridge />
  </main>;
}

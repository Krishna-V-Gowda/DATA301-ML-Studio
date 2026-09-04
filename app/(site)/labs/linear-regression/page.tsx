import type { Metadata } from 'next';
import Link from 'next/link';
import { LinearRegressionLab } from '@/components/labs/LinearRegressionLab';

export const metadata: Metadata = { title: 'Linear Regression Studio', description: 'Explore regression lines, residuals, and mean squared error interactively.' };

export default function LinearRegressionPage() {
  return (
    <main id="main-content" className="lab-page">
      <section className="lab-page-hero"><div className="shell"><Link className="back-link" href="/labs">← Interactive labs</Link><span className="eyebrow">Module 2 · Regression</span><h1>Linear Regression Studio</h1><p>Move the data, tune the line, and watch residual error translate geometry into an objective.</p></div></section>
      <section className="shell lab-page__content"><LinearRegressionLab /></section>
      <section className="shell lab-explanation"><div><span className="eyebrow">What to notice</span><h2>The fitted line is a compromise across every residual.</h2></div><div className="explanation-grid"><article><span>01</span><h3>Residual direction</h3><p>Points above the line have positive residuals; points below it have negative residuals.</p></article><article><span>02</span><h3>Squared penalty</h3><p>Squaring prevents signs from cancelling and makes large misses disproportionately influential.</p></article><article><span>03</span><h3>Generalization</h3><p>A lower training MSE is useful only when the relationship remains stable on unseen data.</p></article></div></section>
    </main>
  );
}

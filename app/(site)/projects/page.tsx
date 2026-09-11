import type { Metadata } from 'next';
import { Icon } from '@/components/ui/Icon';

export const metadata: Metadata = { title: 'Projects', description: 'Project-based learning guidance for DATA301 Machine Learning.' };

const projectIdeas = [
  { level: 'Beginner', title: 'House-price regression audit', objective: 'Build and evaluate a regression pipeline while diagnosing preprocessing and residual errors.', concepts: ['Preprocessing', 'Linear regression', 'MSE / R²'], output: 'Notebook, short report, reproducible pipeline' },
  { level: 'Intermediate', title: 'Customer-segmentation study', objective: 'Explore a dataset, cluster samples, evaluate structure, and communicate what the groups do and do not mean.', concepts: ['Scaling', 'K-means', 'PCA'], output: 'Notebook, visual analysis, limitations memo' },
  { level: 'Intermediate', title: 'Imbalanced classification investigation', objective: 'Compare classifiers and thresholds where accuracy alone is misleading.', concepts: ['Classification', 'Confusion matrix', 'Precision / recall'], output: 'Model comparison, metric rationale, error analysis' },
  { level: 'Advanced', title: 'Small-data transfer and compression study', objective: 'Design an experiment around learning with limited data or reducing model complexity without fabricating results.', concepts: ['Model selection', 'Validation', 'Research design'], output: 'Proposal, experiment plan, code, final presentation' },
];

export default function ProjectsPage() {
  return (
    <main id="main-content">
      <section className="page-hero page-hero--projects"><div className="shell page-hero__grid"><div><span className="eyebrow">Project-based learning</span><h1>Turn the course into evidence that you can solve a problem.</h1><p>Projects are framed around a dataset, a measurable objective, an honest evaluation plan, and a clear explanation of limitations.</p></div><div className="project-process"><span>Question</span><i>→</i><span>Data</span><i>→</i><span>Baseline</span><i>→</i><span>Evidence</span><i>→</i><span>Iteration</span></div></div></section>
      <section className="section shell"><div className="project-grid">{projectIdeas.map((project, index) => <article className="project-card" key={project.title}><div className="project-card__top"><span>{String(index + 1).padStart(2, '0')}</span><b>{project.level}</b></div><h2>{project.title}</h2><p>{project.objective}</p><div className="topic-tags">{project.concepts.map((concept) => <span key={concept}>{concept}</span>)}</div><div className="project-output"><Icon name="file" size={18} /><span><strong>Expected output</strong>{project.output}</span></div></article>)}</div></section>
      <section className="section section--ink"><div className="shell project-requirements"><div><span className="eyebrow eyebrow--light">Official project expectations</span><h2>A complete submission is more than a model score.</h2><p className="section-lead section-lead--light">The supplied course overview requires teams of up to three students, a selected title and scope, mid-review presentation and viva, and a final package including report, presentation, source code, and a README.</p></div><div className="requirement-list"><div><span>01</span><p>Define title, inputs, outputs, dataset, and scope.</p></div><div><span>02</span><p>Conduct literature survey and establish a model baseline.</p></div><div><span>03</span><p>Present preliminary results and a credible further plan.</p></div><div><span>04</span><p>Submit report, presentation, source code, and README.</p></div><div><span>05</span><p>Demonstrate code and defend decisions through viva.</p></div></div></div></section>
    </main>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { CourseLabRepository } from '@/components/CourseLabRepository';
import { Icon } from '@/components/ui/Icon';
import { labs } from '@/lib/labs-data';

export const metadata: Metadata = {
  title: 'Interactive Labs',
  description: 'Twelve interactive Machine Learning laboratories connected to DATA301 concepts and practical course work.',
};

const groups = [
  { title: 'Regression & optimization', ids: ['linear-regression', 'gradient-descent', 'overfitting'] },
  { title: 'Classification & boundaries', ids: ['logistic-regression', 'knn', 'decision-tree', 'svm'] },
  { title: 'Unsupervised learning', ids: ['kmeans', 'pca'] },
  { title: 'Evaluation & ensembles', ids: ['confusion-matrix', 'roc-pr', 'ensemble'] },
];

export default function LabsPage() {
  return (
    <main id="main-content">
      <section className="labs-hero-cosmic">
        <div className="labs-hero-cosmic__field" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
        <div className="shell labs-hero-cosmic__grid">
          <div><span className="eyebrow eyebrow--light">DATA301 interactive laboratory</span><h1>Change the model.<br /><em>See the consequence.</em></h1><p>Twelve focused experiments connect geometry, parameters, uncertainty, error, and generalization to the formal ideas taught in the course.</p><div className="labs-hero-cosmic__proof"><span><strong>12</strong> live labs</span><span><strong>4</strong> learning families</span><span><strong>1</strong> connected course journey</span></div></div>
          <div className="lab-principle-card lab-principle-card--cosmic"><Icon name="lab" size={38} /><strong>Laboratory principle</strong><p>Every control must reveal a cause-and-effect relationship that a student can explain.</p><small>Manipulate → Observe → Interpret → Implement</small></div>
        </div>
      </section>

      <section className="section shell"><CourseLabRepository /></section>

      <section className="section section--paper">
        <div className="shell lab-family-directory">
          {groups.map((group, groupIndex) => (
            <section className="lab-family" key={group.title}>
              <header><span>0{groupIndex + 1}</span><div><small>Laboratory family</small><h2>{group.title}</h2></div></header>
              <div className="lab-directory">
                {group.ids.map((id) => {
                  const lab = labs.find((item) => item.id === id);
                  if (!lab) return null;
                  return (
                    <Link className={`lab-directory-card lab-directory-card--${lab.accent}`} href={lab.href} key={lab.href}>
                      <div className="lab-directory-card__index">{lab.index}</div>
                      <div><span className="status-badge status-badge--live"><i /> Live</span><h3>{lab.title}</h3><p>{lab.description}</p><div className="topic-tags">{lab.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
                      <div className="lab-directory-card__launch"><span>Launch</span><Icon name="arrow" /></div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="section shell labs-closing-cta"><div><span className="eyebrow">Learn before and after the interaction</span><h2>Each laboratory sits inside the course—not beside it.</h2><p>Use the linked topic pages for intuition and mathematics, then continue to the instructor repository for practical Python/Jupyter work.</p></div><Link className="button button--primary button--large" href="/learn/module/supervised-learning">Enter Module 2 <Icon name="arrow" /></Link></section>
    </main>
  );
}

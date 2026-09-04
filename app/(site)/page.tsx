import Link from 'next/link';
import { HeroDecisionField } from '@/components/HeroDecisionField';
import { LearningRoadmap } from '@/components/LearningRoadmap';
import { MaterialCard } from '@/components/MaterialCard';
import { ModuleCard } from '@/components/ModuleCard';
import { SectionHeading } from '@/components/SectionHeading';
import { Icon } from '@/components/ui/Icon';
import { course, modules } from '@/lib/course-data';
import { getPublishedMaterials } from '@/lib/supabase/queries';

const labCards = [
  {
    href: '/labs/linear-regression',
    title: 'Linear Regression Studio',
    description: 'Drag data points, inspect residuals, tune slope and intercept, and watch error change.',
    tag: 'Supervised',
    motif: 'line',
  },
  {
    href: '/labs/knn',
    title: 'KNN Neighbourhood Lab',
    description: 'Move a query point, change K, and see the local vote redraw the prediction.',
    tag: 'Classification',
    motif: 'knn',
  },
  {
    href: '/labs/kmeans',
    title: 'K-Means Iteration Lab',
    description: 'Advance assignment and centroid updates step by step until clusters converge.',
    tag: 'Unsupervised',
    motif: 'clusters',
  },
  {
    href: '/labs/confusion-matrix',
    title: 'Metric Explorer',
    description: 'Manipulate TP, TN, FP, and FN to understand accuracy, precision, recall, and F1.',
    tag: 'Evaluation',
    motif: 'matrix',
  },
];

export default async function HomePage() {
  const materials = await getPublishedMaterials();
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${course.code}: ${course.title}`,
    description: course.description,
    provider: {
      '@type': 'CollegeOrUniversity',
      name: 'DATA301 Machine Learning Studio',
    },
    educationalLevel: 'Undergraduate',
    numberOfCredits: course.credits,
  };

  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="hero-section">
        <div className="hero-orbit hero-orbit--one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit--two" aria-hidden="true" />
        <div className="shell hero-grid">
          <div className="hero-copy">
            <div className="hero-kicker"><span>DATA301</span> Semester V · 2026</div>
            <h1>Don’t just learn the algorithm. <em>See why it works.</em></h1>
            <p>
              A visual, rigorous, and practice-led Machine Learning course—from first principles and data preparation to model building, evaluation, and projects.
            </p>
            <div className="hero-actions">
              <Link className="button button--primary button--large" href="/learn">
                Start learning <Icon name="arrow" />
              </Link>
              <Link className="button button--glass button--large" href="/labs">
                Open the labs <Icon name="lab" />
              </Link>
            </div>
            <div className="hero-proof">
              <div><strong>15</strong><span>weeks</span></div>
              <div><strong>30</strong><span>lecture hours</span></div>
              <div><strong>60</strong><span>practice hours</span></div>
              <div><strong>4</strong><span>connected modules</span></div>
            </div>
          </div>
          <HeroDecisionField />
        </div>
      </section>

      <section className="signal-strip" aria-label="Course learning model">
        <div className="shell signal-strip__inner">
          <span>Intuition</span><i>→</i><span>Visualization</span><i>→</i><span>Mathematics</span><i>→</i><span>Algorithm</span><i>→</i><span>Implementation</span><i>→</i><span>Judgement</span>
        </div>
      </section>

      <section className="section shell">
        <SectionHeading
          eyebrow="The course architecture"
          title="One coherent learning path—not a folder of PDFs."
          description="Every module connects prerequisite ideas, lecture material, hands-on practice, evaluation, and the next concept to learn."
          action={<Link className="text-link" href="/learn">View full roadmap <Icon name="arrow" size={18} /></Link>}
        />
        <div className="module-grid">
          {modules.map((module) => <ModuleCard module={module} key={module.slug} />)}
        </div>
      </section>

      <section className="section section--ink">
        <div className="shell split-section">
          <div>
            <span className="eyebrow eyebrow--light">Learning roadmap</span>
            <h2>Always know where you are, why it matters, and what comes next.</h2>
            <p className="section-lead section-lead--light">
              The roadmap turns the official 15-week schedule into a visible chain of ideas—from data and representations through supervised and unsupervised learning to model selection and perceptrons.
            </p>
            <Link className="button button--light" href="/learn">Explore the map <Icon name="arrow" /></Link>
          </div>
          <LearningRoadmap compact />
        </div>
      </section>

      <section className="section shell">
        <SectionHeading
          eyebrow="Interactive understanding"
          title="Manipulate the idea until it becomes intuitive."
          description="Each lab exposes the model’s moving parts. The interaction exists to explain cause and effect—not to decorate the page."
          action={<Link className="text-link" href="/labs">All interactive labs <Icon name="arrow" size={18} /></Link>}
        />
        <div className="lab-card-grid">
          {labCards.map((lab) => (
            <Link className={`lab-feature-card lab-feature-card--${lab.motif}`} href={lab.href} key={lab.href}>
              <div className="lab-feature-card__visual" aria-hidden="true">
                <span /><span /><span /><span /><span /><i />
              </div>
              <div className="lab-feature-card__body">
                <span className="mini-pill">{lab.tag}</span>
                <h3>{lab.title}</h3>
                <p>{lab.description}</p>
                <b>Launch lab <Icon name="play" size={16} /></b>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section section--paper">
        <div className="shell">
          <SectionHeading
            eyebrow="Current course materials"
            title="The latest notes, presentations, and course documents."
            description="Materials are versioned and published through the instructor dashboard, so this library can grow alongside the class."
            action={<Link className="text-link" href="/resources">Browse library <Icon name="arrow" size={18} /></Link>}
          />
          {materials.length ? (
            <div className="material-grid">
              {materials.slice(0, 3).map((material) => <MaterialCard material={material} key={material.id} />)}
            </div>
          ) : (
            <div className="empty-state"><h3>Course materials are being connected.</h3><p>The learning platform remains available while the private resource library completes synchronization.</p></div>
          )}
        </div>
      </section>

      <section className="section shell">
        <div className="course-cta">
          <div>
            <span className="eyebrow">Your next step</span>
            <h2>Begin with Module 1: Foundations & Data.</h2>
            <p>Understand the learning problem, inspect the data, and build the vocabulary every later model depends on.</p>
          </div>
          <Link className="button button--primary button--large" href="/learn/module/introduction-and-data">
            Enter Module 1 <Icon name="arrow" />
          </Link>
        </div>
      </section>
    </main>
  );
}

import Link from 'next/link';
import { CampusStory } from '@/components/CampusStory';
import { CosmicHero } from '@/components/CosmicHero';
import { CourseOverviewPanel } from '@/components/CourseOverviewPanel';
import { LearningRoadmap } from '@/components/LearningRoadmap';
import { MaterialCard } from '@/components/MaterialCard';
import { Module2Launchpad } from '@/components/Module2Launchpad';
import { ModuleCard } from '@/components/ModuleCard';
import { SectionHeading } from '@/components/SectionHeading';
import { Icon } from '@/components/ui/Icon';
import { course, modules } from '@/lib/course-data';
import { labs } from '@/lib/labs-data';
import { getPublishedMaterials } from '@/lib/supabase/queries';

const signatureLabs = ['linear-regression', 'gradient-descent', 'decision-tree', 'roc-pr'];

function orderFeaturedMaterials<T extends { title: string; moduleSlug?: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    const priority = (item: T) => {
      if (item.title === 'DATA301 Course Overview') return 0;
      if (item.moduleSlug === 'supervised-learning') return 1;
      if (item.moduleSlug === 'introduction-and-data') return 2;
      return 3;
    };
    return priority(a) - priority(b);
  });
}

export default async function HomePage() {
  const materials = orderFeaturedMaterials(await getPublishedMaterials());
  const featuredLabs = signatureLabs.map((id) => labs.find((lab) => lab.id === id)).filter(Boolean);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${course.code}: ${course.title}`,
    description: course.description,
    provider: { '@type': 'CollegeOrUniversity', name: 'Vidyashilp University' },
    educationalLevel: 'Undergraduate',
    numberOfCredits: course.credits,
  };

  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <CosmicHero />

      <section className="section shell section--overview-first">
        <CourseOverviewPanel />
      </section>

      <section className="signal-strip signal-strip--cosmic" aria-label="Course learning model">
        <div className="shell signal-strip__inner">
          <span>Intuition</span><i>→</i><span>Visualization</span><i>→</i><span>Mathematics</span><i>→</i><span>Implementation</span><i>→</i><span>Evaluation</span><i>→</i><span>Judgement</span>
        </div>
      </section>

      <section className="section shell">
        <Module2Launchpad />
      </section>

      <section className="section section--ink section--roadmap-cosmic">
        <div className="shell split-section">
          <div>
            <span className="eyebrow eyebrow--light">The learning architecture</span>
            <h2>Every concept has a position, a purpose, and a next step.</h2>
            <p className="section-lead section-lead--light">
              The official fifteen-week sequence becomes a visible chain—from data preparation and supervised
              learning to clustering, model selection, and perceptron-based reasoning.
            </p>
            <Link className="button button--light" href="/learn">Explore the complete roadmap <Icon name="arrow" /></Link>
          </div>
          <LearningRoadmap compact />
        </div>
      </section>

      <section className="section shell">
        <SectionHeading
          eyebrow="Four connected modules"
          title="A course that accumulates understanding—not isolated chapters."
          description="Each module carries forward the vocabulary, mathematics, practice, and judgement developed before it."
          action={<Link className="text-link" href="/learn">Browse every concept <Icon name="arrow" size={18} /></Link>}
        />
        <div className="module-grid module-grid--cosmic">
          {modules.map((module) => <ModuleCard module={module} key={module.slug} />)}
        </div>
      </section>

      <section className="section section--paper lab-showcase-cosmic">
        <div className="shell">
          <SectionHeading
            eyebrow="Signature learning laboratories"
            title="Do not memorize the behaviour. Interrogate it."
            description="Twelve inspectable experiments expose the moving parts of Machine Learning—parameters, geometry, error, uncertainty, and generalization."
            action={<Link className="text-link" href="/labs">Enter all 12 labs <Icon name="arrow" size={18} /></Link>}
          />
          <div className="cosmic-lab-grid">
            {featuredLabs.map((lab) => lab ? (
              <Link className={`cosmic-lab-card cosmic-lab-card--${lab.accent}`} href={lab.href} key={lab.id}>
                <span className="cosmic-lab-card__index">{lab.index}</span>
                <div className="cosmic-lab-card__field" aria-hidden="true"><i /><i /><i /><i /><b /></div>
                <div><small>{lab.tags.join(' · ')}</small><h3>{lab.title}</h3><p>{lab.description}</p><strong>Launch experiment <Icon name="play" size={15} /></strong></div>
              </Link>
            ) : null)}
          </div>
        </div>
      </section>

      <section className="section section--campus-cosmic">
        <div className="shell"><CampusStory /></div>
      </section>

      <section className="section shell">
        <SectionHeading
          eyebrow="Current course materials"
          title="Course overview first. Current modules immediately after."
          description="The public library shows only released materials. The detailed course plan remains private inside the instructor portal."
          action={<Link className="text-link" href="/resources">Browse the resource library <Icon name="arrow" size={18} /></Link>}
        />
        {materials.length ? (
          <div className="material-grid material-grid--featured">
            {materials.slice(0, 3).map((material) => <MaterialCard material={material} key={material.id} />)}
          </div>
        ) : (
          <div className="empty-state"><h3>The private resource library is synchronizing.</h3><p>The course lessons and laboratories remain available while materials are connected.</p></div>
        )}
      </section>

      <section className="section shell section--final-cta">
        <div className="course-cta course-cta--cosmic">
          <div><span className="eyebrow">Continue the course</span><h2>Enter Module 2: Supervised Learning.</h2><p>Connect the official presentation to regression, classification, evaluation, and six interactive laboratories.</p></div>
          <Link className="button button--primary button--large" href="/learn/module/supervised-learning">Enter Module 2 <Icon name="arrow" /></Link>
        </div>
      </section>
    </main>
  );
}

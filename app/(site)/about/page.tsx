import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { platform } from '@/lib/platform';

export const metadata: Metadata = {
  title: 'About the Platform',
  description: 'About the DATA301 learning platform, its academic purpose, and development credits.',
};

export default function AboutPage() {
  return (
    <main id="main-content">
      <section className="page-hero page-hero--course page-hero--about-cosmic">
        <div className="shell page-hero__grid">
          <div><span className="eyebrow">About the platform</span><h1>A digital laboratory for learning Machine Learning.</h1><p>DATA301 ML Studio connects the course sequence, interactive model behaviour, formal explanations, implementation pathways, and instructor-managed resources in one coherent environment.</p></div>
          <figure className="about-campus-frame"><Image src="/campus/vu-campus-courtyard.webp" alt="Vidyashilp University campus" fill sizes="(max-width: 900px) 90vw, 520px" /></figure>
        </div>
      </section>

      <section className="section shell about-platform-grid">
        <article><span className="eyebrow">Why it exists</span><h2>Static notes describe a model. Interaction reveals its behaviour.</h2><p>The platform is designed so that a student can first understand the intuition, manipulate the model, connect the result to mathematics, and then continue into implementation and evaluation.</p></article>
        <div className="about-principle-stack">
          <article><strong>See</strong><p>Visualize geometry, boundaries, residuals, margins, clusters, and metrics.</p></article>
          <article><strong>Manipulate</strong><p>Change parameters and observe the consequence immediately.</p></article>
          <article><strong>Explain</strong><p>Translate the visual outcome into a mathematical and practical reason.</p></article>
          <article><strong>Implement</strong><p>Continue into Python/Jupyter course work and project practice.</p></article>
        </div>
      </section>

      <section className="section section--paper">
        <div className="shell credits-cosmic">
          <div>
            <Image src="/brand/vidyashilp-university.png" alt="Vidyashilp University" width={210} height={76} />
            <span className="eyebrow">Academic context</span>
            <h2>DATA301 · Machine Learning</h2>
            <p>Course instruction and academic materials: {platform.instructor.name}, Vidyashilp University.</p>
            <Link href={platform.universityUrl} target="_blank" rel="noreferrer">Visit Vidyashilp University <Icon name="external" size={16} /></Link>
          </div>
          <div className="credits-cosmic__developer">
            <span className="eyebrow">Platform development</span>
            <h2>{platform.developer.name}</h2>
            <p>{platform.developer.role}. Product architecture, interface design, interactive laboratories, backend integration, release engineering, and ongoing platform development.</p>
            <div><Link href={platform.developer.repository} target="_blank" rel="noreferrer"><Icon name="github" size={18} /> View source repository</Link><Link href={platform.developer.github} target="_blank" rel="noreferrer">Developer profile <Icon name="external" size={16} /></Link></div>
          </div>
        </div>
      </section>

      <section className="section shell"><div className="rights-note"><Icon name="spark" /><p><strong>Attribution boundary:</strong> platform software and original interactive experiences are credited to Krishna V Gowda; course content and supplied academic materials remain attributed to Dr. Shabbeer Basha and Vidyashilp University.</p></div></section>
    </main>
  );
}

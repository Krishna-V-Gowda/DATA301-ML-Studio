import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { platform } from '@/lib/platform';

export const metadata: Metadata = {
  title: 'About DATA301',
  description:
    'The academic setting, learning philosophy, campus context, and platform authorship behind DATA301 Machine Learning Studio.',
};

export default function AboutPage() {
  return (
    <main id="main-content" className="d6-page d6-about d6-about-godshot">
      <section className="d6-about-hero">
        <div className="d6-shell d6-about-hero__grid">
          <div className="d6-about-hero__copy">
            <p className="d6-eyebrow">DATA301 · Vidyashilp University</p>
            <h1>
              <span>Learning happens in a place.</span>
              <em>It should feel like one.</em>
            </h1>
          </div>
          <aside className="d6-about-hero__aside" aria-label="About DATA301">
            <p>
              DATA301 ML Studio is a course environment designed around seeing, changing,
              explaining, and implementing machine-learning ideas.
            </p>
            <dl>
              <div><dt>Course</dt><dd>DATA301</dd></div>
              <div><dt>School</dt><dd>Engineering &amp; Technology</dd></div>
              <div><dt>Method</dt><dd>Learn · test · explain</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <figure className="d6-about-godshot__hero-media">
        <Image
          src="/campus/vu-campus-wide.webp"
          alt="Vidyashilp University founding campus"
          fill
          priority
          sizes="100vw"
          quality={85}
        />
        <figcaption>
          <span>Founding campus</span>
          <span>School of Engineering &amp; Technology</span>
        </figcaption>
      </figure>

      <section className="d6-about-setting d6-about-godshot__setting">
        <div className="d6-shell d6-about-setting__grid">
          <div>
            <p className="d6-eyebrow">The setting</p>
            <h2>A university course with a digital front door.</h2>
          </div>
          <div className="d6-about-setting__copy">
            <p>
              DATA301 sits within the School of Engineering &amp; Technology. The platform
              carries that context into the interface: a real course sequence, real
              laboratories, published material, instructor administration, and a visible
              connection to campus.
            </p>
            <Link href="/course">Explore the course <Icon name="arrow" size={15} /></Link>
          </div>
        </div>
      </section>

      <section className="d6-about-philosophy">
        <div className="d6-shell d6-about-philosophy__grid">
          <div>
            <p className="d6-eyebrow d6-eyebrow--light">Learning philosophy</p>
            <h2>See it.<br />Change it.<br />Explain it.</h2>
          </div>
          <div className="d6-about-principles">
            {[
              ['01', 'See', 'Visualize boundaries, residuals, margins, clusters, and metrics.'],
              ['02', 'Change', 'Manipulate parameters and observe the consequence of each decision.'],
              ['03', 'Explain', 'Connect model behaviour to mathematical and practical reasoning.'],
              ['04', 'Implement', 'Carry the idea into Python, evaluation, experiments, and projects.'],
            ].map(([number, title, description]) => (
              <article className="d6-about-principle" key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="d6-about-godshot__place">
        <div className="d6-shell">
          <div className="d6-about-godshot__place-head">
            <div>
              <p className="d6-eyebrow">Beyond the screen</p>
              <h2>The work has a place.</h2>
            </div>
            <p>
              A learning platform can stay digital without pretending learning happens in a
              vacuum. The campus supplies the context; the course supplies the work.
            </p>
          </div>

          <div className="d6-about-godshot__gallery">
            <figure className="d6-about-godshot__gallery-main">
              <div className="d6-about-godshot__image">
                <Image
                  src="/campus/about-life.jpg"
                  alt="Students using a Vidyashilp University outdoor sports court"
                  fill
                  sizes="(max-width: 760px) 100vw, 68vw"
                  quality={85}
                />
              </div>
              <figcaption>
                <span>01</span>
                <div>
                  <strong>Life around the work</strong>
                  <small>Learning extends into movement, community, and shared time.</small>
                </div>
              </figcaption>
            </figure>

            <figure className="d6-about-godshot__gallery-detail">
              <div className="d6-about-godshot__image">
                <Image
                  src="/campus/about-reception-final.jpg"
                  alt="Reception area at Vidyashilp University"
                  fill
                  sizes="(max-width: 760px) 100vw, 32vw"
                  quality={85}
                />
              </div>
              <figcaption>
                <span>02</span>
                <div>
                  <strong>A visible institution</strong>
                  <small>Place, identity, and a real university remain part of the interface.</small>
                </div>
              </figcaption>
            </figure>
          </div>

          <div className="d6-about-godshot__source">
            <p>Campus photography is sourced from Vidyashilp University.</p>
            <Link href={platform.universityUrl} target="_blank" rel="noreferrer">
              Visit the university <Icon name="external" size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section className="d6-about-colophon d6-about-godshot__colophon">
        <div className="d6-shell d6-about-colophon__grid">
          <div>
            <p className="d6-eyebrow">Academic context</p>
            <h2>DATA301<br />Machine Learning</h2>
            <p>
              Course instruction and academic materials by {platform.instructor.name},
              Vidyashilp University.
            </p>
            <Link href={platform.universityUrl} target="_blank" rel="noreferrer">
              Vidyashilp University <Icon name="external" size={14} />
            </Link>
          </div>
          <div>
            <p className="d6-eyebrow">Platform development</p>
            <h2>{platform.developer.name}</h2>
            <p>
              {platform.developer.role}. Product architecture, interface design,
              interactive laboratories, backend integration, and release engineering.
            </p>
            <Link href={platform.developer.repository} target="_blank" rel="noreferrer">
              Source repository <Icon name="github" size={15} />
            </Link>
          </div>
          <div className="d6-about-colophon__note">
            <p className="d6-eyebrow">Design principle</p>
            <h2>Institution. Subject. Next action.</h2>
            <p>
              Every visual decision should explain the university, illuminate machine learning,
              or help a student move forward.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

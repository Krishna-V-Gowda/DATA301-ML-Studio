import Image from 'next/image';
import Link from 'next/link';
import { course, modules } from '@/lib/course-data';
import { labs } from '@/lib/labs-data';
import { getPublishedMaterials } from '@/lib/supabase/queries';
import { Icon } from '@/components/ui/Icon';

const featuredLabIds = [
  'linear-regression',
  'gradient-descent',
  'decision-tree',
  'roc-pr',
];

function orderedMaterials<T extends { title: string; moduleSlug?: string }>(items: T[]) {
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
  const materials = orderedMaterials(await getPublishedMaterials());
  const featuredLabs = featuredLabIds
    .map((id) => labs.find((lab) => lab.id === id))
    .filter((lab): lab is (typeof labs)[number] => Boolean(lab));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${course.code}: ${course.title}`,
    description: course.description,
    provider: {
      '@type': 'CollegeOrUniversity',
      name: 'Vidyashilp University',
    },
    educationalLevel: 'Undergraduate',
    numberOfCredits: course.credits,
  };

  return (
    <main id="main-content" className="v51-home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="v51-hero">
        <div className="shell v51-hero__grid">
          <div className="v51-hero__copy">
            <p className="v51-kicker">
              <span className="v51-kicker__dot" aria-hidden="true" />
              Vidyashilp University · DATA301
            </p>

            <h1>
              Machine Learning,
              <em>made visible.</em>
            </h1>

            <p className="v51-hero__lede">
              A rigorous, interactive learning environment connecting
              mathematical intuition, model behaviour, implementation,
              evaluation, and independent judgement.
            </p>

            <div className="v51-actions" aria-label="Course actions">
              <Link className="v51-button v51-button--primary" href="/labs">
                Enter the laboratories
                <Icon name="arrow" size={17} />
              </Link>

              <Link className="v51-button v51-button--secondary" href="/course">
                Explore the course
                <Icon name="arrow" size={17} />
              </Link>
            </div>

            <div className="v51-proof" aria-label="Course at a glance">
              <div>
                <strong>12</strong>
                <span>interactive labs</span>
              </div>
              <div>
                <strong>30</strong>
                <span>lecture sessions</span>
              </div>
              <div>
                <strong>4</strong>
                <span>connected modules</span>
              </div>
            </div>
          </div>

          <div className="v51-hero__visual">
            <div className="v51-figure">
              <div className="v51-figure__head">
                <span>MODEL / RESPONSE</span>
                <span className="v51-figure__status">
                  <i aria-hidden="true" />
                  interactive
                </span>
              </div>

              <div className="v51-figure__art" aria-label="Illustration of a learned decision boundary">
                <svg viewBox="0 0 640 420" role="img" aria-labelledby="v51-plot-title">
                  <title id="v51-plot-title">Illustrative learned decision boundary</title>
                  <defs>
                    <linearGradient id="v51Field" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#f7f4eb" />
                      <stop offset="100%" stopColor="#e4edf5" />
                    </linearGradient>
                  </defs>
                  <rect x="0" y="0" width="640" height="420" rx="18" fill="url(#v51Field)" />
                  <g opacity="0.34" stroke="#b8c3cc" strokeWidth="1">
                    <path d="M64 35V385M160 35V385M256 35V385M352 35V385M448 35V385M544 35V385" />
                    <path d="M42 84H596M42 168H596M42 252H596M42 336H596" />
                  </g>
                  <path
                    d="M55 322 C145 300, 184 286, 252 255 C324 223, 361 204, 438 171 C493 148, 542 117, 586 82"
                    fill="none"
                    stroke="#173f67"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M55 332 C145 310, 184 296, 252 265 C324 233, 361 214, 438 181 C493 158, 542 127, 586 92"
                    fill="none"
                    stroke="#b51f3b"
                    strokeWidth="2"
                    strokeDasharray="8 8"
                    strokeLinecap="round"
                  />
                  {[
                    [112, 285, '#173f67'],
                    [154, 261, '#173f67'],
                    [198, 246, '#173f67'],
                    [242, 226, '#173f67'],
                    [311, 199, '#173f67'],
                    [367, 184, '#173f67'],
                    [424, 160, '#173f67'],
                    [483, 140, '#173f67'],
                    [533, 108, '#173f67'],
                    [129, 208, '#b51f3b'],
                    [188, 182, '#b51f3b'],
                    [245, 161, '#b51f3b'],
                    [303, 139, '#b51f3b'],
                    [364, 117, '#b51f3b'],
                    [428, 91, '#b51f3b'],
                    [491, 70, '#b51f3b'],
                    [548, 56, '#b51f3b'],
                  ].map(([cx, cy, fill], index) => (
                    <circle
                      key={`${cx}-${cy}-${index}`}
                      cx={cx}
                      cy={cy}
                      r="7"
                      fill={fill as string}
                      opacity="0.92"
                    />
                  ))}
                </svg>
              </div>

              <div className="v51-figure__caption">
                <div>
                  <span>FEATURE SPACE</span>
                  <strong>learning a boundary from examples</strong>
                </div>
                <div className="v51-figure__arrow" aria-hidden="true">↗</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="v51-band">
        <div className="shell v51-thesis">
          <div>
            <p className="v51-eyebrow">THE COURSE</p>
            <h2>Learn the model.<br />Understand the judgement.</h2>
          </div>
          <p>
            Machine Learning becomes much easier to reason about when
            intuition, mathematics, experimentation, implementation and
            evaluation stay connected. DATA301 is built around that chain.
          </p>
        </div>
      </section>

      <section className="v51-section shell">
        <div className="v51-section-head">
          <div>
            <p className="v51-eyebrow">THE LEARNING JOURNEY</p>
            <h2>Four modules.<br />One accumulating understanding.</h2>
          </div>
          <Link className="v51-text-link" href="/learn">
            Explore the full roadmap
            <Icon name="arrow" size={16} />
          </Link>
        </div>

        <div className="v51-modules">
          {modules.map((module, index) => (
            <Link href={`/learn/module/${module.slug}`} className="v51-module" key={module.slug}>
              <div className="v51-module__index">0{index + 1}</div>
              <div>
                <p>{module.title}</p>
                <span>{module.description}</span>
              </div>
              <Icon name="arrow" size={18} />
            </Link>
          ))}
        </div>
      </section>

      <section className="v51-module2-launchpad">
        <div className="shell v51-module2-launchpad__inner">
          <div>
            <p className="v51-eyebrow">MODULE 02 · SUPERVISED LEARNING</p>
            <h2>Where the models begin to make decisions.</h2>
            <p>
              Move from regression fundamentals into classification, ensembles,
              support-vector machines, and the evaluation ideas that connect
              model behaviour to defensible conclusions.
            </p>
          </div>

          <div className="v51-module2-launchpad__meta">
            <span>12 sessions</span>
            <span>12 practice sessions</span>
            <span>10 connected laboratories</span>
          </div>

          <Link className="v51-button v51-button--primary" href="/learn/module/supervised-learning">
            Enter Module 2
            <Icon name="arrow" size={17} />
          </Link>
        </div>
      </section>

      <section className="v51-labs">
        <div className="shell">
          <div className="v51-section-head v51-section-head--labs">
            <div>
              <p className="v51-eyebrow">MACHINE LEARNING IN MOTION</p>
              <h2>Interrogate the behaviour.</h2>
              <p>
                Twelve interactive laboratories turn abstract models into
                things students can manipulate, observe, measure and explain.
              </p>
            </div>
            <Link className="v51-text-link" href="/labs">
              All 12 laboratories
              <Icon name="arrow" size={16} />
            </Link>
          </div>

          <div className="v51-lab-grid">
            {featuredLabs.map((lab, index) => (
              <Link href={lab.href} className={`v51-lab v51-lab--${index + 1}`} key={lab.id}>
                <div className="v51-lab__top">
                  <span>{lab.index}</span>
                  <Icon name="arrow" size={17} />
                </div>
                <div className="v51-lab__preview" aria-hidden="true">
                  <div className="v51-lab__line" />
                  <div className="v51-lab__point p1" />
                  <div className="v51-lab__point p2" />
                  <div className="v51-lab__point p3" />
                  <div className="v51-lab__point p4" />
                </div>
                <div className="v51-lab__body">
                  <p>{lab.tags.slice(0, 2).join(' · ')}</p>
                  <h3>{lab.title}</h3>
                  <span>{lab.description}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="v51-section shell">
        <div className="v51-institution">
          <div className="v51-institution__image">
            <Image
              src="/campus/vu-campus-hero.webp"
              alt="Vidyashilp University campus"
              fill
              sizes="(max-width: 900px) 100vw, 52vw"
            />
          </div>
          <div className="v51-institution__copy">
            <p className="v51-eyebrow">VIDYASHILP UNIVERSITY</p>
            <h2>An academic home for serious learning.</h2>
            <p>
              DATA301 sits within Vidyashilp University's applied learning
              environment, connecting conceptual depth with practical
              experimentation and independent judgement.
            </p>
            <Link className="v51-button v51-button--secondary" href="/about">
              About the course
              <Icon name="arrow" size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="v51-section shell">
        <div className="v51-materials">
          <div className="v51-section-head">
            <div>
              <p className="v51-eyebrow">CURRENT MATERIALS</p>
              <h2>Everything you need to continue.</h2>
            </div>
            <Link className="v51-text-link" href="/resources">
              Open resources
              <Icon name="arrow" size={16} />
            </Link>
          </div>

          {materials.length ? (
            <div className="v51-material-list">
              {materials.slice(0, 3).map((material, index) => (
                <Link href="/resources" className="v51-material" key={material.id}>
                  <span>0{index + 1}</span>
                  <strong>{material.title}</strong>
                  <small>{material.moduleSlug ?? 'Course resource'}</small>
                  <Icon name="arrow" size={16} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="v51-empty">
              Course materials are synchronizing. Lessons and laboratories remain available.
            </div>
          )}
        </div>
      </section>

      <section className="v51-final">
        <div className="shell v51-final__inner">
          <div>
            <p className="v51-eyebrow">READY TO BEGIN?</p>
            <h2>Start with the course.<br />Stay for the experiments.</h2>
          </div>
          <Link className="v51-button v51-button--light" href="/labs">
            Enter the laboratories
            <Icon name="arrow" size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}

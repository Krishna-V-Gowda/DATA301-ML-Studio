import type { Metadata } from 'next';
import Link from 'next/link';
import { LearningRoadmap } from '@/components/LearningRoadmap';
import { SectionHeading } from '@/components/SectionHeading';
import { Icon } from '@/components/ui/Icon';
import { modules } from '@/lib/course-data';
import { topics } from '@/lib/topic-data';

export const metadata: Metadata = {
  title: 'Learning Roadmap',
  description: 'Follow the DATA301 Machine Learning learning path across four connected modules.',
};

export default function LearnPage() {
  return (
    <main id="main-content">
      <section className="page-hero page-hero--roadmap">
        <div className="shell page-hero__grid">
          <div>
            <span className="eyebrow">Learning roadmap</span>
            <h1>Build the mental model in the right order.</h1>
            <p>
              Start with the data and vocabulary, learn supervised and unsupervised techniques, then bring everything together through evaluation, regularization, and perceptron-based models.
            </p>
          </div>
          <div className="page-hero__stats">
            <div><strong>4</strong><span>modules</span></div>
            <div><strong>30</strong><span>lecture sessions</span></div>
            <div><strong>{topics.length}</strong><span>published concepts</span></div>
          </div>
        </div>
      </section>

      <section className="section shell roadmap-page">
        <LearningRoadmap />
      </section>

      <section className="section section--paper">
        <div className="shell">
          <SectionHeading
            eyebrow="Published concept library"
            title="Enter through a module—or jump directly to a concept."
            description="Topic pages follow a consistent rhythm: intuition, purpose, visualization, mathematics, algorithm, implementation, limitations, and practice."
          />
          <div className="topic-directory">
            {modules.map((module) => {
              const moduleTopics = topics.filter((topic) => topic.moduleSlug === module.slug);
              return (
                <section className="topic-group" key={module.slug}>
                  <div className={`topic-group__number topic-group__number--${module.accent}`}>0{module.number}</div>
                  <div className="topic-group__content">
                    <div className="topic-group__heading">
                      <div><span>Module {module.number}</span><h2>{module.shortTitle}</h2></div>
                      <Link href={`/learn/module/${module.slug}`}>Module overview <Icon name="arrow" size={17} /></Link>
                    </div>
                    {moduleTopics.length ? (
                      <div className="topic-list">
                        {moduleTopics.map((topic) => (
                          <Link href={`/topics/${topic.slug}`} key={topic.slug}>
                            <div>
                              <span>{topic.difficulty} · {topic.estimatedMinutes} min</span>
                              <h3>{topic.title}</h3>
                              <p>{topic.oneLine}</p>
                            </div>
                            <Icon name="chevron" />
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state-inline">Rich topic lessons will be published as the class progresses.</div>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

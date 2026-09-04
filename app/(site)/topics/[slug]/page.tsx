import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { Math } from '@/components/ui/Math';
import { findModule } from '@/lib/course-data';
import { findTopic, topics } from '@/lib/topic-data';

export function generateStaticParams() {
  return topics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const topic = findTopic(slug);
  if (!topic) return {};
  return { title: topic.title, description: topic.summary };
}

function topicBySlug(slug: string) {
  return topics.find((topic) => topic.slug === slug);
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = findTopic(slug);
  if (!topic) notFound();
  const module = findModule(topic.moduleSlug);

  return (
    <main id="main-content" className="topic-page">
      <section className="topic-hero">
        <div className="shell topic-hero__grid">
          <div>
            <Link className="back-link" href={`/learn/module/${topic.moduleSlug}`}>← {module?.shortTitle ?? 'Module'}</Link>
            <span className="eyebrow">{topic.eyebrow}</span>
            <h1>{topic.title}</h1>
            <p className="topic-one-line">{topic.oneLine}</p>
            <p>{topic.summary}</p>
            <div className="topic-meta"><span>{topic.difficulty}</span><span>{topic.estimatedMinutes} minutes</span><span>{topic.sections.length} sections</span></div>
            {topic.labHref ? <Link className="button button--primary" href={topic.labHref}>Open interactive lab <Icon name="lab" /></Link> : null}
          </div>
          <div className="topic-map-card">
            <span>Concept position</span>
            <div className="topic-map-card__path">
              <i className="is-complete" /><b>Foundations</b><em>→</em><i className="is-current" /><b>{module?.shortTitle}</b><em>→</em><i /><b>Application</b>
            </div>
            <div className="topic-tags">{topic.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </div>
        </div>
      </section>

      <div className="shell topic-layout">
        <aside className="topic-toc">
          <div className="sidebar-card sidebar-card--sticky">
            <span className="eyebrow">On this page</span>
            <nav>{topic.sections.map((section) => <a href={`#${section.id}`} key={section.id}>{section.title}</a>)}</nav>
            {topic.labHref ? <Link className="toc-lab-link" href={topic.labHref}><Icon name="lab" size={18} /> Try the lab</Link> : null}
          </div>
        </aside>

        <article className="topic-article">
          {topic.sections.map((section, index) => (
            <section id={section.id} className="topic-section" key={section.id}>
              <div className="topic-section__number">{String(index + 1).padStart(2, '0')}</div>
              <div>
                <h2>{section.title}</h2>
                {section.body.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
                {section.formula ? <Math expression={section.formula} label={`Formula for ${section.title}`} /> : null}
                {section.code ? <div className="code-block"><div className="code-block__top"><span>Python</span><span>scikit-learn</span></div><pre><code>{section.code}</code></pre></div> : null}
                {section.callout ? <div className="concept-callout"><Icon name="spark" /><p>{section.callout}</p></div> : null}
              </div>
            </section>
          ))}

          <section className="source-note"><span>Content provenance</span><p>{topic.sourceNote}</p></section>

          <section className="concept-navigation">
            <div>
              <span className="eyebrow">Before learning this</span>
              {topic.prerequisites.length ? topic.prerequisites.map((item) => { const linked = topicBySlug(item); return linked ? <Link key={item} href={`/topics/${item}`}>{linked.title}</Link> : <span key={item}>{item}</span>; }) : <p>No formal prerequisite.</p>}
            </div>
            <div>
              <span className="eyebrow">Related concepts</span>
              {topic.related.map((item) => { const linked = topicBySlug(item); return linked ? <Link key={item} href={`/topics/${item}`}>{linked.title}</Link> : <span key={item}>{item.replaceAll('-', ' ')}</span>; })}
            </div>
            <div>
              <span className="eyebrow">Learn next</span>
              {topic.learnNext.map((item) => { const linked = topicBySlug(item); return linked ? <Link key={item} href={`/topics/${item}`}>{linked.title} <Icon name="arrow" size={16} /></Link> : <span key={item}>{item.replaceAll('-', ' ')}</span>; })}
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}

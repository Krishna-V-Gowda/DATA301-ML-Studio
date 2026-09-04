import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MaterialCard } from '@/components/MaterialCard';
import { Icon } from '@/components/ui/Icon';
import { findModule, modules } from '@/lib/course-data';
import { topicsByModule } from '@/lib/topic-data';
import { getCourseSessionStatuses, getPublishedMaterials } from '@/lib/supabase/queries';

export function generateStaticParams() {
  return modules.map((module) => ({ slug: module.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const module = findModule(slug);
  if (!module) return {};
  return { title: module.shortTitle, description: module.description };
}

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const module = findModule(slug);
  if (!module) notFound();

  const publishedTopics = topicsByModule(module.slug);
  const [allMaterials, sessionStatuses] = await Promise.all([
    getPublishedMaterials(),
    getCourseSessionStatuses(),
  ]);
  const moduleMaterials = allMaterials.filter((material) => material.moduleSlug === module.slug);
  const nextModule = modules.find((item) => item.number === module.number + 1);
  const previousModule = modules.find((item) => item.number === module.number - 1);

  return (
    <main id="main-content">
      <section className={`module-hero module-hero--${module.accent}`}>
        <div className="shell module-hero__grid">
          <div>
            <Link className="back-link" href="/learn">← Learning roadmap</Link>
            <span className="eyebrow">Module {module.number} · {module.level}</span>
            <h1>{module.title}</h1>
            <p>{module.description}</p>
            <div className="module-hero__meta">
              <span>{module.lectureSessions} lectures · {module.practiceSessions} practice sessions</span>
              <span>{module.lectureHours + module.practiceHours} contact hours</span>
              <span>{module.outcomes.join(', ')}</span>
            </div>
          </div>
          <div className="module-orbit-card">
            <span className="module-orbit-card__number">0{module.number}</span>
            <div className="module-orbit-card__rings" aria-hidden="true"><i /><i /><i /></div>
            <p>{module.takeaway}</p>
          </div>
        </div>
      </section>

      <section className="section shell module-layout">
        <aside className="module-sidebar">
          <div className="sidebar-card">
            <span className="eyebrow">Module map</span>
            <ol>
              {module.lectures.map((lecture) => <li key={lecture.number}><a href={`#session-${lecture.number}`}>L{lecture.number}: {lecture.title}</a></li>)}
            </ol>
          </div>
          <div className="sidebar-card">
            <span className="eyebrow">Core topics</span>
            <ul>{module.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
          </div>
        </aside>

        <div className="module-main">
          <section>
            <div className="content-heading"><span className="eyebrow">Concept lessons</span><h2>Learn from intuition to implementation.</h2></div>
            {publishedTopics.length ? (
              <div className="lesson-grid">
                {publishedTopics.map((topic, index) => (
                  <Link className="lesson-card" href={`/topics/${topic.slug}`} key={topic.slug}>
                    <span className="lesson-card__index">{String(index + 1).padStart(2, '0')}</span>
                    <div><span>{topic.difficulty} · {topic.estimatedMinutes} min</span><h3>{topic.title}</h3><p>{topic.oneLine}</p></div>
                    <Icon name="arrow" />
                  </Link>
                ))}
              </div>
            ) : <div className="empty-state">Concept lessons for this module are prepared for staged publication through the admin dashboard.</div>}
          </section>

          <section className="session-section">
            <div className="content-heading"><span className="eyebrow">Reference session sequence</span><h2>Lectures and paired practice.</h2></div>
            <div className="session-list">
              {module.lectures.map((lecture) => (
                <article id={`session-${lecture.number}`} key={lecture.number}>
                  <div className="session-number">L{String(lecture.number).padStart(2, '0')}</div>
                  <div className="session-content"><h3>{lecture.title}</h3>{lecture.practice ? <div className="practice-chip"><Icon name="code" size={17} /><span><strong>{lecture.practice.code}</strong>{lecture.practice.title}</span></div> : null}</div>
                  <span className={`session-status session-status--${sessionStatuses[lecture.number] ?? 'planned'}`}>{sessionStatuses[lecture.number] === 'completed' ? 'Completed' : sessionStatuses[lecture.number] === 'published' ? 'Materials available' : 'Upcoming'}</span>
                </article>
              ))}
            </div>
          </section>

          {moduleMaterials.length ? (
            <section>
              <div className="content-heading"><span className="eyebrow">Materials</span><h2>Published for this module.</h2></div>
              <div className="material-grid material-grid--two">{moduleMaterials.map((material) => <MaterialCard key={material.id} material={material} />)}</div>
            </section>
          ) : null}
        </div>
      </section>

      <nav className="module-pagination shell" aria-label="Module pagination">
        {previousModule ? <Link href={`/learn/module/${previousModule.slug}`}><span>Previous module</span><strong>← {previousModule.shortTitle}</strong></Link> : <span />}
        {nextModule ? <Link className="module-pagination__next" href={`/learn/module/${nextModule.slug}`}><span>Next module</span><strong>{nextModule.shortTitle} →</strong></Link> : <Link className="module-pagination__next" href="/projects"><span>Apply the course</span><strong>Projects →</strong></Link>}
      </nav>
    </main>
  );
}

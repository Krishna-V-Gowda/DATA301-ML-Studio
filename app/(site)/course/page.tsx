import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CourseOverviewPanel } from '@/components/CourseOverviewPanel';
import { ModuleCard } from '@/components/ModuleCard';
import { Icon } from '@/components/ui/Icon';
import { course, modules, outcomes } from '@/lib/course-data';
import { platform } from '@/lib/platform';

export const metadata: Metadata = {
  title: 'Course Overview',
  description: 'The official DATA301 course structure, outcomes, learning architecture, and instructor context.',
};

export default function CoursePage() {
  return (
    <main id="main-content">
      <section className="course-hero-cosmic">
        <Image src="/campus/vu-campus-atmosphere.webp" alt="" fill priority sizes="100vw" />
        <div className="course-hero-cosmic__veil" />
        <div className="shell course-hero-cosmic__layout">
          <div>
            <span className="eyebrow eyebrow--light">{course.code} · Course overview</span>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
            <div className="course-hero-cosmic__actions">
              <Link className="button button--light" href="/learn">Learning roadmap <Icon name="arrow" /></Link>
              <Link className="button button--glass" href="/resources">Course materials <Icon name="book" /></Link>
            </div>
          </div>
          <aside className="course-hero-cosmic__identity">
            <Image src="/brand/vidyashilp-university.png" alt="Vidyashilp University" width={220} height={80} />
            <span>School of Engineering & Technology</span>
            <strong>Semester {course.semester} · {course.credits} credits</strong>
            <small>{course.durationWeeks} weeks · {course.lectureHours} lecture hours · {course.practiceHours} practice hours</small>
          </aside>
        </div>
      </section>

      <section className="section shell"><CourseOverviewPanel /></section>

      <section className="section section--paper">
        <div className="shell course-intent-grid">
          <div>
            <span className="eyebrow">The course intent</span>
            <h2>From algorithm vocabulary to defensible model decisions.</h2>
            <p>
              DATA301 develops a practical and conceptual foundation in regression, classification,
              clustering, dimensionality reduction, evaluation, regularization, and perceptron-based models.
              Python practice accompanies the lecture sequence throughout the semester.
            </p>
            <div className="course-prerequisite"><span>Prerequisite</span><strong>{course.prerequisite}</strong></div>
          </div>
          <div className="outcome-matrix">
            {outcomes.map((outcome) => (
              <article key={outcome.code}><span>{outcome.code}</span><p>{outcome.description}</p><strong>{outcome.level}</strong></article>
            ))}
          </div>
        </div>
      </section>

      <section className="section shell">
        <div className="content-heading content-heading--wide"><span className="eyebrow">Course structure</span><h2>Four modules. One cumulative learning journey.</h2><p>Each stage contributes concepts and practices required by the next.</p></div>
        <div className="module-grid module-grid--cosmic">{modules.map((module) => <ModuleCard key={module.slug} module={module} />)}</div>
      </section>

      <section className="section section--ink">
        <div className="shell instructor-course-panel">
          <div className="instructor-course-panel__portrait" aria-hidden="true"><span>SB</span><i /><i /></div>
          <div>
            <span className="eyebrow eyebrow--light">Course instructor</span>
            <h2>{platform.instructor.name}</h2>
            <p>Associate Professor, School of Engineering & Technology, Vidyashilp University, Bengaluru.</p>
            <div className="instructor-course-panel__themes"><span>Deep model compression</span><span>Active learning</span><span>Domain adaptation</span><span>Continual learning</span></div>
          </div>
          <div className="instructor-course-panel__links">
            <Link href={platform.instructor.portfolio} target="_blank" rel="noreferrer">Instructor profile <Icon name="external" size={16} /></Link>
            <Link href={platform.instructor.github} target="_blank" rel="noreferrer">Course ML Lab repository <Icon name="github" size={17} /></Link>
          </div>
        </div>
      </section>

      <section className="section shell">
        <div className="private-plan-note">
          <Icon name="lock" size={28} />
          <div><span className="eyebrow">Instructor-managed document</span><h2>The detailed course plan remains private.</h2><p>Students receive the public course overview and released learning materials. The detailed planning document stays inside the authenticated instructor portal.</p></div>
          <Link className="button button--quiet" href="/admin/login">Instructor portal <Icon name="arrow" /></Link>
        </div>
      </section>
    </main>
  );
}

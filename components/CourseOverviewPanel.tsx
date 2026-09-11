import Link from 'next/link';
import { course, outcomes } from '@/lib/course-data';
import { Icon } from '@/components/ui/Icon';

export function CourseOverviewPanel() {
  return (
    <section className="cosmic-overview" aria-labelledby="course-overview-title">
      <div className="cosmic-overview__intro">
        <span className="eyebrow">Course overview</span>
        <h2 id="course-overview-title">Know the course before you enter the models.</h2>
        <p>
          DATA301 is a four-credit, practice-led Machine Learning course for Semester V. It connects
          mathematical intuition, Python implementation, model evaluation, and project work across a
          fifteen-week sequence.
        </p>
        <div className="cosmic-overview__actions">
          <Link className="button button--primary" href="/course">Explore course overview <Icon name="arrow" /></Link>
          <Link className="text-link" href="/learn">Open the learning roadmap <Icon name="arrow" size={17} /></Link>
        </div>
      </div>

      <div className="cosmic-overview__facts" aria-label="DATA301 facts">
        <article><span>Course</span><strong>{course.code}</strong><small>{course.title}</small></article>
        <article><span>Duration</span><strong>{course.durationWeeks}</strong><small>weeks</small></article>
        <article><span>Contact</span><strong>{course.lectureHours + course.practiceHours}</strong><small>hours</small></article>
        <article><span>Structure</span><strong>{course.ltp}</strong><small>lecture : tutorial : practice</small></article>
      </div>

      <div className="cosmic-overview__outcomes">
        <span className="eyebrow">Outcomes</span>
        <div>
          {outcomes.map((outcome) => (
            <article key={outcome.code}>
              <span>{outcome.code}</span>
              <p>{outcome.description}</p>
              <small>{outcome.level}</small>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import type { CourseModule } from '@/lib/types';

export function ModuleCard({ module }: { module: CourseModule }) {
  return (
    <article className={`module-card module-card--${module.accent}`}>
      <div className="module-card__topline">
        <span className="module-index">0{module.number}</span>
        <span className="difficulty-pill">{module.level}</span>
      </div>
      <h3>{module.shortTitle}</h3>
      <p>{module.description}</p>
      <div className="module-card__meta">
        <span>{module.lectureSessions} lecture sessions</span>
        <span>{module.practiceSessions} practice sessions</span>
        <span>{module.lectureHours + module.practiceHours} contact hours</span>
      </div>
      <div className="module-card__topics" aria-label="Sample topics">
        {module.topics.slice(0, 3).map((topic) => <span key={topic}>{topic}</span>)}
      </div>
      <Link className="text-link" href={`/learn/module/${module.slug}`}>
        Explore module <Icon name="arrow" size={18} />
      </Link>
    </article>
  );
}

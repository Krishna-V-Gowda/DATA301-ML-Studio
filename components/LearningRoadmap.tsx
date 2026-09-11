import Link from 'next/link';
import { modules } from '@/lib/course-data';
import { Icon } from '@/components/ui/Icon';

export function LearningRoadmap({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? 'roadmap roadmap--compact' : 'roadmap'}>
      <div className="roadmap__rail" aria-hidden="true" />
      {modules.map((module, index) => (
        <div className="roadmap__stage" key={module.slug}>
          <div className={`roadmap__node roadmap__node--${module.accent}`}>
            <span>{module.number}</span>
          </div>
          <div className="roadmap__content">
            <div className="roadmap__eyebrow">Module {module.number} · {module.level}</div>
            <h3>{module.shortTitle}</h3>
            {!compact ? <p>{module.takeaway}</p> : null}
            <Link href={`/learn/module/${module.slug}`}>Open module <Icon name="chevron" size={16} /></Link>
          </div>
          {index < modules.length - 1 ? <span className="roadmap__connector" aria-hidden="true" /> : null}
        </div>
      ))}
    </div>
  );
}

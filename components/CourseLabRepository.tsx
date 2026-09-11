import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { platform } from '@/lib/platform';

export function CourseLabRepository({ compact = false }: { compact?: boolean }) {
  return (
    <aside className={compact ? 'course-repo-bridge course-repo-bridge--compact' : 'course-repo-bridge'}>
      <div className="course-repo-bridge__mark" aria-hidden="true"><Icon name="github" size={28} /></div>
      <div>
        <span className="eyebrow">Continue into implementation</span>
        <h2>{compact ? 'Open the course lab repository.' : 'From interactive intuition to Python and Jupyter practice.'}</h2>
        <p>
          Use the visual laboratories here to understand the behaviour, then continue with the instructor&apos;s
          official ML Lab repository for the course environment and practical notebooks.
        </p>
      </div>
      <Link className="button button--ink" href={platform.instructor.github} target="_blank" rel="noreferrer">
        Course ML Lab on GitHub <Icon name="external" size={17} />
      </Link>
    </aside>
  );
}

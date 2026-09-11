import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { platform } from '@/lib/platform';

export function LabRepositoryBridge() {
  return (
    <section className="lab-repository-strip shell" aria-label="Course implementation repository">
      <div><Icon name="github" size={25} /><span>Course implementation</span></div>
      <p>Continue from the interactive model to the instructor&apos;s Python/Jupyter ML Lab environment.</p>
      <Link href={platform.instructor.github} target="_blank" rel="noreferrer">Open ML Lab <Icon name="external" size={16} /></Link>
    </section>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import type { Material } from '@/lib/types';

const kindLabels: Record<Material['kind'], string> = {
  'course-outline': 'Course overview',
  'course-plan': 'Course plan',
  slides: 'Slides',
  notes: 'Notes',
  lab: 'Lab',
  dataset: 'Dataset',
  assignment: 'Assignment',
  reference: 'Reference',
};

export function MaterialCard({ material }: { material: Material }) {
  return (
    <article className="material-card">
      {material.thumbnail ? (
        <div className="material-card__thumb">
          <Image src={material.thumbnail} alt="" fill sizes="(max-width: 700px) 100vw, 360px" />
        </div>
      ) : (
        <div className="material-card__placeholder" aria-hidden="true"><Icon name="file" size={34} /></div>
      )}
      <div className="material-card__body">
        <div className="material-card__eyebrow">
          <span>{kindLabels[material.kind]}</span>
          <span>v{material.version}</span>
        </div>
        <h3>{material.title}</h3>
        <p>{material.description}</p>
        <div className="material-card__footer">
          <span>{material.format} · {material.sizeLabel}</span>
          <Link href={material.href} target="_blank" rel="noreferrer">
            Open <Icon name="download" size={17} />
          </Link>
        </div>
      </div>
    </article>
  );
}

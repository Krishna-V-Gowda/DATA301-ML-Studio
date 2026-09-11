import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { module2Chapters } from '@/lib/platform';

export function Module2Launchpad({ compact = false }: { compact?: boolean }) {
  return (
    <section className={compact ? 'module2-launchpad module2-launchpad--compact' : 'module2-launchpad'}>
      <div className="module2-launchpad__visual">
        <Image
          src="/thumbnails/module2-cover.webp"
          alt="Cover of the Module 2 supervised learning presentation"
          width={900}
          height={675}
          sizes="(max-width: 900px) 92vw, 480px"
        />
        <div className="module2-launchpad__badge"><span>Module 02</span><strong>110 slides</strong></div>
      </div>
      <div className="module2-launchpad__content">
        <span className="eyebrow">Now in the course</span>
        <h2>Supervised learning, connected from slides to experimentation.</h2>
        <p>
          Follow the official Module 2 presentation through regression, classification, model evaluation,
          and generalization—then test each idea in the corresponding interactive laboratory.
        </p>
        <div className="module2-pathways">
          {module2Chapters.map((chapter) => (
            <article className={`module2-pathway module2-pathway--${chapter.accent}`} key={chapter.index}>
              <span>{chapter.index}</span>
              <div>
                <small>{chapter.slideRange}</small>
                <h3>{chapter.title}</h3>
                {!compact ? <p>{chapter.description}</p> : null}
                <div>
                  <Link href={chapter.topicHref}>Learn <Icon name="arrow" size={15} /></Link>
                  <Link href={chapter.labHref}>Experiment <Icon name="play" size={14} /></Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="module2-launchpad__actions">
          <Link className="button button--primary" href="/learn/module/supervised-learning">Enter Module 2 <Icon name="arrow" /></Link>
          <Link className="button button--quiet" href="/resources">Open course materials <Icon name="book" /></Link>
        </div>
      </div>
    </section>
  );
}

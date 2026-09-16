import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { platform } from '@/lib/platform';

export function SiteFooter({ compact = false }: { compact?: boolean }) {
  return (
    <footer className={compact ? 'v51-footer v51-footer--compact' : 'v51-footer v51-footer--home'}>
      {!compact ? (
        <div className="shell v51-footer__top">
        <div>
          <p className="v51-eyebrow">DATA301 · MACHINE LEARNING</p>
          <h2>From intuition<br />to implementation.</h2>
        </div>
        <Link className="v51-button v51-button--light" href="/labs">
          Enter the laboratories
          <Icon name="arrow" size={17} />
        </Link>
        </div>
      ) : null}

      <div className="shell v51-footer__grid">
        <div className="v51-footer__brand">
          <Image
            src="/brand/vidyashilp-university.png"
            alt="Vidyashilp University"
            width={165}
            height={61}
          />
          <p>Interactive learning environment for the School of Engineering & Technology.</p>
          <Link href={platform.universityUrl} target="_blank" rel="noreferrer">
            Vidyashilp University <Icon name="external" size={13} />
          </Link>
        </div>

        <nav aria-label="Course links">
          <h3>Course</h3>
          <Link href="/course">Overview</Link>
          <Link href="/learn">Learn</Link>
          <Link href="/labs">Laboratories</Link>
          <Link href="/projects">Projects</Link>
        </nav>

        <nav aria-label="Resources links">
          <h3>Resources</h3>
          <Link href="/resources">Course materials</Link>
          <Link href="/search">Search</Link>
          <Link href="/instructor">Instructor</Link>
          <Link href="/admin/login">Instructor portal</Link>
        </nav>

        <nav aria-label="External links">
          <h3>Platform</h3>
          <Link href={platform.instructor.github} target="_blank" rel="noreferrer">
            Instructor ML Lab <Icon name="external" size={13} />
          </Link>
          <Link href={platform.developer.repository} target="_blank" rel="noreferrer">
            Source repository <Icon name="external" size={13} />
          </Link>
          <Link href="/about">About & credits</Link>
        </nav>
      </div>

      <div className="shell v51-footer__bottom">
        <span>DATA301 · Vidyashilp University · 2026</span>
        <Link href={platform.developer.github} target="_blank" rel="noreferrer">
          Platform design &amp; development · {platform.developer.name}
        </Link>
      </div>
    </footer>
  );
}

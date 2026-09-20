import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { platform } from '@/lib/platform';

export function SiteFooter({ compact = false }: { compact?: boolean }) {
  return (
    <footer className={compact ? 'd6-footer d6-footer--compact' : 'd6-footer'}>
      {!compact ? <div className="d6-footer__signal"><div className="d6-shell d6-footer__signal-grid">
        <div><p className="d6-eyebrow d6-eyebrow--light">DATA301 · MACHINE LEARNING</p><h2>Machine learning,<br />made visible.</h2></div>
        <Link className="d6-button" href="/labs">Enter the laboratories <Icon name="arrow" size={16} /></Link>
      </div></div> : null}
      <div className="d6-shell d6-footer__main">
        <div className="d6-footer__grid">
          <div className="d6-footer__brand">
            <Image src="/brand/vidyashilp-university.png" alt="Vidyashilp University" width={180} height={66} />
            <p>DATA301 is an interactive course environment for the School of Engineering &amp; Technology.</p>
            <Link href={platform.universityUrl} target="_blank" rel="noreferrer">Vidyashilp University <Icon name="external" size={12} /></Link>
          </div>
          <nav aria-label="Course links"><h3>Course</h3><Link href="/course">Overview</Link><Link href="/learn">Learning atlas</Link><Link href="/labs">Laboratories</Link><Link href="/projects">Projects</Link></nav>
          <nav aria-label="Resources links"><h3>Resources</h3><Link href="/resources">Course materials</Link><Link href="/search">Search</Link><Link href="/instructor">Instructor</Link><Link href="/admin/login">Instructor portal</Link></nav>
          <nav aria-label="Platform links"><h3>Platform</h3><Link href={platform.instructor.github} target="_blank" rel="noreferrer">Instructor ML Lab <Icon name="external" size={12} /></Link><Link href={platform.developer.repository} target="_blank" rel="noreferrer">Source repository <Icon name="external" size={12} /></Link><Link href="/about">About &amp; credits</Link></nav>
        </div>
        <div className="d6-footer__bottom"><span>DATA301 · Vidyashilp University · 2026</span><Link href={platform.developer.github} target="_blank" rel="noreferrer">Platform design &amp; development · {platform.developer.name}</Link></div>
      </div>
    </footer>
  );
}

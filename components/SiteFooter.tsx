import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { platform } from '@/lib/platform';

export function SiteFooter() {
  return (
    <footer className="site-footer site-footer--cosmic">
      <div className="shell site-footer__lead">
        <div><span className="eyebrow eyebrow--light">DATA301 · Machine Learning</span><h2>From intuition to implementation.</h2></div>
        <Link className="button button--light" href="/labs">Enter the laboratories <Icon name="arrow" /></Link>
      </div>
      <div className="shell site-footer__grid">
        <div className="site-footer__brand">
          <Image src="/brand/vidyashilp-university.png" alt="Vidyashilp University" width={180} height={66} />
          <p>Interactive course environment for the School of Engineering & Technology.</p>
          <Link href={platform.universityUrl} target="_blank" rel="noreferrer">Vidyashilp University <Icon name="external" size={14} /></Link>
        </div>
        <nav><h3>Course</h3><Link href="/course">Course overview</Link><Link href="/learn">Learning roadmap</Link><Link href="/resources">Course materials</Link><Link href="/projects">Projects</Link></nav>
        <nav><h3>Practice</h3><Link href="/labs">Interactive labs</Link><Link href={platform.instructor.github} target="_blank" rel="noreferrer">Instructor ML Lab ↗</Link><Link href="/admin/login">Instructor portal</Link></nav>
        <nav><h3>Platform</h3><Link href="/about">About & credits</Link><Link href={platform.developer.repository} target="_blank" rel="noreferrer">Source repository ↗</Link><Link href="/search">Search</Link></nav>
      </div>
      <div className="shell site-footer__bottom">
        <span>DATA301 · Vidyashilp University · 2026</span>
        <Link className="developer-credit" href={platform.developer.github} target="_blank" rel="noreferrer">Platform design &amp; development · {platform.developer.name}</Link>
      </div>
    </footer>
  );
}

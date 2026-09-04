import Image from 'next/image';
import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__grid">
        <div>
          <Image src="/brand/data301-studio.svg" alt="DATA301 Machine Learning Studio" width={220} height={63} />
          <p className="footer-statement">Machine learning, taught from intuition to implementation.</p>
        </div>
        <div>
          <h2>Explore</h2>
          <Link href="/learn">Learning roadmap</Link>
          <Link href="/labs">Interactive labs</Link>
          <Link href="/resources">Course materials</Link>
        </div>
        <div>
          <h2>Course</h2>
          <Link href="/about">DATA301 overview</Link>
          <Link href="/projects">Project guidance</Link>
          <Link href="/admin/login">Instructor login</Link>
        </div>
        <div className="footer-meta">
          <span>Independent scientific learning studio</span>
          <span>Semester V · 4 credits</span>
          <span>© 2026 Krishna V. Gowda · MIT source</span>
        </div>
      </div>
    </footer>
  );
}

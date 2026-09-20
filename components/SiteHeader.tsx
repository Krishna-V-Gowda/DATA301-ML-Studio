'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';

const nav = [
  { href: '/course', label: 'Course' },
  { href: '/learn', label: 'Learn' },
  { href: '/labs', label: 'Labs' },
  { href: '/projects', label: 'Projects' },
  { href: '/resources', label: 'Resources' },
  { href: '/instructor', label: 'Instructor' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="d6-header">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="d6-shell d6-header__inner">
        <Link className="d6-brand" href="/" aria-label="DATA301 Machine Learning home">
          <Image src="/brand/vidyashilp-university.png" alt="Vidyashilp University" width={140} height={51} priority />
          <span className="d6-brand__rule" aria-hidden="true" />
          <span className="d6-brand__course">
            <strong>DATA301</strong>
            <small>Machine Learning Studio</small>
          </span>
        </Link>
        <nav className="d6-nav" aria-label="Primary navigation">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return <Link className={active ? 'is-active' : ''} href={item.href} key={item.href}>{item.label}</Link>;
          })}
        </nav>
        <div className="d6-header__actions">
          <Link className="d6-search" href="/search" aria-label="Search course content"><Icon name="search" size={18} /></Link>
          <button className="d6-menu" type="button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            <Icon name={open ? 'x' : 'menu'} size={19} />
          </button>
        </div>
      </div>
      {open ? <nav className="d6-mobile-nav" aria-label="Mobile navigation"><div className="d6-shell">
        {nav.map((item) => <Link href={item.href} key={item.href}><span>{item.label}</span><Icon name="arrow" size={16} /></Link>)}
        <Link href="/admin/login"><span>Instructor portal</span><Icon name="lock" size={15} /></Link>
      </div></nav> : null}
    </header>
  );
}

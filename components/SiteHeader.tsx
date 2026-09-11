'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Icon } from '@/components/ui/Icon';

const nav = [
  { href: '/course', label: 'Course overview' },
  { href: '/learn', label: 'Learn' },
  { href: '/labs', label: 'Labs' },
  { href: '/projects', label: 'Projects' },
  { href: '/resources', label: 'Resources' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 14);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <header className={scrolled ? 'site-header site-header--scrolled' : 'site-header'}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="site-header__inner shell">
        <Link className="brand brand--cosmic" href="/" aria-label="DATA301 Machine Learning home">
          <Image src="/brand/vidyashilp-university.png" alt="Vidyashilp University" width={146} height={53} priority />
          <span className="brand__divider" aria-hidden="true" />
          <span className="brand__course"><strong>DATA301</strong><span>Machine Learning Studio</span></span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return <Link className={active ? 'nav-link is-active' : 'nav-link'} href={item.href} key={item.href}>{item.label}</Link>;
          })}
        </nav>

        <div className="header-actions">
          <Link className="icon-button" href="/search" aria-label="Search course content" title="Search"><Icon name="search" /></Link>
          <ThemeToggle />
          <button className="icon-button mobile-menu-button" type="button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen((value) => !value)}><Icon name={open ? 'x' : 'menu'} /></button>
        </div>
      </div>

      {open ? (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <div className="shell mobile-nav__inner">
            {nav.map((item) => <Link href={item.href} key={item.href}>{item.label}<Icon name="chevron" size={18} /></Link>)}
            <Link href="/about">About & credits<Icon name="chevron" size={18} /></Link>
            <Link href="/admin/login">Instructor login<Icon name="lock" size={18} /></Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

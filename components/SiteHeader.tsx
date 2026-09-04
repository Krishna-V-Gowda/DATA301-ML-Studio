'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Icon } from '@/components/ui/Icon';

const nav = [
  { href: '/learn', label: 'Learn' },
  { href: '/labs', label: 'Labs' },
  { href: '/projects', label: 'Projects' },
  { href: '/resources', label: 'Resources' },
  { href: '/about', label: 'Course' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="site-header__inner shell">
        <Link className="brand" href="/" aria-label="DATA301 Machine Learning home">
          <Image
            src="/brand/data301-studio.svg"
            alt="DATA301 Machine Learning Studio"
            width={210}
            height={60}
            priority
          />
          <span className="brand__divider" aria-hidden="true" />
          <span className="brand__course">
            <strong>DATA301</strong>
            <span>Machine Learning</span>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link className={active ? 'nav-link is-active' : 'nav-link'} href={item.href} key={item.href}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="header-actions">
          <Link className="icon-button" href="/search" aria-label="Search course content" title="Search">
            <Icon name="search" />
          </Link>
          <ThemeToggle />
          <button
            className="icon-button mobile-menu-button"
            type="button"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <Icon name={open ? 'x' : 'menu'} />
          </button>
        </div>
      </div>

      {open ? (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <div className="shell mobile-nav__inner">
            {nav.map((item) => (
              <Link href={item.href} key={item.href}>{item.label}<Icon name="chevron" size={18} /></Link>
            ))}
            <Link href="/admin/login">Instructor login<Icon name="lock" size={18} /></Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

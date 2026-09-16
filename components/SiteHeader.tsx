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

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="v51-header">
      <a className="skip-link" href="#main-content">Skip to content</a>

      <div className="shell v51-header__inner">
        <Link className="v51-brand" href="/" aria-label="DATA301 Machine Learning home">
          <Image
            src="/brand/vidyashilp-university.png"
            alt="Vidyashilp University"
            width={140}
            height={51}
            priority
          />
          <span className="v51-brand__rule" aria-hidden="true" />
          <span className="v51-brand__course">
            <strong>DATA301</strong>
            <small>Machine Learning Studio</small>
          </span>
        </Link>

        <nav className="v51-nav" aria-label="Primary navigation">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                className={active ? 'v51-nav__link is-active' : 'v51-nav__link'}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="v51-header__actions">
          <Link className="v51-icon-button" href="/search" aria-label="Search course content">
            <Icon name="search" size={19} />
          </Link>

          <button
            className="v51-menu"
            type="button"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <Icon name={open ? 'x' : 'menu'} size={20} />
          </button>
        </div>
      </div>

      {open ? (
        <nav className="v51-mobile-nav" aria-label="Mobile navigation">
          <div className="shell">
            {nav.map((item) => (
              <Link href={item.href} key={item.href}>
                <span>{item.label}</span>
                <Icon name="arrow" size={17} />
              </Link>
            ))}
            <Link href="/admin/login">
              <span>Instructor portal</span>
              <Icon name="lock" size={16} />
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

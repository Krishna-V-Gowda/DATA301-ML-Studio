'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';

const items = [
  { href: '/admin', label: 'Dashboard', icon: 'grid' as const },
  { href: '/admin/materials', label: 'Materials', icon: 'file' as const },
  { href: '/admin/sessions', label: 'Sessions', icon: 'book' as const },
  { href: '/admin/review', label: 'Review queue', icon: 'check' as const },
  { href: '/admin/settings', label: 'Settings', icon: 'settings' as const },
];

export function AdminSidebar({ role }: { role: string }) {
  const pathname = usePathname();
  return (
    <aside className="admin-sidebar">
      <Link className="admin-brand" href="/admin">
        <Image src="/brand/vidyashilp-university.png" alt="Vidyashilp University" width={158} height={58} />
        <div><strong>DATA301</strong><span>Course administration</span></div>
      </Link>
      <nav>{items.map((item) => { const active = pathname === item.href; return <Link className={active ? 'is-active' : ''} href={item.href} key={item.href}><Icon name={item.icon} /><span>{item.label}</span>{active ? <i /> : null}</Link>; })}</nav>
      <div className="admin-sidebar__footer"><span className="role-pill">{role}</span><Link href="/" target="_blank">View student site <Icon name="arrow" size={16} /></Link></div>
    </aside>
  );
}

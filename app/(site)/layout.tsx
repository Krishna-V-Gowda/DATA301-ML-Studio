import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { headers } from 'next/headers';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const requestHeaders = await headers();
  const pathname = requestHeaders.get('x-nextjs-url') ?? requestHeaders.get('referer') ?? '';
  const isHome = pathname === '/' || pathname.endsWith('/');

  return (
    <div className="site-frame">
      <SiteHeader />
      {children}
      <SiteFooter compact={!isHome} />
    </div>
  );
}

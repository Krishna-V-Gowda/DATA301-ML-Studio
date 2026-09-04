'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function RecoveryRedirect() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || pathname === '/admin/reset-password') return;

    const params = new URLSearchParams(hash.slice(1));
    if (params.get('type') !== 'recovery' || !params.get('access_token')) return;

    window.location.replace(`/admin/reset-password${hash}`);
  }, [pathname]);

  return null;
}

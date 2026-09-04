'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main-content" className="error-page">
      <div className="error-card">
        <span className="eyebrow">Temporary interruption</span>
        <Icon name="spark" size={36} />
        <h1>This page could not be completed.</h1>
        <p>The course data is safe. Retry the request, or return to the learning platform.</p>
        <div className="error-card__actions">
          <button className="button button--primary" type="button" onClick={reset}>Try again</button>
          <Link className="button button--quiet" href="/">Return home</Link>
        </div>
        {error.digest ? <small>Reference: {error.digest}</small> : null}
      </div>
    </main>
  );
}

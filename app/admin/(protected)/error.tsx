'use client';

import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="admin-card admin-error" role="alert">
      <Icon name="lock" size={30} />
      <span className="eyebrow">Instructor workspace</span>
      <h1>This administration view could not be loaded.</h1>
      <p>Your course data was not changed. Retry the request, or return to the dashboard.</p>
      <div className="admin-form__actions">
        <button className="button button--primary" type="button" onClick={reset}>Try again</button>
        <Link className="button button--quiet" href="/admin">Dashboard</Link>
      </div>
    </section>
  );
}

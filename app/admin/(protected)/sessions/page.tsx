export const dynamic = 'force-dynamic';

import { SessionManager } from '@/components/admin/SessionManager';
import { modules } from '@/lib/course-data';
import { createClient } from '@/lib/supabase/server';
import type { SessionStatus } from '@/lib/types';

export default async function AdminSessionsPage() {
  const supabase = await createClient();
  const [courseResult, sessionResult] = await Promise.all([
    supabase.from('courses').select('id').eq('code', 'DATA301').maybeSingle(),
    supabase.from('sessions').select('number,status').order('number'),
  ]);
  if (courseResult.error) throw new Error(`Course could not be loaded: ${courseResult.error.message}`);
  if (sessionResult.error) throw new Error(`Sessions could not be loaded: ${sessionResult.error.message}`);
  const course = courseResult.data;
  const rows = sessionResult.data;

  if (!course) {
    return (
      <section className="admin-card"><div className="empty-state admin-empty"><h1>DATA301 is not seeded.</h1><p>Run <code>supabase/schema.sql</code>, then reload this page.</p></div></section>
    );
  }

  const initialStatuses = Object.fromEntries(
    (rows ?? []).map((row) => [Number(row.number), row.status as SessionStatus]),
  );

  return (
    <>
      <div className="admin-page-heading">
        <div><span className="eyebrow">15-week sequence</span><h1>Lecture and practice sessions</h1><p>Track readiness, publication, and completion across all 30 lecture sessions.</p></div>
        <div className="admin-heading-badge"><strong>30L</strong><span>60 practice hours</span></div>
      </div>
      <section className="admin-card admin-card--table">
        <SessionManager courseId={course.id} modules={modules} initialStatuses={initialStatuses} />
      </section>
    </>
  );
}

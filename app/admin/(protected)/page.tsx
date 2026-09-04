export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { materials as baselineMaterials, modules } from '@/lib/course-data';
import { createClient } from '@/lib/supabase/server';
import type { SessionStatus } from '@/lib/types';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const results = await Promise.all([
    supabase.from('materials').select('*', { count: 'exact', head: true }).neq('status', 'archived'),
    supabase.from('materials').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('materials').select('*', { count: 'exact', head: true }).in('status', ['published', 'scheduled']).lte('publish_at', new Date().toISOString()),
    supabase.from('materials').select('id,title,kind,status,publish_at,created_at,file_name,version').order('created_at', { ascending: false }).limit(5),
    supabase.from('sessions').select('number,module_slug,status').order('number'),
  ]);
  const firstError = results.find((result) => result.error)?.error;
  if (firstError) throw new Error(`Administration data could not be loaded: ${firstError.message}`);
  const [materialResult, draftResult, publishedResult, recentResult, sessionResult] = results;
  const databaseMaterialCount = materialResult.count;
  const draftCount = draftResult.count;
  const databasePublishedCount = publishedResult.count;
  const recent = recentResult.data;
  const sessionRows = sessionResult.data;

  const statusByNumber = new Map<number, SessionStatus>(
    (sessionRows ?? []).map((row) => [Number(row.number), row.status as SessionStatus]),
  );
  const firstPending = modules.flatMap((module) => module.lectures).find((lecture) => {
    const status = statusByNumber.get(lecture.number) ?? 'planned';
    return status !== 'completed';
  });
  const managedMaterialCount = databaseMaterialCount ?? 0;
  const managedPublishedCount = databasePublishedCount ?? 0;
  const activeMaterialCount = managedMaterialCount > 0 ? managedMaterialCount : baselineMaterials.length;
  const publishedMaterialCount = managedPublishedCount > 0 ? managedPublishedCount : baselineMaterials.length;

  return (
    <>
      <div className="admin-page-heading">
        <div><span className="eyebrow">Course control centre</span><h1>DATA301 administration</h1><p>Keep the course current, structured, and publication-ready.</p></div>
        <Link className="button button--primary" href="/admin/materials"><Icon name="upload" /> Add material</Link>
      </div>
      <div className="admin-stat-grid">
        <article><span>Active materials</span><strong>{activeMaterialCount}</strong><small>{managedMaterialCount > 0 ? `${managedMaterialCount} managed in Supabase` : `${baselineMaterials.length} packaged for setup`}</small><Icon name="file" /></article>
        <article><span>Published</span><strong>{publishedMaterialCount}</strong><small>Visible to students</small><Icon name="check" /></article>
        <article><span>Drafts</span><strong>{draftCount ?? 0}</strong><small>Awaiting review</small><Icon name="settings" /></article>
        <article><span>Course sessions</span><strong>30</strong><small>15-week schedule</small><Icon name="book" /></article>
      </div>
      <div className="admin-dashboard-grid">
        <section className="admin-card admin-card--wide">
          <div className="admin-card__heading"><div><span className="eyebrow">Module publication</span><h2>Course progression</h2></div><Link href="/admin/sessions">Manage sessions <Icon name="arrow" size={16} /></Link></div>
          <div className="admin-module-progress">
            {modules.map((module) => {
              const statuses = module.lectures.map((lecture) => statusByNumber.get(lecture.number) ?? 'planned');
              const active = statuses.filter((status) => status !== 'planned').length;
              const completed = statuses.filter((status) => status === 'completed').length;
              const percentage = Math.round((active / module.lectures.length) * 100);
              const label = completed === module.lectures.length ? 'Completed' : active ? 'In progress' : 'Planned';
              return (
                <div key={module.slug}>
                  <div className={`admin-module-progress__number module-dot--${module.accent}`}>0{module.number}</div>
                  <div><span>{module.shortTitle}</span><strong>{label}</strong></div>
                  <div className="progress-track" aria-label={`${module.shortTitle}: ${percentage}% active`}><i style={{ width: `${percentage}%` }} /></div>
                  <small>{active}/{module.lectures.length} active</small>
                </div>
              );
            })}
          </div>
        </section>
        <section className="admin-card">
          <div className="admin-card__heading"><div><span className="eyebrow">Quality gate</span><h2>Needs attention</h2></div><Link href="/admin/review">Open queue</Link></div>
          <div className="attention-list">
            <article className="attention-item attention-item--high"><span>High</span><div><strong>Verify assessment weights</strong><p>Supplied files contain differing distributions.</p></div></article>
            {firstPending ? <article><span>Next</span><div><strong>Prepare Lecture {String(firstPending.number).padStart(2, '0')}</strong><p>{firstPending.title}</p></div></article> : <article><span>Done</span><div><strong>All sessions completed</strong><p>The full reference session sequence is marked complete.</p></div></article>}
            <article><span>QA</span><div><strong>Review metadata before publishing</strong><p>Confirm title, module, session, and file version.</p></div></article>
          </div>
        </section>
        <section className="admin-card admin-card--wide">
          <div className="admin-card__heading"><div><span className="eyebrow">Recent activity</span><h2>Latest managed materials</h2></div><Link href="/admin/materials">View all</Link></div>
          {recent?.length ? <div className="recent-materials">{recent.map((item) => { const released = item.status === 'scheduled' && item.publish_at && new Date(item.publish_at) <= new Date(); const effectiveStatus = released ? 'published' : item.status; return <div key={item.id}><span className={`file-kind file-kind--${item.kind}`}>{item.kind.slice(0, 2).toUpperCase()}</span><div><strong>{item.title}</strong><small>Version {item.version} · {item.file_name}</small></div><span className={`status-badge status-badge--${effectiveStatus}`}>{released ? 'published · scheduled' : item.status}</span></div>; })}</div> : <div className="empty-state-inline">No managed database materials yet. The author-created public fallback resources remain available on the learning site.</div>}
        </section>
      </div>
    </>
  );
}

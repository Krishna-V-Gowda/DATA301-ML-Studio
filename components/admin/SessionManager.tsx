'use client';

import { useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { CourseModule, SessionStatus } from '@/lib/types';

type ModuleFilter = 'all' | string;
type StatusFilter = 'all' | SessionStatus;

const statusLabels: Record<SessionStatus, string> = {
  planned: 'Planned',
  ready: 'Ready',
  published: 'Published',
  completed: 'Completed',
};

export function SessionManager({
  courseId,
  modules,
  initialStatuses,
}: {
  courseId: string;
  modules: CourseModule[];
  initialStatuses: Record<number, SessionStatus>;
}) {
  const all = useMemo(
    () => modules.flatMap((module) => module.lectures.map((lecture) => ({ ...lecture, module }))),
    [modules],
  );
  const [statuses, setStatuses] = useState<Record<number, SessionStatus>>(initialStatuses);
  const [moduleFilter, setModuleFilter] = useState<ModuleFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [query, setQuery] = useState('');
  const [saving, setSaving] = useState<number | null>(null);
  const [saved, setSaved] = useState<number | null>(null);
  const [error, setError] = useState('');

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return all.filter((session) => {
      const currentStatus = statuses[session.number] ?? 'planned';
      const matchesModule = moduleFilter === 'all' || session.module.slug === moduleFilter;
      const matchesStatus = statusFilter === 'all' || currentStatus === statusFilter;
      const matchesQuery = !term || [
        session.title,
        session.practice?.code ?? '',
        session.practice?.title ?? '',
        `lecture ${session.number}`,
      ].join(' ').toLowerCase().includes(term);
      return matchesModule && matchesStatus && matchesQuery;
    });
  }, [all, moduleFilter, query, statusFilter, statuses]);

  const summary = useMemo(() => {
    return all.reduce<Record<SessionStatus, number>>((counts, session) => {
      counts[statuses[session.number] ?? 'planned'] += 1;
      return counts;
    }, { planned: 0, ready: 0, published: 0, completed: 0 });
  }, [all, statuses]);

  async function update(number: number, next: SessionStatus) {
    const previous = statuses[number] ?? 'planned';
    setStatuses((current) => ({ ...current, [number]: next }));
    setSaving(number);
    setSaved(null);
    setError('');

    try {
      const supabase = createClient();
      const session = all.find((item) => item.number === number);
      if (!session) throw new Error('The requested course session could not be found.');

      const { error: upsertError } = await supabase.from('sessions').upsert({
        course_id: courseId,
        module_slug: session.module.slug,
        number: session.number,
        title: session.title,
        practice_code: session.practice?.code ?? null,
        practice_title: session.practice?.title ?? null,
        status: next,
        completed_at: next === 'completed' ? new Date().toISOString() : null,
      }, { onConflict: 'course_id,number' });

      if (upsertError) throw upsertError;
      setSaved(number);
      window.setTimeout(() => setSaved((current) => current === number ? null : current), 1800);
    } catch (caught) {
      setStatuses((current) => ({ ...current, [number]: previous }));
      setError(caught instanceof Error ? caught.message : 'Unable to update the session.');
    } finally {
      setSaving(null);
    }
  }

  return (
    <>
      <div className="session-summary" aria-label="Session status summary">
        {(Object.keys(statusLabels) as SessionStatus[]).map((item) => (
          <button
            type="button"
            className={statusFilter === item ? 'is-active' : ''}
            aria-pressed={statusFilter === item}
            onClick={() => setStatusFilter((current) => current === item ? 'all' : item)}
            key={item}
          >
            <strong>{summary[item]}</strong><span>{statusLabels[item]}</span>
          </button>
        ))}
      </div>

      <div className="admin-filterbar session-filterbar">
        <div className="admin-filter-buttons" aria-label="Module filters">
          <button className={moduleFilter === 'all' ? 'is-active' : ''} aria-pressed={moduleFilter === 'all'} type="button" onClick={() => setModuleFilter('all')}>All modules</button>
          {modules.map((module) => (
            <button className={moduleFilter === module.slug ? 'is-active' : ''} aria-pressed={moduleFilter === module.slug} type="button" onClick={() => setModuleFilter(module.slug)} key={module.slug}>M{module.number}</button>
          ))}
        </div>
        <label className="admin-search">
          <span className="sr-only">Search sessions</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search lecture or practice…" />
        </label>
        <small>{visible.length} of {all.length} sessions · changes save immediately</small>
      </div>

      {error ? <div className="form-error" role="alert">{error}</div> : null}
      {visible.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table session-admin-table">
            <thead><tr><th>Session</th><th>Module</th><th>Lecture focus</th><th>Practice</th><th>Status</th></tr></thead>
            <tbody>
              {visible.map((session) => {
                const currentStatus = statuses[session.number] ?? 'planned';
                return (
                  <tr key={session.number}>
                    <td><strong>L{String(session.number).padStart(2, '0')}</strong></td>
                    <td><span className={`module-dot module-dot--${session.module.accent}`} />M{session.module.number}</td>
                    <td><strong>{session.title}</strong></td>
                    <td>{session.practice ? <span><b>{session.practice.code}</b>{session.practice.title}</span> : <em>—</em>}</td>
                    <td>
                      <div className="session-status-control">
                        <select
                          aria-label={`Status for lecture ${session.number}`}
                          value={currentStatus}
                          disabled={saving === session.number}
                          onChange={(event) => update(session.number, event.target.value as SessionStatus)}
                        >
                          {(Object.keys(statusLabels) as SessionStatus[]).map((item) => <option value={item} key={item}>{statusLabels[item]}</option>)}
                        </select>
                        <span className={`save-indicator ${saving === session.number ? 'is-saving' : saved === session.number ? 'is-saved' : ''}`} aria-live="polite">
                          {saving === session.number ? 'Saving…' : saved === session.number ? 'Saved' : ''}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state admin-empty"><h2>No sessions match these filters.</h2><p>Clear the search or select another module or status.</p></div>
      )}
    </>
  );
}

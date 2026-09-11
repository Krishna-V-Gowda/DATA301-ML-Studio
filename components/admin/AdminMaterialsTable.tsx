'use client';

import { useMemo, useState } from 'react';
import { archiveMaterial, publishMaterial } from '@/app/actions/materials';
import { Icon } from '@/components/ui/Icon';

type MaterialRow = {
  id: string;
  title: string;
  description: string | null;
  kind: string;
  module_slug: string | null;
  session_number: number | null;
  status: string;
  visibility: 'public' | 'staff';
  publish_at: string | null;
  file_name: string;
  file_size_bytes: number | null;
  version: number;
  created_at: string;
};

type ModuleOption = { slug: string; shortTitle: string };

const statusFilters = ['all', 'draft', 'scheduled', 'published'] as const;

function formatBytes(value: number | null) {
  if (!value) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  return `${(value / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}


function effectiveStatus(row: MaterialRow, asOf: string) {
  const released = row.status === 'scheduled' && row.publish_at && new Date(row.publish_at) <= new Date(asOf);
  return released ? { value: 'published', label: 'published · scheduled' } : { value: row.status, label: row.status };
}

export function AdminMaterialsTable({ rows, modules, asOf }: { rows: MaterialRow[]; modules: ModuleOption[]; asOf: string }) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<(typeof statusFilters)[number]>('all');

  const moduleLabels = useMemo(() => new Map(modules.map((module) => [module.slug, module.shortTitle])), [modules]);
  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return rows.filter((row) => {
      const displayStatus = effectiveStatus(row, asOf).value;
      const matchesStatus = statusFilter === 'all' || displayStatus === statusFilter;
      const matchesQuery = !term || [
        row.title,
        row.description ?? '',
        row.file_name,
        row.kind,
        row.module_slug ? moduleLabels.get(row.module_slug) ?? row.module_slug : 'course-wide',
        row.session_number ? `lecture ${row.session_number}` : '',
      ].join(' ').toLowerCase().includes(term);
      return matchesStatus && matchesQuery;
    });
  }, [asOf, moduleLabels, query, rows, statusFilter]);

  return (
    <>
      <div className="admin-filterbar">
        <label className="admin-search"><Icon name="search" size={18} /><span className="sr-only">Search materials</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search materials…" /></label>
        <div className="admin-filter-buttons" aria-label="Material status filters">
          {statusFilters.map((item) => (
            <button className={statusFilter === item ? 'is-active' : ''} aria-pressed={statusFilter === item} type="button" onClick={() => setStatusFilter(item)} key={item}>{item === 'all' ? 'All' : item}</button>
          ))}
        </div>
        <small>{visible.length} of {rows.length} material{rows.length === 1 ? '' : 's'}</small>
      </div>

      {visible.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Material</th><th>Placement</th><th>File</th><th>Status</th><th>Audience</th><th>Publish time</th><th>Actions</th></tr></thead>
            <tbody>
              {visible.map((row) => {
                const displayStatus = effectiveStatus(row, asOf);
                return (
                  <tr key={row.id}>
                    <td><div className="table-material"><span className={`file-kind file-kind--${row.kind}`}>{row.kind.slice(0, 2).toUpperCase()}</span><div><strong>{row.title}</strong><small>Version {row.version} · {row.description || 'No description'}</small></div></div></td>
                    <td><strong>{row.module_slug ? moduleLabels.get(row.module_slug) ?? row.module_slug : 'Course-wide'}</strong><small>{row.session_number ? `Lecture ${row.session_number}` : 'No session'}</small></td>
                    <td><strong>{row.file_name}</strong><small>{formatBytes(row.file_size_bytes)}</small></td>
                    <td><span className={`status-badge status-badge--${displayStatus.value}`}>{displayStatus.label}</span></td>
                    <td><span className={`visibility-badge visibility-badge--${row.visibility}`}>{row.visibility === 'staff' ? 'Instructor only' : 'Students'}</span></td>
                    <td>{row.publish_at ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(new Date(row.publish_at)) : '—'}</td>
                    <td>
                      <div className="table-actions">
                        <a href={`/api/admin/materials/${row.id}`} target="_blank" rel="noreferrer" title="Open private file" aria-label={`Open ${row.title}`}><Icon name="external" size={17} /></a>
                        {displayStatus.value !== 'published' ? <form action={publishMaterial}><input type="hidden" name="id" value={row.id} /><button type="submit" title="Publish now" aria-label={`Publish ${row.title}`}><Icon name="check" size={17} /></button></form> : null}
                        <form action={archiveMaterial} onSubmit={(event) => { if (!window.confirm(`Archive “${row.title}” version ${row.version}?`)) event.preventDefault(); }}><input type="hidden" name="id" value={row.id} /><button type="submit" title="Archive" aria-label={`Archive ${row.title}`}><Icon name="x" size={17} /></button></form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state admin-empty"><Icon name="search" size={34} /><h2>No materials match this view.</h2><p>Clear the search or select a different publication status.</p></div>
      )}
    </>
  );
}

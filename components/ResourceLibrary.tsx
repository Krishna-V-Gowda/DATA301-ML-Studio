'use client';

import { useMemo, useState } from 'react';
import { MaterialCard } from '@/components/MaterialCard';
import type { Material } from '@/lib/types';

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Slides', value: 'slides' },
  { label: 'Notes', value: 'notes' },
  { label: 'Labs', value: 'lab' },
  { label: 'Assignments', value: 'assignment' },
  { label: 'Course documents', value: 'course' },
] as const;

export function ResourceLibrary({ materials }: { materials: Material[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]['value']>('all');
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return materials.filter((material) => {
      const matchesFilter = filter === 'all'
        || material.kind === filter
        || (filter === 'course' && ['course-outline', 'course-plan'].includes(material.kind));
      const matchesQuery = !term
        || [material.title, material.description, material.fileName, material.format]
          .join(' ')
          .toLowerCase()
          .includes(term);
      return matchesFilter && matchesQuery;
    });
  }, [filter, materials, query]);

  return (
    <>
      <div className="resource-toolbar resource-toolbar--interactive">
        <div>
          <span className="eyebrow">Published now</span>
          <h2>Course documents and learning materials.</h2>
          <p>{visible.length} of {materials.length} published file{materials.length === 1 ? '' : 's'} shown.</p>
        </div>
        <div className="resource-controls">
          <label className="resource-search">
            <span className="sr-only">Search published resources</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search resources…" />
          </label>
          <div className="resource-filter-buttons" aria-label="Resource type filters">
            {filters.map((item) => (
              <button
                className={filter === item.value ? 'is-active' : ''}
                aria-pressed={filter === item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                key={item.value}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {visible.length ? (
        <div className="material-grid">{visible.map((material) => <MaterialCard key={material.id} material={material} />)}</div>
      ) : (
        <div className="empty-state"><h2>No resources match this view.</h2><p>Clear the search or choose a different material type.</p></div>
      )}
    </>
  );
}

'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import type { SearchDocument } from '@/lib/search-index';

const filters = ['All', 'Topic', 'Module', 'Lab', 'Material'] as const;

function normalize(value: string) {
  return value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s-]/g, ' ');
}

export function SearchClient({ documents }: { documents: SearchDocument[] }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;
      if (event.key === '/' && !isTyping) {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (event.key === 'Escape' && document.activeElement === inputRef.current) {
        setQuery('');
        inputRef.current?.blur();
      }
    }
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const results = useMemo(() => {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    return documents
      .filter((document) => filter === 'All' || document.type === filter)
      .map((document) => {
        const normalizedTitle = normalize(document.title);
        const normalizedDescription = normalize(document.description);
        const normalizedKeywords = document.keywords.map(normalize);
        const score = terms.reduce((total, term) => {
          const titleMatch = normalizedTitle.includes(term) ? 5 : 0;
          const descriptionMatch = normalizedDescription.includes(term) ? 2 : 0;
          const keywordMatch = normalizedKeywords.some((keyword) => keyword.includes(term)) ? 3 : 0;
          return total + titleMatch + descriptionMatch + keywordMatch;
        }, 0);
        return { document, score };
      })
      .filter((item) => terms.length === 0 || item.score > 0)
      .sort((a, b) => b.score - a.score || a.document.title.localeCompare(b.document.title))
      .slice(0, 30);
  }, [documents, query, filter]);

  return (
    <div className="search-experience">
      <div className="search-box">
        <Icon name="search" size={24} />
        <input
          ref={inputRef}
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try ‘false positives’, ‘dimensionality’, or ‘scaling’…"
          aria-label="Search course content"
        />
        {query ? (
          <button type="button" onClick={() => setQuery('')} aria-label="Clear search"><Icon name="x" /></button>
        ) : <kbd aria-hidden="true">/</kbd>}
      </div>
      <div className="search-filters" aria-label="Search result filters">
        {filters.map((item) => (
          <button
            type="button"
            className={filter === item ? 'is-active' : ''}
            aria-pressed={filter === item}
            onClick={() => setFilter(item)}
            key={item}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="search-summary" aria-live="polite">
        <span>{results.length} result{results.length === 1 ? '' : 's'}</span>
        {query ? <small>for “{query}”</small> : <small>Browse the complete index</small>}
      </div>
      <div className="search-results">
        {results.map(({ document }) => (
          <Link
            href={document.href}
            key={document.id}
            target={document.type === 'Material' ? '_blank' : undefined}
            rel={document.type === 'Material' ? 'noreferrer' : undefined}
          >
            <span className={`search-type search-type--${document.type.toLowerCase()}`}>{document.type}</span>
            <div>
              <h2>{document.title}</h2>
              <p>{document.description}</p>
              <div className="search-keywords">{document.keywords.filter(Boolean).slice(0, 4).map((keyword) => <span key={keyword}>{keyword}</span>)}</div>
            </div>
            <Icon name={document.type === 'Material' ? 'download' : 'arrow'} />
          </Link>
        ))}
        {!results.length ? <div className="empty-state"><Icon name="search" size={30} /><h2>No matching concept yet.</h2><p>Try a broader term or browse the learning roadmap.</p></div> : null}
      </div>
    </div>
  );
}

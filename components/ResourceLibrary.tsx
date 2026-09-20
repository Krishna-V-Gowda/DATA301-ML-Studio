'use client';
import { useMemo, useState } from 'react';
import type { Material } from '@/lib/types';

const readableResourceIds = new Set(['public-course-guide','public-lab-guide','public-module-2-guide']);

const filters = [
  { label: 'All', value: 'all' }, { label: 'Slides', value: 'slides' }, { label: 'Notes', value: 'notes' }, { label: 'Labs', value: 'lab' }, { label: 'Assignments', value: 'assignment' }, { label: 'Course docs', value: 'course' },
] as const;

export function ResourceLibrary({ materials }: { materials: Material[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]['value']>('all');
  const [query, setQuery] = useState('');
  const visible = useMemo(() => { const term = query.trim().toLowerCase(); return materials.filter((m) => { const byType = filter==='all' || m.kind===filter || (filter==='course' && ['course-outline','course-plan'].includes(m.kind)); const bySearch = !term || [m.title,m.description,m.fileName,m.format].join(' ').toLowerCase().includes(term); return byType && bySearch; }); }, [filter,materials,query]);
  return <>
    <div style={{display:'flex',justifyContent:'space-between',gap:25,alignItems:'end',paddingBottom:18}}><div><p className="d6-eyebrow">Published material</p><h2 style={{margin:'10px 0 0',fontFamily:'var(--d6-serif)',fontSize:'clamp(2.4rem,4vw,4rem)',fontWeight:400,lineHeight:.9,letterSpacing:'-.05em'}}>A working library,<br/>not a file dump.</h2><p style={{margin:'11px 0 0',color:'var(--d6-muted)',fontSize:11}}>{visible.length} of {materials.length} published files shown.</p></div><div style={{minWidth:320}}><label><span className="sr-only">Search published resources</span><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search the library" style={{width:'100%',height:42,padding:'0 12px',border:'1px solid var(--d6-line-strong)',background:'var(--d6-paper)'}}/></label><div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:7}}>{filters.map((f)=><button key={f.value} type="button" aria-pressed={filter===f.value} onClick={()=>setFilter(f.value)} style={{padding:'8px 9px',border:'1px solid var(--d6-line)',background:filter===f.value?'var(--d6-ink)':'transparent',color:filter===f.value?'var(--d6-white)':'var(--d6-ink-2)',fontSize:9,fontWeight:800,letterSpacing:'.08em',textTransform:'uppercase'}}>{f.label}</button>)}</div></div></div>
    <div className="d6-resource-list">{visible.length ? visible.map((m,i)=><a className="d6-resource-row" href={readableResourceIds.has(m.id) ? `/resources/read/${m.id}` : m.href} key={m.id}><span className="d6-resource-row__num">{String(i+1).padStart(2,'0')}</span><div><h3>{m.title}</h3><p>{m.description}</p></div><span className="d6-resource-row__kind">{m.kind === "reference" ? "Course guide" : m.kind === "lab" ? "Implementation" : m.kind === "slides" ? "Course guide" : m.kind}</span><span className="d6-resource-row__meta">{m.id.startsWith("public-") ? "Readable document" : m.format}<br/>{m.sizeLabel}</span><span className="d6-resource-row__open">→</span></a>) : <div style={{padding:'40px 0',color:'var(--d6-muted)'}}>No resources match this view.</div>}</div>
  </>;
}

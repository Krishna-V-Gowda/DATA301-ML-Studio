export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { assessmentReviewFlag } from '@/lib/course-data';
import { createClient } from '@/lib/supabase/server';

export default async function ReviewPage() {
  const supabase = await createClient();
  const { data: pending, error } = await supabase.from('materials').select('id,title,status,publish_at,file_name,kind').in('status', ['draft', 'scheduled']).order('created_at');
  if (error) throw new Error(`Review queue could not be loaded: ${error.message}`);
  return (
    <>
      <div className="admin-page-heading"><div><span className="eyebrow">Publication quality gate</span><h1>Review queue</h1><p>Resolve source conflicts and approve content before it reaches students.</p></div><span className="review-count">{(pending?.length ?? 0) + 1} item{(pending?.length ?? 0) + 1 === 1 ? '' : 's'}</span></div>
      <div className="review-grid">
        <section className="review-card review-card--critical"><div className="review-card__severity">High priority</div><div className="review-card__icon"><Icon name="spark" /></div><div><span>Source verification</span><h2>{assessmentReviewFlag.title}</h2><p>{assessmentReviewFlag.detail}</p><div className="source-conflict"><div><strong>Course overview</strong><span>A1 25 · Mid review 10 · A2 25 · Participation 20 · Final review 20</span></div><div><strong>Detailed course plan</strong><span>Contains different assessment summaries and later schedule values.</span></div></div><p className="review-decision">Recommended action: obtain written instructor confirmation and designate one authoritative assessment structure before publishing percentages.</p></div><button className="button button--quiet" type="button" disabled title="Requires written instructor confirmation">Awaiting instructor confirmation</button></section>
        {pending?.map((item) => <section className="review-card" key={item.id}><div className="review-card__severity">{item.status}</div><div className="review-card__icon"><Icon name="file" /></div><div><span>{item.kind}</span><h2>{item.title}</h2><p>{item.file_name}</p>{item.publish_at ? <small>Scheduled for {new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(new Date(item.publish_at))}</small> : <small>No publish time selected.</small>}</div><Link className="button button--quiet" href="/admin/materials">Review material</Link></section>)}
        {!pending?.length ? <section className="review-card review-card--clear"><div className="review-card__icon"><Icon name="check" /></div><div><span>Publishing workflow</span><h2>No draft or scheduled materials.</h2><p>New uploads will appear here until they are reviewed and published.</p></div></section> : null}
      </div>
    </>
  );
}

export const dynamic = 'force-dynamic';

import { AdminMaterialsTable } from '@/components/admin/AdminMaterialsTable';
import { MaterialUploader } from '@/components/admin/MaterialUploader';
import { modules } from '@/lib/course-data';
import { createClient } from '@/lib/supabase/server';

export default async function AdminMaterialsPage() {
  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from('materials')
    .select('id,title,description,kind,module_slug,session_number,status,visibility,publish_at,file_name,file_size_bytes,version,created_at')
    .neq('status', 'archived')
    .order('created_at', { ascending: false });
  if (error) throw new Error(`Materials could not be loaded: ${error.message}`);

  const moduleOptions = modules.map((module) => ({ slug: module.slug, shortTitle: module.shortTitle }));

  return (
    <>
      <div className="admin-page-heading">
        <div><span className="eyebrow">Content library</span><h1>Materials</h1><p>Upload, version, schedule, publish, and archive course files.</p></div>
        <MaterialUploader modules={modules.map((module) => ({ slug: module.slug, title: `Module ${module.number}: ${module.shortTitle}`, lectures: module.lectures.map(({ number, title }) => ({ number, title })) }))} />
      </div>
      <section className="admin-card admin-card--table">
        {(rows ?? []).length ? (
          <AdminMaterialsTable rows={rows ?? []} modules={moduleOptions} asOf={new Date().toISOString()} />
        ) : (
          <div className="empty-state admin-empty"><h2>No database materials yet.</h2><p>Upload a course file, save it as a draft, or publish it immediately.</p></div>
        )}
      </section>
    </>
  );
}

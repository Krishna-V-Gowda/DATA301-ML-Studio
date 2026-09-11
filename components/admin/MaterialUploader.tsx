'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { createClient } from '@/lib/supabase/client';

const mimeByExtension: Record<string, string> = {
  pdf: 'application/pdf',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  txt: 'text/plain',
  md: 'text/markdown',
  zip: 'application/zip',
  csv: 'text/csv',
};

const allowedTypes = new Set(Object.values(mimeByExtension));

type UploadState = 'idle' | 'uploading' | 'saving' | 'success' | 'error';
type PublishState = 'draft' | 'scheduled' | 'published';
type Visibility = 'public' | 'staff';

function cleanFileName(name: string) {
  return name
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function fileExtension(name: string) {
  return name.split('.').pop()?.toLowerCase() ?? '';
}

type UploadModule = {
  slug: string;
  title: string;
  lectures: Array<{ number: number; title: string }>;
};

export function MaterialUploader({ modules }: { modules: UploadModule[] }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<UploadState>('idle');
  const [message, setMessage] = useState('');
  const [publishState, setPublishState] = useState<PublishState>('draft');
  const [selectedModule, setSelectedModule] = useState('general');
  const [selectedSession, setSelectedSession] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const busy = state === 'uploading' || state === 'saving';
  const sessionOptions = useMemo(
    () => modules.find((module) => module.slug === selectedModule)?.lectures ?? [],
    [modules, selectedModule],
  );

  const close = useCallback(() => {
    if (busy) return;
    setOpen(false);
    setState('idle');
    setMessage('');
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }, [busy]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => titleRef.current?.focus(), 20);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !busy) {
        close();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [busy, close, open]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    const form = new FormData(event.currentTarget);
    const file = form.get('file');
    const status = String(form.get('status')) as PublishState;
    const publishAtInput = String(form.get('publish_at') || '');
    const visibility = String(form.get('visibility') || 'public') as Visibility;

    if (!(file instanceof File) || file.size === 0) {
      setState('error');
      setMessage('Select a file to upload.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setState('error');
      setMessage('Files must be 50 MB or smaller.');
      return;
    }

    const extension = fileExtension(file.name);
    const effectiveMime = mimeByExtension[extension] || file.type;
    if (!mimeByExtension[extension] || !effectiveMime || !allowedTypes.has(effectiveMime)) {
      setState('error');
      setMessage('This file type is not approved for course materials.');
      return;
    }

    let publishAt: string | null = null;
    if (status === 'scheduled') {
      const scheduledDate = publishAtInput ? new Date(publishAtInput) : null;
      if (!scheduledDate || Number.isNaN(scheduledDate.getTime())) {
        setState('error');
        setMessage('Choose a valid publication date and time for scheduled material.');
        return;
      }
      if (scheduledDate.getTime() <= Date.now()) {
        setState('error');
        setMessage('Scheduled publication must be in the future.');
        return;
      }
      publishAt = scheduledDate.toISOString();
    } else if (status === 'published') {
      publishAt = new Date().toISOString();
    }

    setState('uploading');

    try {
      const supabase = createClient();
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) throw new Error('Your session has expired. Sign in again.');

      const title = String(form.get('title')).trim();
      if (!title) throw new Error('Enter a material title.');
      const kind = String(form.get('kind'));
      const moduleSlug = String(form.get('module_slug') || 'general');
      const sessionNumber = form.get('session_number') ? Number(form.get('session_number')) : null;
      const safeName = cleanFileName(file.name) || `material-${Date.now()}.${extension}`;
      const storagePath = `data301/${moduleSlug}/${crypto.randomUUID()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from('course-materials')
        .upload(storagePath, file, { cacheControl: '3600', upsert: false, contentType: effectiveMime });
      if (uploadError) throw uploadError;

      setState('saving');
      const { data: courseRecord, error: courseError } = await supabase.from('courses').select('id').eq('code', 'DATA301').single();
      if (courseError || !courseRecord) {
        await supabase.storage.from('course-materials').remove([storagePath]);
        throw new Error('DATA301 has not been seeded in Supabase.');
      }

      const { data: priorVersions, error: versionError } = await supabase
        .from('materials')
        .select('version,module_slug,session_number')
        .eq('course_id', courseRecord.id)
        .eq('title', title)
        .eq('kind', kind);
      if (versionError) {
        await supabase.storage.from('course-materials').remove([storagePath]);
        throw versionError;
      }

      const normalizedModule = moduleSlug === 'general' ? null : moduleSlug;
      const matchingVersions = (priorVersions ?? [])
        .filter((item) => item.module_slug === normalizedModule && item.session_number === sessionNumber)
        .map((item) => Number(item.version));
      const version = matchingVersions.length ? Math.max(...matchingVersions) + 1 : 1;

      const { error: insertError } = await supabase.from('materials').insert({
        course_id: courseRecord.id,
        title,
        description: String(form.get('description') || '').trim(),
        kind,
        module_slug: normalizedModule,
        session_number: sessionNumber,
        status,
        visibility,
        publish_at: publishAt,
        storage_bucket: 'course-materials',
        storage_path: storagePath,
        file_name: file.name,
        file_size_bytes: file.size,
        mime_type: effectiveMime,
        format: extension.toUpperCase(),
        version,
        created_by: userData.user.id,
      });
      if (insertError) {
        await supabase.storage.from('course-materials').remove([storagePath]);
        throw insertError;
      }

      let sessionWarning = '';
      const nextSessionStatus = visibility === 'public'
        ? status === 'published' ? 'published' : status === 'scheduled' ? 'ready' : null
        : null;
      if (sessionNumber && normalizedModule && nextSessionStatus) {
        const { error: sessionError } = await supabase
          .from('sessions')
          .update({ status: nextSessionStatus })
          .eq('course_id', courseRecord.id)
          .eq('module_slug', normalizedModule)
          .eq('number', sessionNumber)
          .neq('status', 'completed');
        if (sessionError) sessionWarning = ' The file is safe, but update the session status manually.';
      }

      setState('success');
      const audienceLabel = visibility === 'staff' ? ' Instructor-only access is enforced.' : '';
      const baseMessage = status === 'published'
        ? `Version ${version} published.${audienceLabel}`
        : `Version ${version} saved to the publishing workflow.${audienceLabel}`;
      setMessage(`${baseMessage}${sessionWarning}`);
      formRef.current?.reset();
      setPublishState('draft');
      setSelectedModule('general');
      setSelectedSession('');
      router.refresh();
      window.setTimeout(() => close(), 1500);
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error ? error.message : 'The upload could not be completed.');
    }
  }

  return (
    <>
      <button ref={triggerRef} className="button button--primary" type="button" onClick={() => setOpen(true)}><Icon name="upload" /> Add material</button>
      {open ? (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
          <div ref={dialogRef} className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="material-dialog-title" aria-describedby="material-dialog-description" aria-busy={busy}>
            <div className="admin-modal__header">
              <div><span className="eyebrow">Publishing workflow</span><h2 id="material-dialog-title">Add course material</h2><p id="material-dialog-description">Upload a new material or a new version of an existing session asset.</p></div>
              <button className="icon-button" type="button" onClick={close} disabled={busy} aria-label="Close"><Icon name="x" /></button>
            </div>
            <form ref={formRef} onSubmit={submit} className="admin-form">
              <div className="form-grid">
                <label className="form-field form-field--wide"><span>Title</span><input ref={titleRef} name="title" required maxLength={160} placeholder="e.g. Lecture 05 — Introduction to Regression" /></label>
                <label className="form-field form-field--wide"><span>Description</span><textarea name="description" rows={3} maxLength={500} placeholder="What students will find in this material" /></label>
                <label className="form-field"><span>Material type</span><select name="kind" defaultValue="slides"><option value="slides">Slides</option><option value="notes">Notes</option><option value="lab">Lab</option><option value="dataset">Dataset</option><option value="assignment">Assignment</option><option value="reference">Reference</option></select></label>
                <label className="form-field"><span>Module</span><select name="module_slug" value={selectedModule} onChange={(event) => { setSelectedModule(event.target.value); setSelectedSession(''); }}><option value="general">General course material</option>{modules.map((module) => <option value={module.slug} key={module.slug}>{module.title}</option>)}</select></label>
                <label className="form-field"><span>Lecture session</span><select name="session_number" value={selectedSession} disabled={selectedModule === 'general'} onChange={(event) => setSelectedSession(event.target.value)}><option value="">No specific lecture</option>{sessionOptions.map((lecture) => <option value={lecture.number} key={lecture.number}>L{String(lecture.number).padStart(2, '0')} — {lecture.title}</option>)}</select><small>{selectedModule === 'general' ? 'Choose a module before placing this against a lecture.' : 'Optional; the selected lecture is validated against its module.'}</small></label>
                <label className="form-field"><span>Audience</span><select name="visibility" defaultValue="public"><option value="public">Students (public library)</option><option value="staff">Instructor team only</option></select><small>Instructor-only files never enter the public material view, even when published.</small></label>
                <label className="form-field"><span>Status</span><select name="status" value={publishState} onChange={(event) => setPublishState(event.target.value as PublishState)}><option value="draft">Draft</option><option value="scheduled">Scheduled</option><option value="published">Publish now</option></select></label>
                {publishState === 'scheduled' ? <label className="form-field form-field--wide"><span>Publish date and time</span><input type="datetime-local" name="publish_at" required /><small>The file remains private until this time.</small></label> : null}
                <label className="upload-zone form-field--wide"><input type="file" name="file" required accept=".pdf,.pptx,.docx,.xlsx,.txt,.md,.zip,.csv" /><Icon name="upload" size={28} /><strong>Choose a file</strong><span>PDF, PPTX, DOCX, XLSX, CSV, Markdown, ZIP · maximum 50 MB</span></label>
              </div>
              {message ? <div className={state === 'error' ? 'form-error' : 'form-success'} role={state === 'error' ? 'alert' : 'status'}>{message}</div> : null}
              <div className="admin-modal__actions"><button className="button button--quiet" type="button" onClick={close} disabled={busy}>Cancel</button><button className="button button--primary" type="submit" disabled={busy}>{state === 'uploading' ? 'Uploading…' : state === 'saving' ? 'Saving…' : 'Save material'} <Icon name="arrow" /></button></div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

import { createReadStream, existsSync, statSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serverKey = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)?.trim();
if (!url || !serverKey) {
  console.error('✗ Supabase server variables are missing from .env.local.');
  process.exit(1);
}

const seedDir = resolve(process.env.PRIVATE_SEED_DIR || 'private_seed');
const required = [
  'ML_Course_Outline.pdf',
  'ML_Course_Plan_Aug-2026.docx',
  'Module1.pdf',
  'Module-2.pdf',
];
for (const fileName of required) {
  if (!existsSync(resolve(seedDir, fileName))) {
    throw new Error(`Private seed file is missing: ${resolve(seedDir, fileName)}`);
  }
}

const supabase = createClient(url, serverKey, {
  auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
});
const { data: course, error: courseError } = await supabase.from('courses').select('id').eq('code', 'DATA301').single();
if (courseError || !course) throw new Error(`DATA301 seed missing: ${courseError?.message ?? 'not found'}`);
const { data: admins, error: adminError } = await supabase.from('profiles').select('id').eq('role', 'admin').limit(1);
if (adminError || !admins?.length) throw new Error('No admin profile exists. Provision an administrator first.');
const createdBy = admins[0].id;

const assets = [
  {
    title: 'DATA301 Course Overview',
    description: 'Course logistics, outcomes, module overview, lab programmes, project expectations, and policy.',
    kind: 'reference',
    visibility: 'public',
    status: 'published',
    moduleSlug: null,
    sessionNumber: null,
    path: resolve(seedDir, 'ML_Course_Outline.pdf'),
    mime: 'application/pdf',
    format: 'PDF',
    thumbnailUrl: '/thumbnails/course-outline-cover.png',
    publishAt: '2026-08-03T00:00:00.000Z',
  },
  {
    title: 'Detailed Course Plan',
    description: 'The official 15-week lecture/practice schedule, pedagogy, outcomes, module takeaways, and references. Instructor access only.',
    kind: 'reference',
    visibility: 'staff',
    status: 'published',
    moduleSlug: null,
    sessionNumber: null,
    path: resolve(seedDir, 'ML_Course_Plan_Aug-2026.docx'),
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    format: 'DOCX',
    thumbnailUrl: null,
    publishAt: '2026-08-03T00:00:00.000Z',
  },
  {
    title: 'Module 1: Introduction to Machine Learning',
    description: 'AI foundations, learning paradigms, applications, data preparation, scaling, missing data, and categorical encoding.',
    kind: 'slides',
    visibility: 'public',
    status: 'published',
    moduleSlug: 'introduction-and-data',
    sessionNumber: 1,
    path: resolve(seedDir, 'Module1.pdf'),
    mime: 'application/pdf',
    format: 'PDF',
    thumbnailUrl: '/thumbnails/module1-cover.png',
    publishAt: '2026-08-04T00:00:00.000Z',
  },
  {
    title: 'Module 2: Supervised Learning Techniques and Evaluation Metrics',
    description: 'A 110-slide course presentation covering supervised learning, regression, gradient descent, evaluation metrics, classification, KNN, decision trees, and generalization.',
    kind: 'slides',
    visibility: 'public',
    status: 'published',
    moduleSlug: 'supervised-learning',
    sessionNumber: 5,
    path: resolve(seedDir, 'Module-2.pdf'),
    mime: 'application/pdf',
    format: 'PDF',
    thumbnailUrl: '/thumbnails/module2-cover.webp',
    publishAt: '2026-09-09T00:00:00.000Z',
  },
];

for (const asset of assets) {
  const fileName = basename(asset.path);
  const storagePath = `data301/course/${fileName}`;
  const size = statSync(asset.path).size;
  const chunks = [];
  for await (const chunk of createReadStream(asset.path)) chunks.push(chunk);
  const body = Buffer.concat(chunks);

  const { error: uploadError } = await supabase.storage.from('course-materials').upload(storagePath, body, {
    contentType: asset.mime,
    cacheControl: '3600',
    upsert: true,
  });
  if (uploadError) throw new Error(`Upload failed for ${fileName}: ${uploadError.message}`);

  const payload = {
    course_id: course.id,
    title: asset.title,
    description: asset.description,
    kind: asset.kind,
    visibility: asset.visibility,
    module_slug: asset.moduleSlug,
    session_number: asset.sessionNumber,
    status: asset.status,
    publish_at: asset.publishAt,
    storage_bucket: 'course-materials',
    storage_path: storagePath,
    file_name: fileName,
    file_size_bytes: size,
    mime_type: asset.mime,
    format: asset.format,
    version: 1,
    thumbnail_url: asset.thumbnailUrl,
    created_by: createdBy,
  };

  // Reconcile against the same logical identity enforced by
  // materials_series_version_unique, not merely storage_path. Older
  // production seeds may have used a different storage path while keeping
  // the same course/kind/title/module/session/version identity.
  let identityQuery = supabase
    .from('materials')
    .select('id,storage_path')
    .eq('course_id', course.id)
    .eq('kind', asset.kind)
    .eq('version', 1)
    .eq('title', asset.title);

  identityQuery = asset.moduleSlug === null
    ? identityQuery.is('module_slug', null)
    : identityQuery.eq('module_slug', asset.moduleSlug);
  identityQuery = asset.sessionNumber === null
    ? identityQuery.is('session_number', null)
    : identityQuery.eq('session_number', asset.sessionNumber);

  const { data: matches, error: findError } = await identityQuery.limit(2);
  if (findError) throw new Error(`Material lookup failed for ${fileName}: ${findError.message}`);
  if ((matches?.length ?? 0) > 1) {
    throw new Error(`Material identity is ambiguous for ${fileName}; expected at most one matching record.`);
  }

  let existing = matches?.[0] ?? null;
  if (!existing) {
    // Be tolerant of a historical title-casing difference. The database's
    // unique index uses lower(title), so this secondary lookup mirrors it.
    let caseInsensitiveQuery = supabase
      .from('materials')
      .select('id,storage_path,title')
      .eq('course_id', course.id)
      .eq('kind', asset.kind)
      .eq('version', 1)
      .ilike('title', asset.title);
    caseInsensitiveQuery = asset.moduleSlug === null
      ? caseInsensitiveQuery.is('module_slug', null)
      : caseInsensitiveQuery.eq('module_slug', asset.moduleSlug);
    caseInsensitiveQuery = asset.sessionNumber === null
      ? caseInsensitiveQuery.is('session_number', null)
      : caseInsensitiveQuery.eq('session_number', asset.sessionNumber);
    const { data: candidates, error: caseInsensitiveError } = await caseInsensitiveQuery.limit(10);
    if (caseInsensitiveError) {
      throw new Error(`Material lookup failed for ${fileName}: ${caseInsensitiveError.message}`);
    }
    existing = candidates?.find((candidate) =>
      candidate.title.trim().toLowerCase() === asset.title.trim().toLowerCase()
    ) ?? null;
  }

  let materialError;
  if (existing) {
    if (existing.storage_path !== storagePath) {
      const { data: pathOwner, error: pathOwnerError } = await supabase
        .from('materials')
        .select('id,title')
        .eq('storage_path', storagePath)
        .maybeSingle();
      if (pathOwnerError) {
        throw new Error(`Material storage-path lookup failed for ${fileName}: ${pathOwnerError.message}`);
      }
      if (pathOwner && pathOwner.id !== existing.id) {
        throw new Error(`Material storage path ${storagePath} is already owned by ${pathOwner.title}; refusing to overwrite another material.`);
      }
    }

    ({ error: materialError } = await supabase
      .from('materials')
      .update(payload)
      .eq('id', existing.id));
  } else {
    ({ error: materialError } = await supabase
      .from('materials')
      .insert(payload));

    // If another writer created the logically identical record between the
    // lookup and insert, reconcile it instead of failing the whole release.
    if (materialError?.code === '23505') {
      let retryQuery = supabase
        .from('materials')
        .select('id')
        .eq('course_id', course.id)
        .eq('kind', asset.kind)
        .eq('version', 1)
        .eq('title', asset.title);
      retryQuery = asset.moduleSlug === null
        ? retryQuery.is('module_slug', null)
        : retryQuery.eq('module_slug', asset.moduleSlug);
      retryQuery = asset.sessionNumber === null
        ? retryQuery.is('session_number', null)
        : retryQuery.eq('session_number', asset.sessionNumber);
      const { data: retryMatch, error: retryLookupError } = await retryQuery.maybeSingle();
      if (retryLookupError || !retryMatch) {
        throw new Error(`Material record failed for ${fileName}: ${materialError.message}`);
      }
      ({ error: materialError } = await supabase
        .from('materials')
        .update(payload)
        .eq('id', retryMatch.id));
    }
  }

  if (materialError) throw new Error(`Material record failed for ${fileName}: ${materialError.message}`);
  console.log(`✓ ${asset.title}${asset.visibility === 'staff' ? ' · instructor only' : ''}${existing ? ' · reconciled' : ''}`);
}

for (const session of [
  { moduleSlug: 'introduction-and-data', number: 1 },
  { moduleSlug: 'supervised-learning', number: 5 },
]) {
  const { error: sessionError } = await supabase
    .from('sessions')
    .update({ status: 'published' })
    .eq('course_id', course.id)
    .eq('module_slug', session.moduleSlug)
    .eq('number', session.number)
    .neq('status', 'completed');
  if (sessionError) throw new Error(`Lecture ${session.number} status could not be updated: ${sessionError.message}`);
}

console.log('\nCosmic course materials are stored privately. Course Overview, Module 1, and Module 2 are public through signed links; the Detailed Course Plan is instructor-only.');

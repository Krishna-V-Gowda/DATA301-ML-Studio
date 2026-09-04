import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
const serverKey = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)?.trim();

const checks = [];
function record(name, passed, detail) {
  checks.push({ name, passed, detail });
  console.log(`${passed ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`);
}
function failConfiguration(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

if (!url || !publishableKey || !serverKey) {
  failConfiguration('Supabase environment variables are incomplete. Check .env.local.');
}
if (!publishableKey.startsWith('sb_publishable_') && !publishableKey.startsWith('eyJ')) {
  failConfiguration('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not a recognized publishable/anon key.');
}
if (!serverKey.startsWith('sb_secret_') && !serverKey.startsWith('eyJ')) {
  failConfiguration('SUPABASE_SECRET_KEY is not a recognized secret/service-role key.');
}

const publicClient = createClient(url, publishableKey, {
  auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
});
const adminClient = createClient(url, serverKey, {
  auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
});

const { data: course, error: courseError } = await publicClient.from('courses').select('id,code,title').eq('code', 'DATA301').maybeSingle();
record('DATA301 course seed', !courseError && Boolean(course), courseError?.message || course?.title);

const { data: modules, error: moduleError } = await publicClient.from('modules').select('slug').eq('status', 'published');
record('Four published modules', !moduleError && modules?.length === 4, moduleError?.message || `${modules?.length ?? 0} found`);

const { count: sessionCount, error: sessionError } = await adminClient.from('sessions').select('*', { count: 'exact', head: true });
record('Thirty reference sessions', !sessionError && sessionCount === 30, sessionError?.message || `${sessionCount ?? 0} found`);

const { data: buckets, error: bucketError } = await adminClient.storage.listBuckets();
const materialBucket = buckets?.find((bucket) => bucket.id === 'course-materials');
record('Private course-materials bucket', !bucketError && Boolean(materialBucket) && materialBucket?.public === false, bucketError?.message || (materialBucket ? `public=${materialBucket.public}` : 'not found'));

const { data: profiles, error: profileError } = await adminClient.from('profiles').select('id,role').eq('role', 'admin');
record('At least one administrator', !profileError && Boolean(profiles?.length), profileError?.message || `${profiles?.length ?? 0} found`);

const { error: authError } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1 });
record('Privileged server key', !authError, authError?.message || 'accepted');

const { data: publishedMaterials, error: materialError } = await publicClient
  .from('materials_public')
  .select('id,title')
  .order('published_at', { ascending: false });
record('Published course materials', !materialError && (publishedMaterials?.length ?? 0) >= 3, materialError?.message || `${publishedMaterials?.length ?? 0} found`);

const { data: storedFiles, error: storageListError } = await adminClient.storage
  .from('course-materials')
  .list('data301/seed', { limit: 100 });
record('Seed files in private Storage', !storageListError && (storedFiles?.length ?? 0) >= 3, storageListError?.message || `${storedFiles?.length ?? 0} found`);

const { data: signedMaterial, error: signedMaterialError } = await adminClient
  .from('materials')
  .select('storage_bucket,storage_path,file_name')
  .eq('status', 'published')
  .not('storage_path', 'is', null)
  .limit(1)
  .maybeSingle();
let signedUrlError = signedMaterialError;
let signedUrl = '';
if (!signedUrlError && signedMaterial) {
  const result = await adminClient.storage
    .from(signedMaterial.storage_bucket)
    .createSignedUrl(signedMaterial.storage_path, 60, { download: signedMaterial.file_name });
  signedUrlError = result.error;
  signedUrl = result.data?.signedUrl ?? '';
}
record('Signed private download', !signedUrlError && /^https:\/\//.test(signedUrl), signedUrlError?.message || (signedUrl ? 'created' : 'no published material'));

const { data: lectureOne, error: lectureOneError } = await adminClient
  .from('sessions')
  .select('status')
  .eq('number', 1)
  .maybeSingle();
record('Lecture 1 publication state', !lectureOneError && ['published', 'completed'].includes(lectureOne?.status), lectureOneError?.message || lectureOne?.status || 'missing');

if (checks.some((check) => !check.passed)) {
  console.error('\nSupabase verification failed. Fix the items marked ✗ before deployment.');
  process.exit(1);
}

console.log('\nSupabase verification passed.');

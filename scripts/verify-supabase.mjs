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

if (!url || !publishableKey || !serverKey) failConfiguration('Supabase environment variables are incomplete. Check .env.local.');
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
record('Thirty official sessions', !sessionError && sessionCount === 30, sessionError?.message || `${sessionCount ?? 0} found`);

const { data: buckets, error: bucketError } = await adminClient.storage.listBuckets();
const materialBucket = buckets?.find((bucket) => bucket.id === 'course-materials');
record('Private course-materials bucket', !bucketError && Boolean(materialBucket) && materialBucket?.public === false, bucketError?.message || (materialBucket ? `public=${materialBucket.public}` : 'not found'));

const { data: users, error: userError } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 });
record('Privileged server key', !userError, userError?.message || 'accepted');
const instructorUser = users?.users.find((user) => user.email?.toLowerCase() === 'shabbeer.basha@vidyashilp.edu.in');
record('Instructor Auth account', !userError && Boolean(instructorUser), userError?.message || (instructorUser ? 'found' : 'missing'));

const { data: profiles, error: profileError } = await adminClient.from('profiles').select('id,display_name,role').eq('role', 'admin');
record('Administrator profiles', !profileError && (profiles?.length ?? 0) >= 2, profileError?.message || `${profiles?.length ?? 0} found`);
const instructorProfile = instructorUser ? profiles?.find((profile) => profile.id === instructorUser.id) : undefined;
record('Instructor admin role', Boolean(instructorProfile && instructorProfile.role === 'admin'), instructorProfile?.display_name || 'not verified');

const { data: publishedMaterials, error: materialError } = await publicClient
  .from('materials_public')
  .select('id,title,visibility')
  .order('published_at', { ascending: false });
record('Three public course materials', !materialError && (publishedMaterials?.length ?? 0) >= 3, materialError?.message || `${publishedMaterials?.length ?? 0} found`);
record('Module 2 is public', Boolean(publishedMaterials?.some((item) => item.title.startsWith('Module 2:'))), 'supervised-learning presentation');
record('Course Plan excluded from public view', !publishedMaterials?.some((item) => item.title === 'Detailed Course Plan'), 'not exposed');

const { data: coursePlan, error: coursePlanError } = await adminClient
  .from('materials')
  .select('id,status,visibility,storage_bucket,storage_path')
  .eq('title', 'Detailed Course Plan')
  .maybeSingle();
record('Course Plan retained privately', !coursePlanError && coursePlan?.visibility === 'staff', coursePlanError?.message || coursePlan?.visibility || 'missing');

const { data: storedFiles, error: storageListError } = await adminClient.storage
  .from('course-materials')
  .list('data301/course', { limit: 100 });
record('Four seed files in private Storage', !storageListError && (storedFiles?.length ?? 0) >= 4, storageListError?.message || `${storedFiles?.length ?? 0} found`);

const { data: signedMaterial, error: signedMaterialError } = await adminClient
  .from('materials')
  .select('storage_bucket,storage_path,file_name,mime_type')
  .eq('status', 'published')
  .eq('visibility', 'public')
  .not('storage_path', 'is', null)
  .limit(1)
  .maybeSingle();
let signedUrlError = signedMaterialError;
let signedUrl = '';
if (!signedUrlError && signedMaterial) {
  const result = await adminClient.storage
    .from(signedMaterial.storage_bucket)
    .createSignedUrl(signedMaterial.storage_path, 60, signedMaterial.mime_type === 'application/pdf' ? undefined : { download: signedMaterial.file_name });
  signedUrlError = result.error;
  signedUrl = result.data?.signedUrl ?? '';
}
record('Signed private delivery', !signedUrlError && /^https:\/\//.test(signedUrl), signedUrlError?.message || (signedUrl ? 'created' : 'no public material'));

for (const number of [1, 5]) {
  const { data: lecture, error: lectureError } = await adminClient.from('sessions').select('status').eq('number', number).maybeSingle();
  record(`Lecture ${number} publication state`, !lectureError && ['published', 'completed'].includes(lecture?.status), lectureError?.message || lecture?.status || 'missing');
}

if (checks.some((check) => !check.passed)) {
  console.error('\nSupabase verification failed. Fix the items marked ✗ before deployment.');
  process.exit(1);
}

console.log('\nSupabase cosmic verification passed.');

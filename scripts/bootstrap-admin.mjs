import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
const serverKey = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)?.trim();
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const displayName = process.env.ADMIN_DISPLAY_NAME?.trim() || 'Course administrator';

function fail(message) {
  console.error(`\n✗ ${message}`);
  process.exit(1);
}

if (!url) fail('NEXT_PUBLIC_SUPABASE_URL is missing from .env.local.');
if (!publishableKey) fail('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is missing from .env.local.');
if (!serverKey) fail('SUPABASE_SECRET_KEY is missing from .env.local.');
if (!serverKey.startsWith('sb_secret_') && !serverKey.startsWith('eyJ')) {
  fail('The server key is not recognized. Use the sb_secret_ key (preferred) or the legacy service-role JWT.');
}
if (!email || !email.includes('@')) fail('Enter a valid administrator email.');
if (!password || password.length < 12) fail('The administrator password must contain at least 12 characters.');
if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
  fail('The administrator password must include uppercase, lowercase, a number, and a symbol.');
}

const supabase = createClient(url, serverKey, {
  auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
});

const { data: listed, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
if (listError) fail(`Supabase rejected the server key: ${listError.message}`);

let user = listed.users.find((candidate) => candidate.email?.toLowerCase() === email);
if (user) {
  const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
    password,
    email_confirm: true,
    user_metadata: { ...user.user_metadata, display_name: displayName },
  });
  if (error || !data.user) fail(`Could not update the administrator: ${error?.message ?? 'unknown error'}`);
  user = data.user;
} else {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name: displayName },
  });
  if (error || !data.user) fail(`Could not create the administrator: ${error?.message ?? 'unknown error'}`);
  user = data.user;
}

const { error: profileError } = await supabase.from('profiles').upsert({
  id: user.id,
  display_name: displayName,
  role: 'admin',
  updated_at: new Date().toISOString(),
}, { onConflict: 'id' });
if (profileError) fail(`The Auth user exists, but the admin profile could not be saved: ${profileError.message}`);

// Prove that the exact credentials can perform a normal public-client sign-in.
const loginClient = createClient(url, publishableKey, {
  auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
});
const { data: loginData, error: loginError } = await loginClient.auth.signInWithPassword({ email, password });
if (loginError || !loginData.user) {
  fail(`The administrator was saved, but password sign-in failed: ${loginError?.message ?? 'unknown error'}`);
}
const { data: verifiedProfile, error: verifiedProfileError } = await loginClient
  .from('profiles')
  .select('role')
  .eq('id', loginData.user.id)
  .maybeSingle();
if (verifiedProfileError || verifiedProfile?.role !== 'admin') {
  fail(`Password sign-in succeeded, but the admin role could not be verified: ${verifiedProfileError?.message ?? verifiedProfile?.role ?? 'missing profile'}`);
}

// Verify the exact permissions used by the real instructor workflow, then clean up.
const { data: course, error: courseError } = await loginClient
  .from('courses')
  .select('id')
  .eq('code', 'DATA301')
  .maybeSingle();
if (courseError || !course) {
  fail(`Administrator sign-in works, but DATA301 cannot be read through RLS: ${courseError?.message ?? 'course missing'}`);
}

const probeId = randomUUID();
const probePath = `data301/health/admin-write-${probeId}.txt`;
const probeBody = Buffer.from('DATA301 administrator permission probe\n', 'utf8');
let probeMaterialId = '';
try {
  const { error: uploadError } = await loginClient.storage
    .from('course-materials')
    .upload(probePath, probeBody, { contentType: 'text/plain', upsert: false });
  if (uploadError) {
    fail(`Administrator sign-in works, but private Storage upload is blocked: ${uploadError.message}. Re-run the packaged supabase/schema.sql in the Supabase SQL editor.`);
  }

  const { data: probeMaterial, error: insertError } = await loginClient
    .from('materials')
    .insert({
      course_id: course.id,
      title: `Release permission probe ${probeId}`,
      description: 'Temporary record created and removed by the release gate.',
      kind: 'reference',
      status: 'draft',
      storage_bucket: 'course-materials',
      storage_path: probePath,
      file_name: 'admin-permission-probe.txt',
      file_size_bytes: probeBody.length,
      mime_type: 'text/plain',
      format: 'TXT',
      version: 1,
      created_by: loginData.user.id,
    })
    .select('id')
    .single();
  if (insertError || !probeMaterial) {
    fail(`Administrator sign-in works, but material creation is blocked: ${insertError?.message ?? 'record missing'}. Re-run the packaged supabase/schema.sql in the Supabase SQL editor.`);
  }
  probeMaterialId = probeMaterial.id;

  const { error: deleteError } = await loginClient.from('materials').delete().eq('id', probeMaterialId);
  if (deleteError) fail(`Administrator material deletion is blocked: ${deleteError.message}`);
  probeMaterialId = '';

  const { error: removeError } = await loginClient.storage.from('course-materials').remove([probePath]);
  if (removeError) fail(`Administrator Storage cleanup is blocked: ${removeError.message}`);
} finally {
  if (probeMaterialId) await loginClient.from('materials').delete().eq('id', probeMaterialId);
  await loginClient.storage.from('course-materials').remove([probePath]);
}

await loginClient.auth.signOut();

console.log('\n✓ Administrator account is ready; password sign-in, RLS writes, and private upload permissions were verified.');
console.log(`  Email: ${email}`);
console.log(`  Role: admin`);
console.log('  Password: updated securely (not displayed)');

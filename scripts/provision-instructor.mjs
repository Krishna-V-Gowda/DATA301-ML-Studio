import { chmod, writeFile } from 'node:fs/promises';
import { randomBytes, randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
const serverKey = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)?.trim();
const email = (process.env.INSTRUCTOR_EMAIL || 'shabbeer.basha@vidyashilp.edu.in').trim().toLowerCase();
const displayName = (process.env.INSTRUCTOR_DISPLAY_NAME || 'Dr. Shabbeer Basha').trim();
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://data301-ml-studio.vercel.app').replace(/\/$/, '');
const handoffPath = resolve(process.env.INSTRUCTOR_HANDOFF_PATH || 'PRIVATE_SHABBEER_HANDOFF.txt');
const emailDraftPath = resolve(process.env.INSTRUCTOR_EMAIL_DRAFT_PATH || 'PROFESSOR_HANDOFF_EMAIL.md');

function fail(message) {
  console.error(`\n✗ ${message}`);
  process.exit(1);
}

if (!url || !publishableKey || !serverKey) fail('Supabase environment variables are incomplete.');
if (!serverKey.startsWith('sb_secret_') && !serverKey.startsWith('eyJ')) fail('Use a valid Supabase secret/service-role key.');

function generatePassword() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  const pick = (chars, count) => Array.from(randomBytes(count), (byte) => chars[byte % chars.length]).join('');
  const core = pick(alphabet, 12);
  const required = `${pick('ABCDEFGHJKLMNPQRSTUVWXYZ', 2)}${pick('abcdefghijkmnopqrstuvwxyz', 2)}${pick('23456789', 2)}!@`;
  return `${core.slice(0, 6)}-${required.slice(0, 4)}-${core.slice(6)}${required.slice(4)}`;
}

const password = process.env.INSTRUCTOR_TEMP_PASSWORD || generatePassword();
if (password.length < 12) fail('Temporary instructor password must contain at least 12 characters.');

const admin = createClient(url, serverKey, {
  auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
});
const { data: listed, error: listError } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
if (listError) fail(`Supabase rejected the server key: ${listError.message}`);

let user = listed.users.find((candidate) => candidate.email?.toLowerCase() === email);
if (user) {
  const { data, error } = await admin.auth.admin.updateUserById(user.id, {
    password,
    email_confirm: true,
    user_metadata: {
      ...user.user_metadata,
      display_name: displayName,
      must_change_password: true,
      provisioned_by: 'DATA301 cosmic release',
    },
  });
  if (error || !data.user) fail(`Could not update the instructor account: ${error?.message ?? 'unknown error'}`);
  user = data.user;
} else {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      display_name: displayName,
      must_change_password: true,
      provisioned_by: 'DATA301 cosmic release',
    },
  });
  if (error || !data.user) fail(`Could not create the instructor account: ${error?.message ?? 'unknown error'}`);
  user = data.user;
}

const { error: profileError } = await admin.from('profiles').upsert({
  id: user.id,
  display_name: displayName,
  role: 'admin',
  updated_at: new Date().toISOString(),
}, { onConflict: 'id' });
if (profileError) fail(`Instructor Auth account exists, but its admin profile could not be saved: ${profileError.message}`);

const login = createClient(url, publishableKey, {
  auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
});
const { data: loginData, error: loginError } = await login.auth.signInWithPassword({ email, password });
if (loginError || !loginData.user) fail(`Instructor password sign-in failed: ${loginError?.message ?? 'unknown error'}`);
const { data: profile, error: profileReadError } = await login.from('profiles').select('role').eq('id', loginData.user.id).maybeSingle();
if (profileReadError || profile?.role !== 'admin') fail(`Instructor admin role verification failed: ${profileReadError?.message ?? profile?.role ?? 'missing profile'}`);

const { data: course, error: courseError } = await login.from('courses').select('id').eq('code', 'DATA301').maybeSingle();
if (courseError || !course) fail(`Instructor cannot read DATA301 through RLS: ${courseError?.message ?? 'course missing'}`);

const probeId = randomUUID();
const probePath = `data301/health/instructor-${probeId}.txt`;
const probeBody = Buffer.from('DATA301 instructor permission probe\n', 'utf8');
let probeMaterialId = '';
try {
  const { error: uploadError } = await login.storage.from('course-materials').upload(probePath, probeBody, {
    contentType: 'text/plain',
    upsert: false,
  });
  if (uploadError) fail(`Instructor private Storage upload is blocked: ${uploadError.message}`);

  const { data: probeMaterial, error: insertError } = await login.from('materials').insert({
    course_id: course.id,
    title: `Instructor permission probe ${probeId}`,
    description: 'Temporary release-gate record.',
    kind: 'reference',
    status: 'draft',
    visibility: 'staff',
    storage_bucket: 'course-materials',
    storage_path: probePath,
    file_name: 'instructor-permission-probe.txt',
    file_size_bytes: probeBody.length,
    mime_type: 'text/plain',
    format: 'TXT',
    version: 1,
    created_by: loginData.user.id,
  }).select('id').single();
  if (insertError || !probeMaterial) fail(`Instructor material creation is blocked: ${insertError?.message ?? 'record missing'}`);
  probeMaterialId = probeMaterial.id;

  const { error: deleteError } = await login.from('materials').delete().eq('id', probeMaterialId);
  if (deleteError) fail(`Instructor material deletion is blocked: ${deleteError.message}`);
  probeMaterialId = '';

  const { error: removeError } = await login.storage.from('course-materials').remove([probePath]);
  if (removeError) fail(`Instructor Storage cleanup is blocked: ${removeError.message}`);
} finally {
  if (probeMaterialId) await login.from('materials').delete().eq('id', probeMaterialId);
  await login.storage.from('course-materials').remove([probePath]);
  await login.auth.signOut();
}

const timestamp = new Date().toISOString();
const handoff = `DATA301 MACHINE LEARNING STUDIO — PRIVATE INSTRUCTOR HANDOFF\n\nInstructor: ${displayName}\nEmail: ${email}\nTemporary password: ${password}\nLogin: ${siteUrl}/admin/login\nGenerated: ${timestamp}\n\nIMPORTANT\n1. Send this credential only to the named instructor.\n2. Ask the instructor to sign in and change the password immediately under Admin → Settings.\n3. Do not commit, upload, screenshot, or forward this file elsewhere.\n4. Delete this file after the handoff is confirmed.\n`;
const emailDraft = `# Email to Shabbeer Sir\n\n**Subject:** DATA301 Machine Learning Studio — Instructor Access and Module 2 Update\n\nDear Sir,\n\nAs discussed, the DATA301 Machine Learning Studio has been upgraded with the Module 2 supervised-learning presentation, a course-overview-first experience, connected interactive labs, and the course ML Lab repository. The detailed course plan is retained privately within the instructor portal.\n\nWebsite: ${siteUrl}\nInstructor portal: ${siteUrl}/admin/login\nEmail: ${email}\nTemporary password: ${password}\n\nPlease change the temporary password after your first sign-in through **Admin → Settings**.\n\nRegards,\nKrishna V Gowda\nAcademic Assistant — DATA301\n`;

await writeFile(handoffPath, handoff, { mode: 0o600 });
await writeFile(emailDraftPath, emailDraft, { mode: 0o600 });
await chmod(handoffPath, 0o600);
await chmod(emailDraftPath, 0o600);

console.log('\n✓ Instructor account provisioned and verified end to end.');
console.log(`  Email: ${email}`);
console.log('  Role: admin');
console.log('  Password: written only to the private handoff files');
console.log(`  Handoff: ${handoffPath}`);
console.log(`  Email draft: ${emailDraftPath}`);

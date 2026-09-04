import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { course, materials, modules, outcomes } from '../lib/course-data.ts';
import { topics } from '../lib/topic-data.ts';
import { labs } from '../lib/labs-data.ts';
import { buildSearchDocuments } from '../lib/search-index.ts';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = resolve(projectRoot, 'public');

const unique = (values) => new Set(values).size === values.length;

test('reference course structure remains internally consistent', () => {
  assert.equal(course.code, 'DATA301');
  assert.equal(course.durationWeeks, 15);
  assert.equal(course.lectureHours, 30);
  assert.equal(course.practiceHours, 60);
  assert.equal(course.credits, 4);
  assert.equal(modules.length, 4);
  assert.equal(outcomes.length, 4);
  assert.equal(modules.reduce((sum, module) => sum + module.lectureSessions, 0), 30);
  assert.equal(modules.reduce((sum, module) => sum + module.practiceSessions, 0), 30);
  assert.equal(modules.reduce((sum, module) => sum + module.lectureHours, 0), 30);
  assert.equal(modules.reduce((sum, module) => sum + module.practiceHours, 0), 60);
});

test('the lecture sequence contains exactly one session for each number from 1 through 30', () => {
  const sessions = modules.flatMap((module) =>
    module.lectures.map((lecture) => ({ ...lecture, moduleSlug: module.slug })),
  );
  const numbers = sessions.map((session) => session.number).sort((a, b) => a - b);

  assert.equal(sessions.length, 30);
  assert.ok(unique(numbers));
  assert.deepEqual(numbers, Array.from({ length: 30 }, (_, index) => index + 1));
  assert.ok(sessions.every((session) => session.title.trim().length > 0));
});

test('module, outcome, topic, and material identifiers are unique and linked to valid modules', () => {
  const moduleSlugs = modules.map((module) => module.slug);
  const topicSlugs = topics.map((topic) => topic.slug);
  const materialIds = materials.map((material) => material.id);
  const outcomeCodes = outcomes.map((outcome) => outcome.code);

  assert.ok(unique(moduleSlugs));
  assert.ok(unique(topicSlugs));
  assert.ok(unique(materialIds));
  assert.ok(unique(outcomeCodes));
  assert.equal(topics.length, 11);
  assert.ok(topics.every((topic) => moduleSlugs.includes(topic.moduleSlug)));
  assert.ok(modules.every((module) => module.outcomes.every((code) => outcomeCodes.includes(code))));
});

test('packaged public materials and thumbnails exist', () => {
  for (const material of materials) {
    assert.ok(material.href.startsWith('/materials/'));
    assert.ok(existsSync(resolve(publicRoot, material.href.slice(1))), material.href);
    if (material.thumbnail) {
      assert.ok(existsSync(resolve(publicRoot, material.thumbnail.slice(1))), material.thumbnail);
    }
  }
});

test('the application exposes every implemented core route', () => {
  const requiredFiles = [
    'app/(site)/page.tsx',
    'app/(site)/learn/page.tsx',
    'app/(site)/learn/module/[slug]/page.tsx',
    'app/(site)/topics/[slug]/page.tsx',
    'app/(site)/labs/page.tsx',
    'app/(site)/labs/linear-regression/page.tsx',
    'app/(site)/labs/knn/page.tsx',
    'app/(site)/labs/kmeans/page.tsx',
    'app/(site)/labs/confusion-matrix/page.tsx',
    'app/(site)/labs/logistic-regression/page.tsx',
    'app/(site)/labs/gradient-descent/page.tsx',
    'app/(site)/labs/pca/page.tsx',
    'app/(site)/labs/overfitting/page.tsx',
    'app/(site)/labs/decision-tree/page.tsx',
    'app/(site)/labs/svm/page.tsx',
    'app/(site)/labs/roc-pr/page.tsx',
    'app/(site)/labs/ensemble/page.tsx',
    'app/(site)/resources/page.tsx',
    'app/(site)/projects/page.tsx',
    'app/(site)/search/page.tsx',
    'app/(site)/about/page.tsx',
    'app/admin/login/page.tsx',
    'app/admin/forgot-password/page.tsx',
    'app/admin/reset-password/page.tsx',
    'app/admin/(protected)/page.tsx',
    'app/admin/(protected)/materials/page.tsx',
    'app/admin/(protected)/sessions/page.tsx',
    'app/admin/(protected)/review/page.tsx',
    'app/admin/(protected)/settings/page.tsx',
    'app/admin/(protected)/error.tsx',
    'app/error.tsx',
    'app/global-error.tsx',
    'app/loading.tsx',
    'components/admin/ChangePasswordForm.tsx',
  ];

  for (const file of requiredFiles) {
    assert.ok(existsSync(resolve(projectRoot, file)), file);
  }
});

test('Supabase seed contains all 30 session records and the private storage bucket', () => {
  const sql = readFileSync(resolve(projectRoot, 'supabase/schema.sql'), 'utf8');
  const seedSection = sql.slice(sql.indexOf('insert into public.sessions'));
  const sessionRows = [...seedSection.matchAll(/^\s*\('[^']+',\s*(\d+),/gm)].map((match) => Number(match[1]));

  assert.deepEqual(sessionRows, Array.from({ length: 30 }, (_, index) => index + 1));
  assert.match(sql, /'course-materials',\s*'course-materials',\s*false/);
  assert.match(sql, /create policy course_materials_staff_insert/);
  assert.match(sql, /status in \('published', 'scheduled'\)/);
  assert.match(sql, /materials_session_fk foreign key \(course_id, session_number, module_slug\)/);
  assert.match(sql, /materials_session_requires_module/);
  assert.match(sql, /with \(security_invoker = true\)/);
  assert.match(sql, /grant select on public\.courses, public\.modules, public\.sessions, public\.materials to anon, authenticated/);
});


test('the Labs directory exposes twelve live labs and no planned cards', () => {
  const labsPage = readFileSync(resolve(projectRoot, 'app/(site)/labs/page.tsx'), 'utf8');
  const liveRoutes = labs.map((lab) => lab.href);
  assert.equal(liveRoutes.length, 12);
  assert.ok(unique(liveRoutes));
  assert.ok(labs.every((lab) => lab.title && lab.description && lab.tags.length >= 3));
  assert.doesNotMatch(labsPage, /planned/i);
});

test('course search indexes every released interactive lab', () => {
  const documents = buildSearchDocuments();
  const indexedLabs = documents.filter((document) => document.type === 'Lab');
  assert.equal(indexedLabs.length, labs.length);
  assert.deepEqual(
    indexedLabs.map((document) => document.href).sort(),
    labs.map((lab) => lab.href).sort(),
  );
});

test('production helper scripts and server-key safeguards are packaged', () => {
  for (const file of [
    'scripts/bootstrap-admin.sh',
    'scripts/bootstrap-admin.mjs',
    'scripts/verify-supabase.mjs',
    'scripts/deploy-vercel.sh',
    'scripts/normalize-env.mjs',
    'scripts/smoke-live.mjs',
  ]) {
    assert.ok(existsSync(resolve(projectRoot, file)), file);
  }
  const envExample = readFileSync(resolve(projectRoot, '.env.example'), 'utf8');
  assert.match(envExample, /SUPABASE_SECRET_KEY=sb_secret_/);
  assert.doesNotMatch(envExample, /sb_secret_[A-Za-z0-9_-]{20,}/);
  const publicConfig = readFileSync(resolve(projectRoot, 'lib/supabase/config.ts'), 'utf8');
  assert.doesNotMatch(publicConfig, /SUPABASE_SECRET_KEY|SUPABASE_SERVICE_ROLE_KEY/);
  const vercelIgnore = readFileSync(resolve(projectRoot, '.vercelignore'), 'utf8');
  assert.match(vercelIgnore, /public\/materials\//);
  const queries = readFileSync(resolve(projectRoot, 'lib/supabase/queries.ts'), 'utf8');
  assert.match(queries, /process\.env\.VERCEL \? databaseMaterials/);
  const deployScript = readFileSync(resolve(projectRoot, 'scripts/deploy-vercel.sh'), 'utf8');
  assert.match(deployScript, /--sensitive/);
  assert.match(deployScript, /--archive=tgz/);
  assert.match(deployScript, /autoExposeSystemEnvs=true/);
  assert.match(deployScript, /scripts\/smoke-live\.mjs/);
  const bootstrapAdmin = readFileSync(resolve(projectRoot, 'scripts/bootstrap-admin.mjs'), 'utf8');
  assert.match(bootstrapAdmin, /private Storage upload is blocked/);
  assert.match(bootstrapAdmin, /Release permission probe/);
  const smokeLive = readFileSync(resolve(projectRoot, 'scripts/smoke-live.mjs'), 'utf8');
  assert.match(smokeLive, /no localhost URL/);
  const packageJson = JSON.parse(readFileSync(resolve(projectRoot, 'package.json'), 'utf8'));
  assert.match(packageJson.scripts['smoke:live'], /smoke-live\.mjs/);
});


test('public release excludes institution-specific binaries and private handoff files', () => {
  for (const removed of [
    'PROFESSOR_EMAIL.md',
    'PROFESSOR_WALKTHROUGH.md',
    'START_HERE_TOMORROW.md',
    'public/brand/vidyashilp-university.png',
    'public/materials/ML_Course_Outline.pdf',
    'public/materials/ML_Course_Plan_Aug-2026.docx',
    'public/materials/Module1.pdf',
  ]) assert.equal(existsSync(resolve(projectRoot, removed)), false, removed);
  assert.ok(existsSync(resolve(projectRoot, 'public/brand/data301-studio.svg')));
});

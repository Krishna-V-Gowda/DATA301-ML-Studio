import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { course, materials, modules, outcomes } from '../lib/course-data.ts';
import { topics } from '../lib/topic-data.ts';
import { labs } from '../lib/labs-data.ts';
import { buildSearchDocuments } from '../lib/search-index.ts';
import { module2Chapters, platform } from '../lib/platform.ts';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = resolve(projectRoot, 'public');
const unique = (values) => new Set(values).size === values.length;

function source(file) {
  return readFileSync(resolve(projectRoot, file), 'utf8');
}

test('official DATA301 course structure remains internally consistent', () => {
  assert.equal(course.code, 'DATA301');
  assert.equal(course.durationWeeks, 15);
  assert.equal(course.lectureHours, 30);
  assert.equal(course.practiceHours, 60);
  assert.equal(course.credits, 4);
  assert.equal(course.ltp, '2:0:4');
  assert.equal(modules.length, 4);
  assert.equal(outcomes.length, 4);
  assert.equal(modules.reduce((sum, module) => sum + module.lectureSessions, 0), 30);
  assert.equal(modules.reduce((sum, module) => sum + module.practiceSessions, 0), 30);
  assert.equal(modules.reduce((sum, module) => sum + module.lectureHours, 0), 30);
  assert.equal(modules.reduce((sum, module) => sum + module.practiceHours, 0), 60);
});

test('the lecture sequence contains exactly one session for each number from 1 through 30', () => {
  const sessions = modules.flatMap((module) => module.lectures.map((lecture) => ({ ...lecture, moduleSlug: module.slug })));
  const numbers = sessions.map((session) => session.number).sort((a, b) => a - b);

  assert.equal(sessions.length, 30);
  assert.ok(unique(numbers));
  assert.deepEqual(numbers, Array.from({ length: 30 }, (_, index) => index + 1));
  assert.ok(sessions.every((session) => session.title.trim().length > 0));
});

test('module, outcome, topic, and fallback-material identifiers are unique and valid', () => {
  const moduleSlugs = modules.map((module) => module.slug);
  const topicSlugs = topics.map((topic) => topic.slug);
  const materialIds = materials.map((material) => material.id);
  const outcomeCodes = outcomes.map((outcome) => outcome.code);

  assert.ok(unique(moduleSlugs));
  assert.ok(unique(topicSlugs));
  assert.ok(unique(materialIds));
  assert.ok(unique(outcomeCodes));
  assert.equal(topics.length, 19);
  assert.ok(topics.every((topic) => moduleSlugs.includes(topic.moduleSlug)));
  assert.ok(modules.every((module) => module.outcomes.every((code) => outcomeCodes.includes(code))));
});

test('Module 2 is represented by evidence-based chapters, topics, and ten connected labs', () => {
  const supervised = modules.find((module) => module.slug === 'supervised-learning');
  assert.ok(supervised);
  assert.equal(supervised.lectureSessions, 12);
  assert.equal(supervised.lectures.at(0)?.number, 5);
  assert.equal(supervised.lectures.at(-1)?.number, 16);
  assert.deepEqual(module2Chapters.map((chapter) => chapter.slideRange), [
    'Slides 4-5',
    'Slides 6-38',
    'Slides 39-106',
    'Slides 107-110',
  ]);

  const module2Topics = topics.filter((topic) => topic.moduleSlug === 'supervised-learning');
  assert.ok(module2Topics.length >= 8);
  for (const slug of [
    'supervised-learning',
    'gradient-descent',
    'multiple-linear-regression',
    'regression-metrics',
    'logistic-regression',
    'class-imbalance',
    'decision-trees',
    'bias-variance',
  ]) {
    assert.ok(module2Topics.some((topic) => topic.slug === slug), slug);
  }

  const modulePage = source('app/(site)/learn/module/[slug]/page.tsx');
  assert.match(modulePage, /linear-regression.*gradient-descent.*logistic-regression.*knn.*decision-tree.*svm.*confusion-matrix.*roc-pr.*ensemble.*overfitting/s);
  assert.match(modulePage, /CourseLabRepository compact/);
});

test('packaged public fallback materials and all visual assets exist', () => {
  for (const material of materials) {
    assert.ok(material.href.startsWith('/resources/'));
    assert.ok(existsSync(resolve(publicRoot, material.href.slice(1))), material.href);
    if (material.thumbnail) assert.ok(existsSync(resolve(publicRoot, material.thumbnail.slice(1))), material.thumbnail);
  }

  for (const asset of [
    'brand/vidyashilp-university.png',
    'campus/vu-campus-hero.webp',
    'campus/vu-campus-building.webp',
    'campus/vu-campus-courtyard.webp',
    'campus/vu-campus-detail.webp',
    'campus/vu-campus-atmosphere.webp',
    'thumbnails/module2-cover.webp',
  ]) {
    assert.ok(existsSync(resolve(publicRoot, asset)), asset);
  }

  assert.equal(existsSync(resolve(publicRoot, 'materials')), false, 'private course binaries must not be packaged under public/');
});

test('the application exposes every production route including Course Overview and all labs', () => {
  const requiredFiles = [
    'app/(site)/page.tsx',
    'app/(site)/course/page.tsx',
    'app/(site)/learn/page.tsx',
    'app/(site)/learn/module/[slug]/page.tsx',
    'app/(site)/topics/[slug]/page.tsx',
    'app/(site)/labs/page.tsx',
    ...labs.map((lab) => `app/(site)${lab.href}/page.tsx`),
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
    'app/api/materials/[id]/route.ts',
    'app/api/admin/materials/[id]/route.ts',
  ];

  for (const file of requiredFiles) assert.ok(existsSync(resolve(projectRoot, file)), file);
});

test('Course Overview is the primary public entry and Krishna attribution is discreet but discoverable', () => {
  const header = source('components/SiteHeader.tsx');
  const home = source('app/(site)/page.tsx');
  const footer = source('components/SiteFooter.tsx');
  const about = source('app/(site)/about/page.tsx');

  assert.ok(header.indexOf("href: '/course'") < header.indexOf("href: '/learn'"));
  assert.ok(home.indexOf('<CourseOverviewPanel') < home.indexOf('<LearningRoadmap'));
  assert.match(footer, /Platform design &amp; development/);
  assert.match(footer, /platform\.developer\.name/);
  assert.match(about, /Platform development/);
  assert.equal(platform.developer.name, 'Krishna V Gowda');
  assert.equal(platform.developer.repository, 'https://github.com/Krishna-V-Gowda/DATA301-ML-Studio');
});

test('Shabbeer ML_lab is integrated as an external course-practice bridge, not a source transfer', () => {
  const repositoryBridge = source('components/CourseLabRepository.tsx');
  const labBridge = source('components/LabRepositoryBridge.tsx');
  assert.equal(platform.instructor.github, 'https://github.com/shabbeersh/ML_lab');
  assert.match(repositoryBridge, /Continue into implementation/);
  assert.match(repositoryBridge, /Python and Jupyter practice/);
  assert.match(repositoryBridge, /platform\.instructor\.github/);
  assert.match(labBridge, /Course implementation/);
  assert.doesNotMatch(repositoryBridge, /transfer|ownership|source code/i);
});

test('the professor-facing Labs directory exposes twelve live labs and no planned cards', () => {
  const labsPage = source('app/(site)/labs/page.tsx');
  const liveRoutes = labs.map((lab) => lab.href);
  assert.equal(liveRoutes.length, 12);
  assert.ok(unique(liveRoutes));
  assert.ok(labs.every((lab) => lab.title && lab.description && lab.tags.length >= 3));
  assert.doesNotMatch(labsPage, /planned/i);
});

test('course search indexes every released interactive lab and all Module 2 topics', () => {
  const documents = buildSearchDocuments();
  const indexedLabs = documents.filter((document) => document.type === 'Lab');
  assert.equal(indexedLabs.length, labs.length);
  assert.deepEqual(indexedLabs.map((document) => document.href).sort(), labs.map((lab) => lab.href).sort());

  for (const topic of topics.filter((item) => item.moduleSlug === 'supervised-learning')) {
    assert.ok(documents.some((document) => document.href === `/topics/${topic.slug}`), topic.slug);
  }
});

test('Supabase schema and migration enforce private storage and explicit staff-only visibility', () => {
  const sql = source('supabase/schema.sql');
  const migration = source('supabase/migrations/202609090001_cosmic_v4.sql');
  const seedSection = sql.slice(sql.indexOf('insert into public.sessions'));
  const sessionRows = [...seedSection.matchAll(/^\s*\('[^']+',\s*(\d+),/gm)].map((match) => Number(match[1]));

  assert.deepEqual(sessionRows, Array.from({ length: 30 }, (_, index) => index + 1));
  assert.match(sql, /'course-materials',\s*'course-materials',\s*false/);
  assert.match(sql, /visibility text not null default 'public'/);
  assert.match(sql, /visibility = 'public'/);
  assert.match(sql, /create policy course_materials_staff_insert/);
  assert.match(sql, /materials_session_fk foreign key \(course_id, session_number, module_slug\)/);
  assert.match(sql, /with \(security_invoker = true\)/);
  assert.match(migration, /Detailed Course Plan/);
  assert.match(migration, /visibility = 'staff'/);
  assert.match(migration, /notify pgrst, 'reload schema'/);
});

test('private files are seeded outside the public repository and Module 2 is published', () => {
  const seed = source('scripts/seed-materials.mjs');
  const verify = source('scripts/verify-supabase.mjs');
  const gitignore = source('.gitignore');
  const vercelIgnore = source('.vercelignore');

  assert.match(seed, /PRIVATE_SEED_DIR/);
  assert.match(seed, /Module-2\.pdf/);
  assert.match(seed, /Detailed Course Plan/);
  assert.match(seed, /visibility: 'staff'/);
  assert.match(seed, /sessionNumber: 5/);
  assert.match(verify, /Course Plan excluded from public view/);
  assert.match(verify, /Instructor Auth account/);
  assert.match(gitignore, /private_seed/);
  assert.match(vercelIgnore, /private_seed/);
});

test('material seeding is idempotent against the database uniqueness key', () => {
  const seed = source('scripts/seed-materials.mjs');
  assert.match(seed, /eq\('course_id', course\.id\)/);
  assert.match(seed, /eq\('kind', asset\.kind\)/);
  assert.match(seed, /eq\('version', 1\)/);
  assert.match(seed, /module_slug/);
  assert.match(seed, /session_number/);
  assert.match(seed, /update\(payload\)/);
  assert.match(seed, /materialError\?\.code === '23505'/);
  assert.match(seed, /storage path .* is already owned by/);
  assert.match(seed, /select\('id,storage_path'\)/);
  assert.match(seed, /materials_series_version_unique/);
});

test('production helper scripts and server-key safeguards are packaged', () => {
  for (const file of [
    'scripts/provision-instructor.mjs',
    'scripts/verify-supabase.mjs',
    'scripts/seed-materials.mjs',
    'scripts/deploy-vercel.sh',
    'scripts/normalize-env.mjs',
    'scripts/smoke-live.mjs',
  ]) assert.ok(existsSync(resolve(projectRoot, file)), file);

  const envExample = source('.env.example');
  assert.match(envExample, /SUPABASE_SECRET_KEY=sb_secret_/);
  assert.doesNotMatch(envExample, /sb_secret_[A-Za-z0-9_-]{20,}/);
  const publicConfig = source('lib/supabase/config.ts');
  assert.doesNotMatch(publicConfig, /SUPABASE_SECRET_KEY|SUPABASE_SERVICE_ROLE_KEY/);
  const deployScript = source('scripts/deploy-vercel.sh');
  assert.match(deployScript, /--sensitive/);
  assert.match(deployScript, /scripts\/smoke-live\.mjs/);
  const provision = source('scripts/provision-instructor.mjs');
  assert.match(provision, /shabbeer\.basha@vidyashilp\.edu\.in/);
  assert.match(provision, /PRIVATE_SHABBEER_HANDOFF\.txt/);
  assert.doesNotMatch(provision, /console\.log\([^\n]*\$\{password\}/i);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

import { materials } from '../lib/course-data.ts';
import { buildSearchDocuments } from '../lib/search-index.ts';
import { searchDocuments } from '../lib/search-query.ts';
import {
  materialPrivacyPassed,
  originPayloadPassed,
  routeIdentityPassed,
  searchPayloadPassed,
} from '../scripts/smoke-contract.mjs';

const root = resolve(import.meta.dirname, '..');
const source = (file) => readFileSync(resolve(root, file), 'utf8');

test('semantic smoke contracts reject copy-only and malformed responses', () => {
  assert.equal(routeIdentityPassed({
    requestedPath: '/course',
    response: { ok: true },
    html: '<main><h1>Course</h1></main>',
  }), true);
  assert.equal(routeIdentityPassed({
    requestedPath: '/course',
    response: { ok: true },
    html: '<p>Know the course before you enter the models.</p>',
  }), false);
  assert.equal(searchPayloadPassed({
    count: 2,
    results: [
      { href: '/learn/module/supervised-learning', type: 'Module' },
      { href: '/topics/supervised-learning', type: 'Topic' },
    ],
  }), true);
  assert.equal(searchPayloadPassed({ count: 1, results: [] }), false);
  assert.equal(originPayloadPassed('https://course.example/sitemap.xml', 'https://course.example'), true);
  assert.equal(originPayloadPassed('http://localhost:3000/sitemap.xml', 'https://course.example'), false);
});

test('search query returns stable API-shaped results and honors type filters', () => {
  const documents = buildSearchDocuments(materials);
  const results = searchDocuments(documents, 'supervised learning');
  assert.ok(results.length > 0);
  assert.ok(results.some((item) => item.href === '/learn/module/supervised-learning'));
  assert.ok(results.some((item) => item.href === '/topics/supervised-learning'));
  assert.ok(results.every((item) => typeof item.id === 'string' && typeof item.type === 'string' && typeof item.score === 'number'));
  assert.ok(searchDocuments(documents, 'supervised learning', 'Lab').every((item) => item.type === 'Lab'));
});

test('material fallback contains exactly three public resources and no private plan', () => {
  assert.equal(materials.length, 3);
  assert.ok(materials.every((material) => material.status === 'published'));
  assert.ok(materials.every((material) => material.href.startsWith('/resources/')));
  assert.equal(materials.some((material) => /course plan/i.test(material.title)), false);
  assert.deepEqual(materials.map((material) => material.title), [
    'DATA301 Course Overview',
    'Module 1: Introduction to Machine Learning',
    'Module 2: Supervised Learning Techniques and Evaluation Metrics',
  ]);
});

test('public/private and release boundaries are explicit in source', () => {
  const publicMaterialRoute = source('app/api/materials/[id]/route.ts');
  const privateMaterialRoute = source('app/api/admin/materials/[id]/route.ts');
  const searchRoute = source('app/api/search/route.ts');
  const deployScript = source('scripts/deploy-vercel.sh');
  const seedScript = source('scripts/seed-materials.mjs');

  assert.match(publicMaterialRoute, /\.eq\('visibility', 'public'\)/);
  assert.match(publicMaterialRoute, /\.in\('status', \['published', 'scheduled'\]\)/);
  assert.match(publicMaterialRoute, /publish_at/);
  assert.match(privateMaterialRoute, /getStaffUser\(\)/);
  assert.match(searchRoute, /getPublishedMaterials\(\)/);
  assert.match(deployScript, /PROMOTE/);
  assert.match(deployScript, /vercel_cli promote/);
  assert.match(seedScript, /refusing to overwrite another material/);
  assert.match(seedScript, /orphan cleanup also failed/);
  assert.match(seedScript, /storageObjectExisted/);
});

test('private plan never passes the public material contract', () => {
  assert.equal(materialPrivacyPassed({
    publicHtml: '<main><a href="/api/materials/public-id">Course Overview</a></main>',
    publicRouteStatus: 404,
    coursePlanId: 'private-id',
  }), true);
  assert.equal(materialPrivacyPassed({
    publicHtml: '<main><a href="/api/materials/private-id">Course Plan</a></main>',
    publicRouteStatus: 307,
    coursePlanId: 'private-id',
  }), false);
});

test('site URL fails closed for production without a public canonical origin', () => {
  const result = spawnSync(process.execPath, [
    '--no-warnings',
    '--experimental-strip-types',
    '--input-type=module',
    '-e',
    "import { getSiteUrl } from './lib/site-url.ts'; console.log(getSiteUrl());",
  ], {
    cwd: root,
    env: { ...process.env, NODE_ENV: 'production', NEXT_PUBLIC_SITE_URL: 'http://localhost:3000', VERCEL: '1' },
    encoding: 'utf8',
  });
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, /localhost is not permitted/);
});
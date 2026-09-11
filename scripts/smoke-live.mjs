import { createClient } from '@supabase/supabase-js';
import { labs } from '../lib/labs-data.ts';
import { platform } from '../lib/platform.ts';
import {
  materialPrivacyPassed,
  normalizeSmokeBase,
  originPayloadPassed,
  routeIdentityPassed,
  searchPayloadPassed,
} from './smoke-contract.mjs';

const rawBase = process.argv[2]?.trim();
if (!rawBase) {
  console.error('Usage: npm run smoke:cosmic -- https://your-site.vercel.app');
  process.exit(1);
}

const base = normalizeSmokeBase(rawBase);
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const failures = [];

const topicPages = [
  ['/topics/supervised-learning', 'Supervised Learning'],
  ['/topics/gradient-descent', 'Gradient Descent'],
  ['/topics/multiple-linear-regression', 'Multiple Linear Regression'],
  ['/topics/regression-metrics', 'Regression Evaluation Metrics'],
  ['/topics/logistic-regression', 'Logistic Regression'],
  ['/topics/class-imbalance', 'Class Imbalance'],
  ['/topics/decision-trees', 'Decision Trees'],
  ['/topics/bias-variance', 'Bias and Variance'],
];

const pages = [
  { path: '/' },
  { path: '/course' },
  { path: '/learn' },
  { path: '/learn/module/introduction-and-data' },
  { path: '/learn/module/supervised-learning' },
  ...topicPages.map(([path]) => ({ path })),
  { path: '/labs' },
  ...labs.map((lab) => ({ path: lab.href })),
  { path: '/projects' },
  { path: '/resources' },
  { path: '/search' },
  { path: '/about' },
  { path: '/admin/login' },
  { path: '/admin/forgot-password' },
];

async function fetchWithRetry(url, options = {}) {
  let lastError;
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      const response = await fetch(url, options);
      if (response.status < 500 || attempt === 5) return response;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await wait(attempt * 1200);
  }
  throw lastError;
}

let homeHtml = '';
let labsHtml = '';
let resourcesHtml = '';
for (const page of pages) {
  const url = `${base}${page.path}`;
  try {
    const response = await fetchWithRetry(url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'DATA301-cosmic-v4-smoke-test' },
    });
    const html = await response.text();
    const passed = routeIdentityPassed({ requestedPath: page.path, response, html });
    console.log(`${passed ? '✓' : '✗'} ${page.path} — HTTP ${response.status}`);
    if (!passed) failures.push(`${page.path}: expected a successful response with a main landmark, route-consistent canonical URL, and heading`);
    if (page.path === '/') homeHtml = html;
    if (page.path === '/labs') labsHtml = html;
    if (page.path === '/resources') resourcesHtml = html;
  } catch (error) {
    console.log(`✗ ${page.path} — ${error instanceof Error ? error.message : 'request failed'}`);
    failures.push(`${page.path}: request failed`);
  }
}

const attributionPassed = homeHtml.includes('Platform design') && homeHtml.includes(platform.developer.name);
console.log(`${attributionPassed ? '✓' : '✗'} Developer attribution — discreet footer credit rendered`);
if (!attributionPassed) failures.push('homepage footer does not render Krishna V Gowda platform attribution');

const repoLinkPassed = labsHtml.includes(platform.instructor.github) && labsHtml.includes('Course ML Lab');
console.log(`${repoLinkPassed ? '✓' : '✗'} Instructor ML_lab bridge — external course repository linked`);
if (!repoLinkPassed) failures.push('Labs page does not render the instructor ML_lab repository bridge');

try {
  const response = await fetchWithRetry(`${base}/api/search?q=supervised%20learning`, {
    headers: { 'User-Agent': 'DATA301-cosmic-v4-smoke-test' },
  });
  const payload = await response.json();
  const passed = response.ok && searchPayloadPassed(payload);
  console.log(`${passed ? '✓' : '✗'} /api/search — Module 2 and its core concept indexed`);
  if (!passed) failures.push('/api/search: Module 2 results were incomplete');
} catch {
  console.log('✗ /api/search — request or JSON parsing failed');
  failures.push('/api/search failed');
}

for (const path of ['/robots.txt', '/sitemap.xml']) {
  try {
    const response = await fetchWithRetry(`${base}${path}`);
    const body = await response.text();
    const passed = response.ok && originPayloadPassed(body, base);
    console.log(`${passed ? '✓' : '✗'} ${path} — canonical origin ${passed ? 'present' : 'missing'}`);
    if (!passed) failures.push(`${path}: expected the requested canonical origin and no localhost URL`);
  } catch {
    console.log(`✗ ${path} — request failed`);
    failures.push(`${path}: request failed`);
  }
}

for (const asset of [
  '/campus/vu-campus-hero.webp',
  '/campus/vu-campus-building.webp',
  '/brand/vidyashilp-university.png',
  '/thumbnails/module2-cover.webp',
]) {
  try {
    const response = await fetchWithRetry(`${base}${asset}`, { method: 'HEAD' });
    const passed = response.ok && Number(response.headers.get('content-length') || 1) > 0;
    console.log(`${passed ? '✓' : '✗'} ${asset} — visual asset available`);
    if (!passed) failures.push(`${asset}: visual asset unavailable`);
  } catch {
    console.log(`✗ ${asset} — request failed`);
    failures.push(`${asset}: request failed`);
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serverKey = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)?.trim();
if (!url || !serverKey) {
  failures.push('Supabase server environment is unavailable to the live smoke test');
  console.log('✗ Material privacy proof — Supabase server environment missing');
} else {
  const admin = createClient(url, serverKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
  const { data: materialRows, error } = await admin
    .from('materials')
    .select('id,title,visibility,status,publish_at')
    .in('title', [
      'DATA301 Course Overview',
      'Detailed Course Plan',
      'Module 2: Supervised Learning Techniques and Evaluation Metrics',
    ]);

  if (error) {
    console.log(`✗ Material privacy proof — ${error.message}`);
    failures.push('could not query materials for live privacy proof');
  } else {
    const overview = materialRows?.find((item) => item.title === 'DATA301 Course Overview');
    const module2 = materialRows?.find((item) => item.title.startsWith('Module 2:'));
    const coursePlan = materialRows?.find((item) => item.title === 'Detailed Course Plan');

    const resourceOrderPassed = overview && module2
      && resourcesHtml.indexOf(`/api/materials/${overview.id}`) >= 0
      && resourcesHtml.indexOf(`/api/materials/${module2.id}`) >= 0
      && resourcesHtml.indexOf(`/api/materials/${overview.id}`) < resourcesHtml.indexOf(`/api/materials/${module2.id}`);
    console.log(`${resourceOrderPassed ? '✓' : '✗'} Resource order — Course Overview precedes Module 2`);
    if (!resourceOrderPassed) failures.push('Course Overview is not the first database-backed public material');

    if (!module2 || module2.visibility !== 'public') {
      console.log('✗ Module 2 material — missing or not public');
      failures.push('Module 2 public material record is missing');
    } else {
      try {
        const response = await fetchWithRetry(`${base}/api/materials/${module2.id}`, { redirect: 'manual' });
        const location = response.headers.get('location') ?? '';
        const passed = [302, 303, 307, 308].includes(response.status) && /^https:\/\//.test(location);
        console.log(`${passed ? '✓' : '✗'} Module 2 signed delivery — HTTP ${response.status}`);
        if (!passed) failures.push('Module 2 public material did not produce a secure signed redirect');
      } catch {
        console.log('✗ Module 2 signed delivery — request failed');
        failures.push('Module 2 signed material request failed');
      }
    }

    if (!coursePlan || coursePlan.visibility !== 'staff') {
      console.log('✗ Detailed Course Plan — staff-only record missing');
      failures.push('Detailed Course Plan is not marked staff-only');
    } else {
      let publicRouteStatus = 0;
      try {
        const response = await fetchWithRetry(`${base}/api/materials/${coursePlan.id}`, { redirect: 'manual' });
        publicRouteStatus = response.status;
      } catch {
        publicRouteStatus = 0;
      }
      const passed = materialPrivacyPassed({ publicHtml: resourcesHtml, publicRouteStatus, coursePlanId: coursePlan.id });
      console.log(`${passed ? '✓' : '✗'} Detailed Course Plan privacy — absent from public library and route blocked`);
      if (!passed) failures.push('Detailed Course Plan is exposed through the public material route');
    }
  }
}

if (failures.length) {
  console.error(`\nCosmic V4 live smoke test failed (${failures.length} issue(s)):`);
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}

console.log(`\n✓ Cosmic V4 live production smoke test passed for ${base}`);

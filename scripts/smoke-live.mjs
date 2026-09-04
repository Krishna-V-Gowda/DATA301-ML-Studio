import { labs } from '../lib/labs-data.ts';

const rawBase = process.argv[2]?.trim();
if (!rawBase) {
  console.error('Usage: npm run smoke:live -- https://your-site.vercel.app');
  process.exit(1);
}
const base = (/^https?:\/\//i.test(rawBase) ? rawBase : `https://${rawBase}`).replace(/\/$/, '');
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const pages = [
  { path: '/', marker: 'Don’t just learn the algorithm' },
  { path: '/learn', marker: 'Build the mental model in the right order.' },
  { path: '/learn/module/introduction-and-data', marker: 'Introduction to Machine Learning' },
  { path: '/topics/linear-regression', marker: 'Linear Regression' },
  { path: '/labs', marker: 'Change one thing. Watch the model respond.' },
  ...labs.map((lab) => ({ path: lab.href, marker: lab.title })),
  { path: '/projects', marker: 'Project' },
  { path: '/resources', marker: 'Resource library' },
  { path: '/search', marker: 'Find the concept behind the phrase.' },
  { path: '/about', marker: 'DATA301' },
  { path: '/admin/login', marker: 'Instructor sign in' },
  { path: '/admin/forgot-password', marker: 'Reset your password' },
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
    await wait(attempt * 1500);
  }
  throw lastError;
}

const failures = [];
let resourcesHtml = '';
for (const page of pages) {
  const url = `${base}${page.path}`;
  try {
    const response = await fetchWithRetry(url, { redirect: 'follow', headers: { 'User-Agent': 'DATA301-release-smoke-test' } });
    const html = await response.text();
    const passed = response.ok && html.includes(page.marker);
    console.log(`${passed ? '✓' : '✗'} ${page.path} — HTTP ${response.status}`);
    if (!passed) failures.push(`${page.path}: expected HTTP 2xx and marker “${page.marker}”`);
    if (page.path === '/resources') resourcesHtml = html;
  } catch (error) {
    console.log(`✗ ${page.path} — ${error instanceof Error ? error.message : 'request failed'}`);
    failures.push(`${page.path}: request failed`);
  }
}

try {
  const response = await fetchWithRetry(`${base}/api/search?q=support%20vector`, { headers: { 'User-Agent': 'DATA301-release-smoke-test' } });
  const payload = await response.json();
  const passed = response.ok && payload.count > 0 && payload.results?.some((item) => item.href === '/labs/svm');
  console.log(`${passed ? '✓' : '✗'} /api/search — support-vector lab indexed`);
  if (!passed) failures.push('/api/search: SVM lab was not returned');
} catch {
  console.log('✗ /api/search — request or JSON parsing failed');
  failures.push('/api/search failed');
}

for (const path of ['/robots.txt', '/sitemap.xml']) {
  try {
    const response = await fetchWithRetry(`${base}${path}`);
    const body = await response.text();
    const hasSecureOrigin = /https:\/\/[a-z0-9.-]+/i.test(body);
    const hasLocalhost = /https?:\/\/localhost(?::\d+)?/i.test(body);
    const passed = response.ok && hasSecureOrigin && !hasLocalhost;
    console.log(`${passed ? '✓' : '✗'} ${path} — HTTP ${response.status}, secure production origin ${hasSecureOrigin ? 'present' : 'missing'}`);
    if (!passed) {
      failures.push(`${path}: expected HTTP 2xx, a secure production origin, and no localhost URL`);
    }
  } catch {
    console.log(`✗ ${path} — request failed`);
    failures.push(`${path}: request failed`);
  }
}

const materialMatch = resourcesHtml.match(/\/api\/materials\/[0-9a-f-]{36}/i);
if (!materialMatch) {
  console.log('✗ Signed resource route — no published database material found');
  failures.push('resources: no signed material route found; run npm run setup:materials before deployment');
} else {
  try {
    const response = await fetchWithRetry(`${base}${materialMatch[0]}`, { redirect: 'manual' });
    const location = response.headers.get('location') ?? '';
    const passed = [302, 303, 307, 308].includes(response.status) && /^https:\/\//.test(location);
    console.log(`${passed ? '✓' : '✗'} Signed resource route — HTTP ${response.status}`);
    if (!passed) failures.push('signed material route did not return a secure redirect');
  } catch {
    console.log('✗ Signed resource route — request failed');
    failures.push('signed material route request failed');
  }
}

if (failures.length) {
  console.error('\nLive smoke test failed:');
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}

console.log(`\n✓ Live public smoke test passed for ${base}`);

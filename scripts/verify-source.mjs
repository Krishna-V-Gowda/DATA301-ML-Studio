import { lstat, readFile, readdir, stat } from 'node:fs/promises';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const notices = [];

function pass(message) {
  console.log(`✓ ${message}`);
}
function fail(message) {
  console.log(`✗ ${message}`);
  failures.push(message);
}

async function exists(path) {
  try {
    await stat(resolve(root, path));
    return true;
  } catch {
    return false;
  }
}

const required = [
  'app/(site)/page.tsx',
  'app/(site)/course/page.tsx',
  'app/(site)/learn/module/[slug]/page.tsx',
  'app/(site)/labs/page.tsx',
  'app/(site)/resources/page.tsx',
  'app/(site)/about/page.tsx',
  'app/api/materials/[id]/route.ts',
  'app/api/admin/materials/[id]/route.ts',
  'components/CosmicHero.tsx',
  'components/CourseOverviewPanel.tsx',
  'components/Module2Launchpad.tsx',
  'components/CourseLabRepository.tsx',
  'components/LabRepositoryBridge.tsx',
  'components/CampusStory.tsx',
  'lib/platform.ts',
  'lib/topic-data.ts',
  'scripts/provision-instructor.mjs',
  'scripts/apply-supabase-migrations.sh',
  'scripts/deploy-vercel.sh',
  'scripts/prepare-go-live.sh',
  'scripts/seed-materials.mjs',
  'scripts/verify-supabase.mjs',
  'scripts/smoke-live.mjs',
  'supabase/migrations/202608180001_initial_production.sql',
  'supabase/migrations/202609090001_cosmic_v4.sql',
  'public/brand/vidyashilp-university.png',
  'public/campus/vu-campus-hero.webp',
  'public/campus/vu-campus-building.webp',
  'public/campus/vu-campus-courtyard.webp',
  'public/campus/vu-campus-detail.webp',
  'public/campus/vu-campus-atmosphere.webp',
  'public/thumbnails/module2-cover.webp',
  'NOTICE.md',
  'CHANGELOG.md',
  'GITHUB_RELEASE_NOTES.md',
  'docs/ATTRIBUTION_AND_OWNERSHIP.md',
  '.github/workflows/ci.yml',
];

const missing = [];
for (const path of required) if (!(await exists(path))) missing.push(path);
if (missing.length) fail(`Required release files missing: ${missing.join(', ')}`);
else pass(`${required.length} required release files are present`);

const forbiddenExact = [
  'PRIVATE_SHABBEER_HANDOFF.txt',
  'PROFESSOR_HANDOFF_EMAIL.md',
  'LIVE_URL.txt',
];
const forbiddenPresent = [];
for (const path of forbiddenExact) if (await exists(path)) forbiddenPresent.push(path);
if (forbiddenPresent.length) fail(`Private/runtime files are present in source: ${forbiddenPresent.join(', ')}`);
else pass('No credential handoff or deployment-result file is packaged');

// .env.local is intentionally created in the local release workspace so the
// quality gate, Supabase provisioning, and deployment can run with the user's
// real credentials. It must remain ignored and untracked rather than being
// treated as a packaged source file.
if (await exists('.env.local')) {
  let tracked = false;
  let ignored = false;
  try {
    const { execFileSync } = await import('node:child_process');
    try { execFileSync('git', ['ls-files', '--error-unmatch', '.env.local'], { cwd: root, stdio: 'ignore' }); tracked = true; } catch {}
    try { execFileSync('git', ['check-ignore', '-q', '.env.local'], { cwd: root, stdio: 'ignore' }); ignored = true; } catch {}
  } catch {}
  if (tracked) fail('.env.local is tracked by Git; it must never be committed');
  else if (!ignored) fail('.env.local exists but is not protected by .gitignore');
  else pass('Local .env.local is present only as ignored, untracked runtime configuration');
} else {
  pass('No local .env.local is present in the packaged source');
}

if (await exists('public/materials')) fail('public/materials exists; private academic binaries must never be under public/');
else pass('No private academic binaries are exposed under public/');

const ignoredDirectories = new Set(['.git', '.next', '.vercel', 'node_modules', 'private_seed']);
const scanFiles = [];
let symlinkCount = 0;
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignoredDirectories.has(entry.name)) continue;
    const full = join(directory, entry.name);
    const info = await lstat(full);
    if (info.isSymbolicLink()) {
      symlinkCount += 1;
      continue;
    }
    if (entry.isDirectory()) await walk(full);
    else scanFiles.push(full);
  }
}
await walk(root);

if (symlinkCount) fail(`${symlinkCount} symbolic link(s) found; release source must be self-contained`);
else pass('Release source contains no symbolic links');

const privateBinaryExtensions = new Set(['.pdf', '.ppt', '.pptx', '.doc', '.docx', '.xls', '.xlsx']);
const privateBinaries = scanFiles
  .filter((file) => privateBinaryExtensions.has(extname(file).toLowerCase()))
  .map((file) => relative(root, file));
if (privateBinaries.length) fail(`Private/course binaries found in source: ${privateBinaries.join(', ')}`);
else pass('No PDF, PowerPoint, Word, or spreadsheet course binaries are packaged in source');

const textualExtensions = new Set(['.ts', '.tsx', '.js', '.mjs', '.cjs', '.json', '.md', '.txt', '.sql', '.sh', '.yml', '.yaml', '.toml', '.css']);
const secretPatterns = [
  { label: 'Supabase secret key', expression: /sb_secret_(?!YOUR_SECRET)[A-Za-z0-9_-]{20,}/g },
  { label: 'Supabase access token', expression: /sbp_[A-Za-z0-9_-]{20,}/g },
  { label: 'GitHub token', expression: /gh[pousr]_[A-Za-z0-9_]{30,}/g },
  { label: 'Vercel token assignment', expression: /VERCEL_TOKEN\s*=\s*[^\s$][^\n]{15,}/g },
  { label: 'Recovery/access token URL', expression: /(?:access_token|refresh_token)=[A-Za-z0-9._~-]{20,}/g },
];
const secretFindings = [];
for (const file of scanFiles) {
  if (!textualExtensions.has(extname(file).toLowerCase()) && !['.gitignore', '.vercelignore', '.env.example'].includes(basename(file))) continue;
  const text = await readFile(file, 'utf8');
  for (const pattern of secretPatterns) {
    if (pattern.expression.test(text)) secretFindings.push(`${relative(root, file)} (${pattern.label})`);
    pattern.expression.lastIndex = 0;
  }
}
if (secretFindings.length) fail(`Potential secret material detected: ${secretFindings.join(', ')}`);
else pass('Secret-pattern scan found no live Supabase, GitHub, Vercel, or recovery token');

const publicAssets = scanFiles.filter((file) => relative(root, file).startsWith(`public/`));
const oversized = [];
for (const file of publicAssets) {
  const info = await stat(file);
  if (info.size > 5 * 1024 * 1024) oversized.push(`${relative(root, file)} (${(info.size / 1024 / 1024).toFixed(1)} MB)`);
}
if (oversized.length) fail(`Oversized public asset(s): ${oversized.join(', ')}`);
else pass('Every public asset is under the 5 MB release ceiling');

const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
if (packageJson.version !== '4.0.0') fail(`package.json version is ${packageJson.version}; expected 4.0.0`);
else pass('Package version is 4.0.0');

const sourceChecks = [
  ['app/(site)/page.tsx', /<CourseOverviewPanel[\s\S]*<Module2Launchpad/, 'Course Overview precedes the Module 2 launchpad'],
  ['components/SiteFooter.tsx', /Platform design &amp; development[\s\S]*platform\.developer\.name/, 'Krishna attribution is present in the footer'],
  ['components/CourseLabRepository.tsx', /platform\.instructor\.github/, 'Instructor ML_lab repository is linked as an external course bridge'],
  ['app/api/materials/[id]/route.ts', /\.eq\('visibility', 'public'\)/, 'Public material route enforces public visibility'],
  ['app/api/admin/materials/[id]/route.ts', /getStaffUser\(\)/, 'Private material route requires a staff session'],
  ['scripts/seed-materials.mjs', /Module-2\.pdf[\s\S]*visibility: 'public'/, 'Module 2 is configured for private-storage/public-signed delivery'],
  ['scripts/seed-materials.mjs', /materials[\s\S]*eq\('course_id', course\.id\)[\s\S]*eq\('kind', asset\.kind\)[\s\S]*eq\('version', 1\)/, 'Material seeding reconciles against logical identity'],
  ['scripts/seed-materials.mjs', /Detailed Course Plan[\s\S]*visibility: 'staff'/, 'Detailed Course Plan is configured staff-only'],
];
for (const [path, expression, label] of sourceChecks) {
  const text = await readFile(resolve(root, path), 'utf8');
  if (expression.test(text)) pass(label);
  else fail(`${label} (${path})`);
}

const forbiddenPublicPhrases = [
  ['app/(site)/labs/page.tsx', /\bplanned\b/i, 'Labs page contains a visible Planned state'],
  ['app/(site)/page.tsx', /coming soon|placeholder/i, 'Homepage contains unfinished copy'],
  ['app/(site)/resources/page.tsx', /href=["'].*ML_Course_Plan/i, 'Public Resources page links directly to the private course plan'],
];
for (const [path, expression, label] of forbiddenPublicPhrases) {
  const text = await readFile(resolve(root, path), 'utf8');
  if (expression.test(text)) fail(label);
}
if (!failures.some((failure) => failure.includes('visible Planned') || failure.includes('unfinished copy') || failure.includes('links directly'))) {
  pass('Professor-facing pages contain no Planned, placeholder, coming-soon, or direct private-plan link');
}

if (failures.length) {
  console.error(`\nSource verification failed with ${failures.length} issue(s).`);
  process.exit(1);
}

console.log(`\n✓ Cosmic V4 source verification passed (${scanFiles.length} files inspected).`);

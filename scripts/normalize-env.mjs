import { chmod, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const envPath = resolve('.env.local');
let text;
try {
  text = await readFile(envPath, 'utf8');
} catch {
  console.error('✗ .env.local was not found. Copy the configured file from the earlier V3 folder or create it from .env.example.');
  process.exit(1);
}

function unquote(value) {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function readValue(name) {
  const match = text.match(new RegExp(`^${name}=(.*)$`, 'm'));
  return match ? unquote(match[1]) : '';
}

function upsert(name, value) {
  const line = `${name}=${value}`;
  const expression = new RegExp(`^${name}=.*$`, 'm');
  text = expression.test(text) ? text.replace(expression, line) : `${text.trimEnd()}\n${line}\n`;
}

const url = readValue('NEXT_PUBLIC_SUPABASE_URL');
const publishable = readValue('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
let secret = readValue('SUPABASE_SECRET_KEY');
const legacy = readValue('SUPABASE_SERVICE_ROLE_KEY');

if (!secret && legacy) {
  secret = legacy;
  upsert('SUPABASE_SECRET_KEY', secret);
  console.log('✓ Migrated the existing privileged key to SUPABASE_SECRET_KEY without displaying it.');
}

// Remove active legacy duplicates after the value has been safely migrated.
if (secret) text = text.replace(/^SUPABASE_SERVICE_ROLE_KEY=.*(?:\n|$)/gm, '');

const failures = [];
if (!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(url)) failures.push('NEXT_PUBLIC_SUPABASE_URL');
if (!(publishable.startsWith('sb_publishable_') || publishable.startsWith('eyJ'))) failures.push('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
if (!(secret.startsWith('sb_secret_') || secret.startsWith('eyJ'))) failures.push('SUPABASE_SECRET_KEY');
if (failures.length) {
  console.error(`✗ Invalid or missing environment value(s): ${failures.join(', ')}`);
  console.error('  Open .env.local and copy the matching values from Supabase Settings → API Keys.');
  process.exit(1);
}

const siteUrl = readValue('NEXT_PUBLIC_SITE_URL');
if (!siteUrl || siteUrl.includes('YOUR_') || siteUrl === 'http://localhost:3000') {
  upsert('NEXT_PUBLIC_SITE_URL', 'http://localhost:3001');
}

await writeFile(envPath, text.endsWith('\n') ? text : `${text}\n`, { mode: 0o600 });
await chmod(envPath, 0o600);
console.log('✓ .env.local is complete, normalized, and restricted to the current user.');

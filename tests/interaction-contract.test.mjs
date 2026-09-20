import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const source = (file) => readFileSync(resolve(root, file), 'utf8');

test('homepage model field is a real laboratory entry and module signals are semantic', () => {
  const home = source('app/(site)/page.tsx');
  assert.ok(home.includes('href="/labs/linear-regression"'));
  assert.ok(home.includes('LIVE LAB'));
  assert.ok(home.includes('aria-label="Open Linear Regression Studio"'));
  assert.ok(home.includes('function ModuleSignal'));
  assert.ok(home.includes('d6-module__points'));
  assert.ok(home.includes('d6-module__cluster'));
});

test('public resource guides have an in-site reading route', () => {
  const library = source('components/ResourceLibrary.tsx');
  const reader = source('app/(site)/resources/read/[id]/page.tsx');
  assert.ok(library.includes('resources/read/${m.id}'));
  assert.ok(reader.includes('public-course-guide'));
  assert.ok(reader.includes('public-lab-guide'));
  assert.ok(reader.includes('public-module-2-guide'));
  assert.ok(reader.includes('Readable web document'));
});

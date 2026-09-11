import test from 'node:test';
import assert from 'node:assert/strict';

import { safeAdminPath, safeInternalPath } from '../lib/security.ts';

test('safe internal redirects preserve valid same-origin paths', () => {
  assert.equal(safeInternalPath('/learn?module=1#start', '/'), '/learn?module=1#start');
  assert.equal(safeAdminPath('/admin/materials?status=draft'), '/admin/materials?status=draft');
});

test('safe redirects reject protocol-relative, external, and backslash variants', () => {
  const attempts = [
    '//example.com',
    '/\\example.com',
    'https://example.com/admin',
    'javascript:alert(1)',
    'admin/materials',
    '',
  ];

  for (const attempt of attempts) {
    assert.equal(safeInternalPath(attempt, '/fallback'), '/fallback');
    assert.equal(safeAdminPath(attempt), '/admin');
  }
});

test('admin redirect helper refuses valid internal paths outside the admin surface', () => {
  assert.equal(safeAdminPath('/resources'), '/admin');
  assert.equal(safeAdminPath('/administer'), '/admin');
});

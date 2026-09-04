import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const packagePath = resolve(root, 'package.json');
const lockPath = resolve(root, 'package-lock.json');
const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
const expected = { next: '16.3.3', react: '19.2.8', 'react-dom': '19.2.8' };
const failures = [];

for (const [name, version] of Object.entries(expected)) {
  if (pkg.dependencies?.[name] !== version) {
    failures.push(`${name} must be pinned to ${version}; found ${pkg.dependencies?.[name] ?? 'missing'}`);
  }
}

if (!existsSync(lockPath)) {
  failures.push('package-lock.json is required for a publishable release');
} else {
  const lock = JSON.parse(readFileSync(lockPath, 'utf8'));
  const rootPackage = lock.packages?.[''];
  for (const [name, version] of Object.entries(expected)) {
    if (rootPackage?.dependencies?.[name] !== version) {
      failures.push(`package-lock.json root dependency ${name} must equal ${version}`);
    }
  }
}

if (failures.length) {
  console.error(JSON.stringify({ status: 'blocked', failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: 'pass', runtimeVersions: expected, lockfile: 'package-lock.json' }, null, 2));

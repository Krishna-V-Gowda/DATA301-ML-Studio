import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const forbiddenNames = new Set(['PROFESSOR_EMAIL.md', 'PROFESSOR_WALKTHROUGH.md', 'START_HERE_TOMORROW.md']);
const forbiddenText = [/AKIA[0-9A-Z]{16}/, /gh[pousr]_[A-Za-z0-9_]{30,}/, /BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/];
let scanned = 0;

function walk(directory) {
  for (const name of readdirSync(directory)) {
    if (['.git', 'node_modules', '.next'].includes(name)) continue;
    const path = join(directory, name);
    const rel = relative(root, path);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path);
    else {
      if (forbiddenNames.has(name)) throw new Error(`private handoff file present: ${rel}`);
      if (stat.size > 5_000_000) continue;
      let text;
      try { text = readFileSync(path, 'utf8'); } catch { continue; }
      for (const pattern of forbiddenText) if (pattern.test(text)) throw new Error(`credential-like material: ${rel}`);
      scanned += 1;
    }
  }
}
walk(root);
for (const required of ['README.md', 'LICENSE', 'docs/MATHEMATICAL_VALIDATION.md', 'public/brand/data301-studio.svg']) {
  if (!existsSync(join(root, required))) throw new Error(`missing ${required}`);
}
console.log(JSON.stringify({ status: 'pass', scannedTextFiles: scanned }, null, 2));

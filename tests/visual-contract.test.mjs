import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../app/v6.css', import.meta.url), 'utf8');
const learn = fs.readFileSync(new URL('../app/(site)/learn/page.tsx', import.meta.url), 'utf8');

const darkSurfaces = [
  '.d6-home-band',
  '.d6-lab-feature',
  '.d6-labs-hero',
  '.d6-learn-bridge',
  '.d6-course-instructor',
  '.d6-project-expectations',
  '.d6-instructor-research',
  '.d6-footer',
];

test('V6 dark surfaces explicitly own heading contrast', () => {
  const whiteHeadingContract = /color:\s*var\(--d6-white\)\s*!important/;
  for (const surface of darkSurfaces) {
    assert.ok(css.includes(surface), `missing dark surface contract: ${surface}`);
    assert.match(
      css,
      new RegExp(`${surface.replace('.', '\\.')}(?: h1| h2| h3)[^{}]*\\{[^}]*color:\\s*var\\(--d6-white\\)\\s*!important`, 's'),
      `missing heading color contract: ${surface}`,
    );
  }
  assert.match(css, whiteHeadingContract, 'dark heading color contract missing');
});

test('learning atlas labels practice sessions, not hours', () => {
  assert.match(learn, /<strong>30<\/strong><span>practice sessions<\/span>/);
  assert.doesNotMatch(learn, /<strong>30<\/strong><span>practice hours<\/span>/);
});

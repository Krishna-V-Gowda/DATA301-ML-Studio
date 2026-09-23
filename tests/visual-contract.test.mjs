import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../app/v6.css', import.meta.url), 'utf8');
const learn = fs.readFileSync(new URL('../app/(site)/learn/page.tsx', import.meta.url), 'utf8');
const about = fs.readFileSync(new URL('../app/(site)/about/page.tsx', import.meta.url), 'utf8');
const manifest = fs.readFileSync(new URL('../app/manifest.ts', import.meta.url), 'utf8');
const nextConfig = fs.readFileSync(new URL('../next.config.ts', import.meta.url), 'utf8');

const darkSurfaces = [
  '.d6-home-band',
  '.d6-lab-feature',
  '.d6-labs-hero',
  '.d6-learn-bridge',
  '.d6-course-instructor',
  '.d6-project-expectations',
  '.d6-instructor-research',
  '.d6-about-philosophy',
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


test('About page uses restrained imagery and responsive editorial art direction', () => {
  assert.match(about, /\/campus\/vu-campus-wide\.webp/);
  assert.match(about, /\/campus\/about-life\.jpg/);
  assert.match(about, /\/campus\/about-reception-final\.jpg/);
  assert.doesNotMatch(about, /about-studio\.jpg|about-lab\.jpg|about-students\.jpg|vu-campus-atmosphere\.webp/);
  assert.doesNotMatch(about, /d6-about-scenes|d6-about-collage/);
  assert.match(about, /Beyond the screen/);
  assert.match(about, /The work has a place\./);
  assert.equal((about.match(/<Image/g) || []).length, 3);
  assert.match(css, /\.d6-about-godshot__gallery/);
  assert.match(css, /@media \(max-width:\s*900px\)[\s\S]*\.d6-about-godshot__gallery/);
  assert.match(css, /@media \(max-width:\s*560px\)[\s\S]*\.d6-about-godshot__hero-media/);
});

test('installable brand icons are declared for browser, Apple, and maskable contexts', () => {
  assert.match(manifest, /icon-192\.png/);
  assert.match(manifest, /icon-512\.png/);
  assert.match(manifest, /icon-maskable-512\.png/);
  assert.match(manifest, /purpose:\s*'maskable'/);
  assert.doesNotMatch(manifest, /icon\.svg/);
  assert.match(nextConfig, /qualities:\s*\[75, 85, 90\]/);
});

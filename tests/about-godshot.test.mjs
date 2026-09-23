import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(new URL('..', import.meta.url).pathname);
const about = fs.readFileSync(path.join(projectRoot, 'app/(site)/about/page.tsx'), 'utf8');
const css = fs.readFileSync(path.join(projectRoot, 'app/v6.css'), 'utf8');

const exists = (relative) => fs.existsSync(path.join(projectRoot, relative));

test('About Godshot uses a restrained, non-repetitive image story', () => {
  assert.match(about, /\/campus\/vu-campus-wide\.webp/);
  assert.match(about, /\/campus\/about-life\.jpg/);
  assert.match(about, /\/campus\/about-reception-final\.jpg/);
  assert.doesNotMatch(about, /about-studio\.jpg|about-lab\.jpg|about-students\.jpg|vu-campus-atmosphere\.webp/);
  assert.doesNotMatch(about, /d6-about-scenes|d6-about-collage/);
  assert.match(about, /Beyond the screen/);
  assert.match(about, /The work has a place\./);
  assert.equal((about.match(/<Image/g) || []).length, 3);
});

test('About Godshot has explicit responsive art direction', () => {
  assert.match(css, /\.d6-about-godshot__hero-media[\s\S]*object-position/);
  assert.match(css, /@media \(max-width: 1100px\)[\s\S]*\.d6-about-godshot__place-head/);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.d6-about-godshot__gallery/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.d6-about-godshot__hero-media/);
  assert.match(css, /@media \(max-width: 560px\)[\s\S]*\.d6-about-godshot__hero-media/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});

test('About Godshot preserves existing production routes and adds only scoped assets', () => {
  for (const asset of [
    'public/campus/vu-campus-wide.webp',
    'public/campus/about-life.jpg',
    'public/campus/about-reception-final.jpg',
    'public/campus/ABOUT_GODSHOT_SOURCES.md',
    'scripts/fetch-about-godshot-images.sh',
  ]) assert.ok(exists(asset), asset);

  for (const asset of [
    'public/campus/about-life.jpg',
    'public/campus/about-reception-final.jpg',
  ]) assert.ok(fs.statSync(path.join(projectRoot, asset)).size > 10_000, asset);

  assert.match(about, /href="\/course"/);
  assert.match(about, /platform\.universityUrl/);
  assert.match(about, /platform\.developer\.repository/);
});

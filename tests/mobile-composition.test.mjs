import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const v6 = read('app/v6.css');
const globals = read('app/globals.css');
const layout = read('app/layout.tsx');
const pages = {
  learn: read('app/(site)/learn/page.tsx'),
  course: read('app/(site)/course/page.tsx'),
  labs: read('app/(site)/labs/page.tsx'),
  projects: read('app/(site)/projects/page.tsx'),
  resources: read('app/(site)/resources/page.tsx'),
};

const v67Marker = v6.indexOf('V6.7 mobile composition system');
const globalsMarker = globals.indexOf('V6.7 mobile auth, administration, module, topic, and laboratory composition');

function afterMarker(source, marker, label) {
  assert.notEqual(marker, -1, `${label} marker is missing`);
  return source.slice(marker);
}

test('V6.7 mobile system owns responsive editorial layouts after legacy rules', () => {
  const mobile = afterMarker(v6, v67Marker, 'V6.7 CSS');
  assert.match(mobile, /@media \(max-width: 900px\)[\s\S]*\.d6-learn-map__intro,[\s\S]*\.d6-course-instructor__grid,[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(mobile, /@media \(max-width: 760px\)[\s\S]*\.d6-learn-map__intro > p[\s\S]*position:\s*static/);
  assert.match(mobile, /\.d6-course-instructor__links[\s\S]*border-top:/);
  assert.match(mobile, /\.d6-instructor-profile[\s\S]*width:\s*min\(calc\(100% - \(var\(--d6-mobile-gutter\) \* 2\)\)/);
  assert.match(mobile, /\.d6-instructor-profile__main > h2[\s\S]*font-size:\s*clamp\(3rem,\s*13vw,\s*4\.15rem\)[\s\S]*line-height:\s*\.98 !important/);
  assert.match(mobile, /\.d6-lab-grid-full[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(mobile, /\.d6-footer__main[\s\S]*env\(safe-area-inset-bottom\)/);
});

test('editorial heroes expose independently controllable mobile lines', () => {
  assert.match(pages.learn, /<h1><span>See how the pieces<\/span><em>become a model\.<\/em><\/h1>/);
  assert.match(pages.course, /<h1><span>Understand the model\.<\/span><em>Defend the decision\.<\/em><\/h1>/);
  assert.match(pages.labs, /<h1><span>Change one thing\.<\/span><em>Watch the model respond\.<\/em><\/h1>/);
  assert.match(pages.projects, /<h1><span>Start with a question\.<\/span><em>End with evidence\.<\/em><\/h1>/);
  assert.match(pages.resources, /<h1><span>Find the material\.<\/span><em>Keep moving\.<\/em><\/h1>/);
});

test('mobile administration explicitly owns contrast and capability spacing', () => {
  const mobile = afterMarker(globals, globalsMarker, 'V6.7 global CSS');
  assert.match(mobile, /\.login-visual h1[\s\S]*color:\s*#fff/);
  assert.match(mobile, /\.login-capabilities div[\s\S]*display:\s*grid[\s\S]*grid-template-columns:\s*30px minmax\(0,\s*1fr\)/);
  assert.match(mobile, /\.login-capabilities strong[\s\S]*display:\s*block[\s\S]*margin:\s*0 0 4px/);
  assert.match(mobile, /@media \(max-width: 680px\)[\s\S]*\.login-visual[\s\S]*padding:\s*46px 24px 56px/);
  assert.match(mobile, /\.admin-table-wrap[\s\S]*overflow-x:\s*auto/);
});

test('route transitions declare smooth-scroll ownership', () => {
  assert.match(layout, /<html[^>]*data-scroll-behavior="smooth"[^>]*data-release="v6\.7-mobile-godshot"/);
});

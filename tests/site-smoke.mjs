import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = path.join(repositoryRoot, 'index.html');
const html = await readFile(indexPath, 'utf8');

const expectedFacts = [
  'Mar 2025 - Present',
  'May 2024 - Feb 2025',
  'Aug 2023 - May 2024',
  'Sep 2022 - Jul 2023',
  'Mar 2021 - Jul 2022',
  'Global Payments',
  'Tata Consultancy Services',
  '5,000+ total vulnerabilities',
  '2,000+ high',
  '400+ HashiCorp Sentinel policies',
  'Microsoft Azure Fundamentals (AZ-900)',
  'SAFe DevOps Certification',
  'English, Hindi, Bengali, Spanish',
  'somojitb@gmail.com',
  '+52 446 292 5594',
  '+91 7908561292'
];

for (const fact of expectedFacts) {
  assert.ok(html.includes(fact), `Missing verified portfolio fact: ${fact}`);
}

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length, 'Duplicate HTML id detected');

const imageTags = [...html.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
assert.ok(imageTags.length >= 5, 'Expected portrait, project, and education imagery');
for (const tag of imageTags) {
  assert.match(tag, /\salt="[^"]+"/, `Image is missing useful alt text: ${tag}`);
}

const externalTabs = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)].map((match) => match[0]);
for (const tag of externalTabs) {
  assert.match(tag, /\srel="[^"]*noopener[^"]*"/, `External tab is missing noopener: ${tag}`);
}

const localReferences = [...html.matchAll(/\s(?:src|href)="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((reference) => reference.startsWith('./'));

for (const reference of localReferences) {
  const cleanReference = reference.split('#')[0].split('?')[0];
  await access(path.resolve(repositoryRoot, cleanReference));
}

const motionEngine = await readFile(path.join(repositoryRoot, 'assests/js/motion-engine.js'), 'utf8');
const bundle = await readFile(path.join(repositoryRoot, 'assests/js/app.bundle.js'), 'utf8');
assert.ok(motionEngine.includes('anime.js v3.2.2'), 'Pinned Anime.js runtime is missing');
assert.ok(bundle.includes('anime.js v3.2.2'), 'Browser bundle does not contain Anime.js');
assert.ok(bundle.includes("setupScrollMotion();"), 'Browser bundle is missing the portfolio interaction layer');

console.log(`Site smoke checks passed: ${expectedFacts.length} facts, ${imageTags.length} images, ${localReferences.length} local assets.`);

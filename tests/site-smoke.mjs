import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { request as httpRequest } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPreviewServer } from '../scripts/preview-server.mjs';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = await readFile(path.join(repositoryRoot, 'index.html'), 'utf8');

const expectedFacts = [
  'Mar 2025 - Present',
  'May 2024 - Feb 2025',
  'Aug 2023 - May 2024',
  'Sep 2022 - Jul 2023',
  'Mar 2021 - Jul 2022',
  'Global Payments',
  'Tata Consultancy Services',
  'Cloud Security Architect',
  'Senior DevOps Engineer',
  'Cloud Security Engineer',
  'Vulnerability Management SME',
  '500+ critical',
  '5,000+ total vulnerabilities',
  '2,000+ high',
  '400+ Sentinel policies',
  'AWS / GCP / Azure',
  'Terraform / OPA / Rego',
  'Rapid7 / Tenable.io',
  'Asansol Engineering College',
  'B.Tech in Electronics &amp; Communication Engineering',
  'DAV Public School / CBSE',
  '2015 - 2017',
  'Microsoft Azure Fundamentals (AZ-900)',
  'SAFe DevOps Certification',
  'English, Hindi, Bengali, Spanish',
  'Age and Gender Recognition',
  'Breast Cancer Detection',
  'COVID-19 Visualisation',
  'https://wa.me/524462925594',
  'somojitb@gmail.com',
  '+52 446 292 5594',
  '+91 7908561292'
];

for (const fact of expectedFacts) {
  assert.ok(html.includes(fact), `Missing verified portfolio fact: ${fact}`);
}

const primarySections = ['home', 'work', 'profile', 'contact'];
for (const sectionId of primarySections) {
  assert.match(html, new RegExp(`<section\\b[^>]*\\bid="${sectionId}"`), `Missing primary section: ${sectionId}`);
}
assert.equal((html.match(/<section\b/g) || []).length, primarySections.length, 'The portfolio should remain a compact four-section experience');

for (const anchorId of ['experience', 'projects', 'education']) {
  assert.match(html, new RegExp(`\\bid="${anchorId}"`), `Missing legacy deep-link target: ${anchorId}`);
}

assert.equal((html.match(/<h1\b/g) || []).length, 1, 'The page must contain exactly one h1');
assert.equal((html.match(/data-project-card/g) || []).length, 3, 'Expected three selected projects');
assert.equal((html.match(/data-contact-route/g) || []).length, 3, 'Expected two contact actions and one regional phone disclosure');
assert.equal((html.match(/data-language-code/g) || []).length, 4, 'Expected four animated language codes');
assert.ok(html.includes('data-language-current'), 'Animated language stage is missing');
assert.ok(!html.includes('wa.me/+'), 'WhatsApp URLs must omit the plus sign from the phone parameter');
assert.match(html, /class="header-cta" href="#contact"/, 'Header call to action should lead to contact');
assert.match(html, /mail\.google\.com\/mail\/\?view=cm&amp;fs=1&amp;to=somojitb@gmail\.com&amp;su=Portfolio%20enquiry/, 'Gmail compose route is missing its recipient or subject');

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length, 'Duplicate HTML id detected');

const imageTags = [...html.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
assert.equal(imageTags.length, 5, 'Expected one portrait, three project images, and one college image');
for (const tag of imageTags) {
  assert.match(tag, /\salt="[^"]+"/, `Image is missing useful alt text: ${tag}`);
  assert.match(tag, /\sdecoding="async"/, `Image should decode asynchronously: ${tag}`);
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

const allReferences = [...html.matchAll(/\s(?:src|href)="([^"]+)"/g)].map((match) => match[1].replaceAll('&amp;', '&'));
const allowedExternalHosts = new Set([
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'github.com',
  'mail.google.com',
  'wa.me',
  'www.linkedin.com'
]);
const sensitiveQueryKeys = /^(?:access_?token|api_?key|auth|key|password|secret|token)$/i;

for (const reference of allReferences) {
  assert.doesNotMatch(reference, /^(?:data|javascript|vbscript):/i, `Executable or embedded URL scheme is not allowed: ${reference}`);
  assert.ok(!reference.startsWith('http://'), `Insecure HTTP URL detected: ${reference}`);

  if (reference.startsWith('https://')) {
    const externalUrl = new URL(reference);
    assert.ok(allowedExternalHosts.has(externalUrl.hostname), `Unreviewed external URL host: ${externalUrl.hostname}`);
    for (const key of externalUrl.searchParams.keys()) {
      assert.ok(!sensitiveQueryKeys.test(key), `Sensitive-looking query parameter detected in ${externalUrl.hostname}: ${key}`);
    }
  }

  if (reference.startsWith('#')) {
    assert.ok(ids.includes(reference.slice(1)), `Anchor points to a missing id: ${reference}`);
  }

  if (reference.startsWith('tel:')) {
    assert.match(reference, /^tel:\+[1-9]\d{7,14}$/, `Phone URL is not in E.164 format: ${reference}`);
  }
}

assert.doesNotMatch(html, /\son[a-z]+\s*=/i, 'Inline event handlers are not allowed');
assert.match(html, /Content-Security-Policy[^>]+script-src 'self'/, 'Content Security Policy must restrict scripts to this site');
assert.match(html, /Content-Security-Policy[^>]+object-src 'none'/, 'Content Security Policy must block embedded objects');

const motionEngine = await readFile(path.join(repositoryRoot, 'assests/js/motion-engine.js'), 'utf8');
const interactionLayer = await readFile(path.join(repositoryRoot, 'assests/js/script.js'), 'utf8');
const bundle = await readFile(path.join(repositoryRoot, 'assests/js/app.bundle.js'), 'utf8');
assert.ok(motionEngine.includes('anime.js v3.2.2'), 'Pinned Anime.js runtime is missing');
assert.ok(bundle.includes('anime.js v3.2.2'), 'Browser bundle does not contain Anime.js');
assert.ok(bundle.includes('setupScrollMotion();'), 'Browser bundle is missing the portfolio interaction layer');
assert.ok(bundle.includes('setupPointerMotion();'), 'Browser bundle is missing pointer interactions');
assert.ok(bundle.includes('setupLanguageMotion();'), 'Browser bundle is missing language animation');
assert.ok(motionEngine.includes('installAnimationFrameFallback'), 'Motion engine must support browsers without requestAnimationFrame');
assert.ok(motionEngine.includes("typeof window.cancelAnimationFrame !== 'function'"), 'Motion engine must independently provide cancellation support');
assert.ok(interactionLayer.includes("document.documentElement.dataset.motion = motionAllowed ? 'enabled' : 'static'"), 'Runtime must publish its motion state');
assert.ok(interactionLayer.includes("typeof window.matchMedia === 'function'"), 'Motion preferences must tolerate browsers without matchMedia');
assert.ok(interactionLayer.includes('window.anime.running.slice()'), 'Static recovery must stop active Anime.js instances');
assert.ok((interactionLayer.match(/if \(!motionAllowed\) return;/g) || []).length >= 10, 'Animation callbacks must honor late static recovery');
assert.ok(interactionLayer.includes('!smoothScrollActive'), 'Parallax must pause during long animated navigation');
assert.ok(interactionLayer.includes("anime.set(headerElements, { translateY: 0, opacity: 1 })"), 'Navigation must finish the header entrance state before scrolling');
assert.ok(interactionLayer.includes("target.focus({ preventScroll: true })"), 'Animated skip link must transfer keyboard focus');
assert.doesNotMatch(interactionLayer, /window\.location\.hash === ['"]#home['"]/, 'Home deep links must override stale browser scroll restoration');
assert.ok(interactionLayer.includes('window.location.hash !== initialHash'), 'Initial hash correction must not override later navigation');
assert.ok(interactionLayer.includes("navigationEntry.type === 'reload'"), 'Reload navigation must be detected explicitly');
assert.ok(interactionLayer.includes("window.history.replaceState(null, '', '#home')"), 'Reloads must return to the home section');
assert.ok(interactionLayer.includes("window.history.scrollRestoration = 'manual'"), 'Reloads must disable stale browser scroll restoration');
assert.doesNotMatch(interactionLayer, /counter\.textContent\s*=\s*['"]0['"]/, 'Career metrics must not display inaccurate intermediate values');
assert.equal(bundle, `${motionEngine.trimEnd()}\n\n${interactionLayer.trimEnd()}\n`, 'Browser bundle is out of date with its source files');

for (const [legacyPath, destination] of [['projects/index.html', '../#projects'], ['experience/index.html', '../#experience']]) {
  const redirectHtml = await readFile(path.join(repositoryRoot, legacyPath), 'utf8');
  assert.ok(redirectHtml.includes(`content="0; url=${destination}"`), `${legacyPath} has the wrong redirect target`);
  assert.ok(redirectHtml.includes(`href="${destination}"`), `${legacyPath} fallback link has the wrong target`);
  assert.match(redirectHtml, /Content-Security-Policy[^>]+object-src 'none'/, `${legacyPath} is missing its restrictive CSP`);
  assert.doesNotMatch(redirectHtml, /https?:\/\//, `${legacyPath} should not load third-party resources`);
}

const notFoundHtml = await readFile(path.join(repositoryRoot, '404.html'), 'utf8');
assert.match(notFoundHtml, /Content-Security-Policy[^>]+object-src 'none'/, '404 page is missing its restrictive CSP');
assert.doesNotMatch(notFoundHtml, /<(?:script|link)[^>]+https?:\/\//, '404 page should not load third-party resources');
assert.doesNotMatch(notFoundHtml, /#(?:about|skills)/, '404 page links to a removed section');
assert.doesNotMatch(notFoundHtml, /\son[a-z]+\s*=/i, '404 page contains an inline event handler');
for (const destination of ['./#home', './#work', './#contact']) {
  assert.ok(notFoundHtml.includes(`href="${destination}"`), `404 page is missing ${destination}`);
}

const css = await readFile(path.join(repositoryRoot, 'assests/css/style.css'), 'utf8');
assert.match(css, /\.motion-enabled \[data-reveal\]/, 'Reveal elements may only be hidden after motion is enabled');
assert.doesNotMatch(css, /cursor:\s*none/, 'The native cursor must remain visible when pointer animation is unavailable');
assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]+body,[\s\S]+cursor: auto;/, 'Reduced-motion mode must restore the native cursor');

const previewServer = createPreviewServer(repositoryRoot);
await new Promise((resolve, reject) => {
  previewServer.once('error', reject);
  previewServer.listen(0, '127.0.0.1', resolve);
});
const previewPort = previewServer.address().port;
const requestStatus = (requestPath) => new Promise((resolve, reject) => {
  const request = httpRequest({ host: '127.0.0.1', port: previewPort, path: requestPath }, (response) => {
    response.resume();
    response.once('end', () => resolve(response.statusCode));
  });
  request.once('error', reject);
  request.end();
});
assert.equal(await requestStatus('/%E0%A4%A'), 400, 'Malformed preview URL should return 400 without terminating the server');
assert.equal(await requestStatus('/'), 200, 'Preview server should remain available after a malformed request');
await new Promise((resolve, reject) => previewServer.close((error) => error ? reject(error) : resolve()));

console.log(`Site smoke checks passed: ${expectedFacts.length} facts, ${primarySections.length} primary sections, ${imageTags.length} images, ${localReferences.length} local assets.`);

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
  'CloudTrail, CloudWatch, and Aternity',
  'Cloudflare, Route 53, and Squid',
  'Carbon Black deployment and configuration',
  'AWS IAM policies, roles, and MFA controls',
  'firewalls, load balancers, and VPNs',
  'severity, exploitability, and business impact',
  'Asansol Engineering College',
  'B.Tech in Electronics &amp; Communication Engineering',
  'DAV Public School / CBSE',
  '2015 - 2017',
  'Microsoft Azure Fundamentals (AZ-900)',
  'SAFe DevOps Certification',
  'English, Hindi, Bengali, Spanish',
  'https://wa.me/524462925594',
  'somojitb@gmail.com',
  '+52 446 292 5594',
  '+91 7908561292'
];

for (const fact of expectedFacts) {
  assert.ok(html.includes(fact), `Missing verified portfolio fact: ${fact}`);
}

assert.ok(!html.includes('wa.me/+'), 'WhatsApp links must use the international number without a plus sign');
assert.ok(!html.includes('>Call me<'), 'Phone contact cards should use location-specific labels');
assert.equal((html.match(/data-contact-card/g) || []).length, 4, 'Expected four animated contact routes');
assert.ok(html.includes('data-language-current'), 'Animated language stage is missing');
assert.ok(html.includes('mail.google.com/mail/?view=cm&amp;fs=1&amp;to=somojitb@gmail.com&amp;su=Portfolio%20enquiry'), 'Gmail route is missing its recipient or subject');
assert.match(html, /class="contact-channel contact-email"[^>]+target="_blank"[^>]+rel="noopener noreferrer"/, 'Gmail should open safely in a new tab');
assert.match(html, /class="contact-channel contact-channel-primary"[^>]+target="_blank"[^>]+rel="noopener noreferrer"/, 'WhatsApp should open safely in a new tab');
assert.ok(html.includes('contact-phone-disclosure'), 'Regional phone lines should be grouped in one disclosure');
assert.match(html, /class="header-cta" href="#contact"/, 'Header call to action should lead to the contact section');

const requiredSections = ['home', 'impact', 'expertise', 'experience', 'projects', 'education', 'contact'];
for (const sectionId of requiredSections) {
  assert.match(html, new RegExp(`<section\\b[^>]*\\bid="${sectionId}"`), `Missing section landmark: ${sectionId}`);
}

assert.equal((html.match(/<h1\b/g) || []).length, 1, 'The page must contain exactly one h1');

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length, 'Duplicate HTML id detected');

const imageTags = [...html.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
assert.ok(imageTags.length >= 6, 'Expected portrait, matching project, college, and school imagery');
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
assert.ok(bundle.includes("setupScrollMotion();"), 'Browser bundle is missing the portfolio interaction layer');
assert.equal(bundle, `${motionEngine.trimEnd()}\n\n${interactionLayer.trimEnd()}\n`, 'Browser bundle is out of date with its source files');

console.log(`Site smoke checks passed: ${expectedFacts.length} facts, ${requiredSections.length} sections, ${imageTags.length} images, ${localReferences.length} local assets.`);

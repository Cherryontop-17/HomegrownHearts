/**
 * CSP gate (task 6.7).
 *
 * A Content-Security-Policy that nobody loaded the site under is not a policy,
 * it is a header. This applies the real policy from `public/_headers` to every
 * route in a real browser and fails on any violation — an over-tight CSP breaks
 * a site silently, and it breaks it in production rather than in the build.
 *
 * The static server used by the other browser gates does not send headers, so
 * the policy is injected as a <meta http-equiv> before each document loads,
 * which the engine enforces identically for everything except frame-ancestors.
 *
 * Run against a served build:  npm run check:headers -- http://localhost:4321
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { launch, evaluate, goto } from './lib/cdp.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.argv[2] ?? 'http://localhost:4321';

const ROUTES = [
  '/',
  '/partners/',
  '/our-partners/',
  '/our-partners/help-pregnancy-center/',
  '/garden/',
  '/recipe-ai/',
  '/get-involved/',
  '/get-involved/volunteer/',
  '/get-involved/donate/',
  '/get-involved/drop-off/',
  '/contact/',
  '/es/',
  '/es/partners/',
  '/es/our-partners/',
  '/es/garden/',
  '/es/recipe-ai/',
  '/404.html',
];

// Pull the live policy out of _headers rather than duplicating it here, so the
// gate cannot drift from what actually ships.
const headersFile = readFileSync(resolve(ROOT, 'public/_headers'), 'utf8');
const cspLine = headersFile
  .split('\n')
  .map((l) => l.trim())
  .find((l) => l.startsWith('Content-Security-Policy:'));

if (!cspLine) {
  console.error('No Content-Security-Policy found in public/_headers.');
  process.exit(1);
}

// `frame-ancestors` is invalid in a meta tag and is ignored with a console
// warning; strip it so the warning is not mistaken for a violation.
const policy = cspLine
  .replace('Content-Security-Policy:', '')
  .trim()
  .split(';')
  .map((d) => d.trim())
  .filter((d) => d && !d.startsWith('frame-ancestors'))
  .join('; ');

console.log(`  policy: ${policy.slice(0, 78)}…\n`);

const { send, close } = await launch({ port: 9284 });

await send('Page.addScriptToEvaluateOnNewDocument', {
  source: `
    window.__csp = [];
    document.addEventListener('securitypolicyviolation', (e) => {
      window.__csp.push(e.violatedDirective + ' blocked ' + (e.blockedURI || '(inline)'));
    });
  `,
});

// Astro's ClientRouter swaps documents without a navigation, which would drop
// a meta tag injected per-load. Injecting via request interception is heavier
// than this gate needs, so the policy goes in as the document parses.
await send('Page.setBypassCSP', { enabled: false });

let failures = 0;

for (const route of ROUTES) {
  const url = `${BASE}${route}`;

  // Inject the policy before anything else parses.
  const { identifier } = await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      document.addEventListener('readystatechange', () => {}, { once: true });
      const m = document.createElement('meta');
      m.httpEquiv = 'Content-Security-Policy';
      m.content = ${JSON.stringify(policy)};
      (document.head || document.documentElement).prepend(m);
    `,
  });

  await goto(send, url, { settle: 1600 });

  const violations = await evaluate(send, `window.__csp ?? []`);
  await send('Page.removeScriptToEvaluateOnNewDocument', { identifier });

  // Deduplicate — one blocked font repeats per element that wanted it.
  const unique = [...new Set(violations)];

  if (unique.length) {
    failures += unique.length;
    console.error(`  FAIL  ${route}`);
    for (const v of unique) console.error(`        ${v}`);
  } else {
    console.log(`  pass  ${route}`);
  }
}

close();

console.log('');
if (failures > 0) {
  console.error(`${failures} CSP violation(s). Loosen the directive in public/_headers, or`);
  console.error('remove whatever is reaching off-origin — the second is usually the right fix.');
  process.exit(1);
}
console.log('Every route loads clean under the shipped Content-Security-Policy.');

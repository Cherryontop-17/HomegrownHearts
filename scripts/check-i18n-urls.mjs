/**
 * hreflang / canonical consistency gate. Runs against the built output.
 *
 * Exists because of a bug this caught in Phase 1: the Spanish homepage
 * advertised `canonical=/es/` next to `hreflang=/es`. Both URLs look right in
 * isolation and the page renders perfectly — but Google requires hreflang URLs
 * to match canonicals exactly, and a mismatch invalidates the whole language
 * cluster without any visible symptom. That is not something a human review
 * catches reliably, so it is a test.
 *
 * Checks, per built page:
 *   1. Exactly one canonical.
 *   2. The page's own hreflang entry equals its canonical, character for character.
 *   3. Every locale is represented, plus x-default.
 *   4. Every hreflang URL actually resolves to a file that was built.
 *
 * Run: `npm run check:i18n` (after `npm run build`).
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join, relative } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = resolve(ROOT, 'dist/client');

if (!existsSync(DIST)) {
  console.error('dist/client not found. Run `npm run build` first.');
  process.exit(1);
}

const LOCALE_TAGS = ['en-US', 'es-US'];

function htmlFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...htmlFiles(full));
    else if (entry.endsWith('.html')) out.push(full);
  }
  return out;
}

/** Map a site-absolute URL path back to the file that serves it. */
function fileFor(pathname) {
  const clean = pathname.replace(/^\/+|\/+$/g, '');
  const candidates = [
    join(DIST, clean, 'index.html'),
    join(DIST, `${clean}.html`),
    join(DIST, 'index.html'),
  ];
  return candidates.find((c) => existsSync(c));
}

let failures = 0;
const fail = (file, message) => {
  console.error(`  FAIL  ${relative(DIST, file)}`);
  console.error(`        ${message}`);
  failures++;
};

const pages = htmlFiles(DIST);

for (const file of pages) {
  const html = readFileSync(file, 'utf8');

  const canonicals = [...html.matchAll(/<link\s+rel="canonical"\s+href="([^"]+)"/g)].map(
    (m) => m[1],
  );

  if (canonicals.length !== 1) {
    fail(file, `expected exactly 1 canonical, found ${canonicals.length}`);
    continue;
  }
  const canonical = canonicals[0];

  const alternates = [
    ...html.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/g),
  ].map((m) => ({ hreflang: m[1], href: m[2] }));

  if (alternates.length === 0) {
    fail(file, 'no hreflang alternates');
    continue;
  }

  for (const tag of [...LOCALE_TAGS, 'x-default']) {
    if (!alternates.some((a) => a.hreflang === tag)) {
      fail(file, `missing hreflang="${tag}"`);
    }
  }

  // The self-referencing alternate must equal the canonical exactly.
  const self = alternates.find((a) => a.href === canonical);
  if (!self) {
    fail(
      file,
      `no hreflang matches this page's canonical.\n` +
        `        canonical: ${canonical}\n` +
        `        alternates: ${alternates.map((a) => `${a.hreflang}=${a.href}`).join(', ')}`,
    );
  }

  // Every advertised alternate must be a page that exists.
  for (const alt of alternates) {
    const { pathname } = new URL(alt.href);
    if (!fileFor(pathname)) {
      fail(file, `hreflang="${alt.hreflang}" points at ${pathname}, which was not built`);
    }
  }
}

console.log('');
if (failures > 0) {
  console.error(`${failures} i18n URL problem(s) across ${pages.length} page(s).`);
  process.exit(1);
}
console.log(`${pages.length} page(s): canonical and hreflang agree, all targets exist.`);

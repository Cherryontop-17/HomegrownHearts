/**
 * Palette contrast gate.
 *
 * Parses the real token values out of `src/styles/global.css` — it never
 * hardcodes a hex, so the test cannot drift away from the design system.
 *
 * Sections alternate cream / sand / parchment bands, so any color used for text
 * is checked against ALL of them and judged on its worst pairing. Checking only
 * against cream is how the first pass shipped two failing accent colors.
 *
 * Run: `npm run check:contrast` (also runs in CI, gating task 6.3).
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CSS = readFileSync(resolve(ROOT, 'src/styles/global.css'), 'utf8');

/** Pull `--color-x: #hex;` declarations out of the @theme block. */
function readTokens() {
  const tokens = {};
  for (const [, name, hex] of CSS.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)) {
    tokens[name] = hex.toLowerCase();
  }
  return tokens;
}

const srgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const linearize = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

function luminance(hex) {
  const [r, g, b] = srgb(hex).map(linearize);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const t = readTokens();

/** Every surface a section band can use. Text must clear AA on all of them. */
const SURFACES = ['cream', 'sand', 'parchment'];

/**
 * `min` is the WCAG floor for that role:
 *   4.5 — body and heading text (1.4.3 AA)
 *   3.0 — non-text: rules, borders, meaningful graphics (1.4.11)
 */
const CHECKS = [
  { fg: 'clay', on: SURFACES, min: 4.5, role: 'headings, eyebrows' },
  { fg: 'clay-deep', on: SURFACES, min: 4.5, role: 'heading hover' },
  { fg: 'ink', on: SURFACES, min: 4.5, role: 'body text' },
  { fg: 'ink-muted', on: SURFACES, min: 4.5, role: 'secondary text' },
  { fg: 'season-grow', on: SURFACES, min: 4.5, role: 'section accent (text)' },
  { fg: 'season-harvest', on: SURFACES, min: 4.5, role: 'section accent (text)' },
  { fg: 'season-care', on: SURFACES, min: 4.5, role: 'section accent (text)' },
  { fg: 'garden', on: SURFACES, min: 3.0, role: 'focus ring (non-text)' },
  { fg: 'leaf', on: SURFACES, min: 3.0, role: 'vine, rules (non-text)' },
  { fg: 'line-strong', on: ['cream'], min: 1.0, role: 'hairline (decorative)' },
  // Inverted: light text on a filled brand surface.
  { fg: 'ink-inverse', on: ['garden'], min: 4.5, role: 'primary button label' },
  { fg: 'ink-inverse', on: ['garden-deep'], min: 4.5, role: 'button hover label' },
  { fg: 'ink-inverse', on: ['clay'], min: 4.5, role: 'clay-filled surface' },
  { fg: 'ink', on: ['card'], min: 4.5, role: 'text on raised card' },
  { fg: 'ink-muted', on: ['card'], min: 4.5, role: 'secondary on card' },
  // Dark editorial bands. These invert the whole relationship, so every text
  // role that appears on them needs its own check — a colour that is safe on
  // cream says nothing about whether it is safe on ink.
  { fg: 'ink-inverse', on: ['ink-deep'], min: 4.5, role: 'text on dark band' },
  { fg: 'ink-inverse', on: ['ink-deep-soft'], min: 4.5, role: 'text on dark card' },
  { fg: 'line', on: ['ink-deep'], min: 4.5, role: 'muted text on dark band' },
  { fg: 'clay-soft', on: ['ink-deep'], min: 4.5, role: 'accent text on dark band' },
  { fg: 'leaf', on: ['ink-deep'], min: 3.0, role: 'rules on dark band (non-text)' },
];

/**
 * Colours that are correct on light bands and WRONG on the dark one.
 *
 * The list above checks pairings we intend. This checks the opposite: pairings
 * a component would produce by reaching for a brand colour directly instead of
 * the surface-aware `--text-heading` / `--text-muted` roles. Both of these
 * shipped once — clay step titles at 2.4:1 and ink-muted body at 2.5:1 on the
 * ink band — and neither was caught, because the gate only knew about pairings
 * someone had thought to list.
 *
 * If one of these ever starts passing, the palette changed and the roles should
 * be revisited. If a component starts failing, it is reaching past the roles.
 */
const MUST_NOT_BE_USED_ON = [
  { fg: 'clay', on: 'ink-deep', because: 'use var(--text-heading), which inverts on dark' },
  { fg: 'ink-muted', on: 'ink-deep', because: 'use var(--text-muted), which inverts on dark' },
  { fg: 'ink', on: 'ink-deep', because: 'use var(--text-heading) or --color-ink-inverse' },
];

/**
 * Deliberately excluded, with reasons — so an omission is a decision on the
 * record rather than something quietly forgotten.
 */
const EXEMPT = {
  'clay-soft': 'decorative only (3.6:1) — never used for text or meaningful graphics',
};

let failures = 0;
const rows = [];

for (const { fg, on, min, role } of CHECKS) {
  const fgHex = t[fg];
  if (!fgHex) {
    console.error(`  token --color-${fg} not found in global.css`);
    failures++;
    continue;
  }

  for (const bg of on) {
    const bgHex = t[bg];
    if (!bgHex) {
      console.error(`  token --color-${bg} not found in global.css`);
      failures++;
      continue;
    }

    const ratio = contrast(fgHex, bgHex);
    const pass = ratio >= min;
    if (!pass) failures++;
    rows.push({ pass, ratio, min, label: `${fg} on ${bg}`, role });
  }
}

const pad = Math.max(...rows.map((r) => r.label.length));
for (const r of rows) {
  const mark = r.pass ? 'pass' : 'FAIL';
  console.log(
    `  ${mark}  ${r.ratio.toFixed(2).padStart(6)}:1  (min ${r.min.toFixed(1)})  ` +
      `${r.label.padEnd(pad)}  ${r.role}`,
  );
}

// Assert the trap colours really are traps. This documents WHY the
// surface-aware roles exist, and it fails loudly if a palette change ever
// makes one of them safe (at which point the roles should be revisited).
for (const { fg, on, because } of MUST_NOT_BE_USED_ON) {
  const ratio = contrast(t[fg], t[on]);
  if (ratio >= 4.5) {
    failures++;
    console.error(`  STALE   --color-${fg} now reaches ${ratio.toFixed(2)}:1 on --color-${on}.`);
    console.error(`          The surface-aware role exists because it did not. Revisit.`);
  } else {
    console.log(`  trap    ${ratio.toFixed(2).padStart(6)}:1  ${fg} on ${on} — ${because}`);
  }
}

for (const [token, why] of Object.entries(EXEMPT)) {
  console.log(`  skip                            --color-${token}: ${why}`);
}

console.log('');
if (failures > 0) {
  console.error(`${failures} contrast failure(s). Fix the token, not the test.`);
  process.exit(1);
}
console.log(`All ${rows.length} pairings meet WCAG AA.`);

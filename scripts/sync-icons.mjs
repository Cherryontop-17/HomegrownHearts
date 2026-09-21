/**
 * Extracts the icons we actually use out of `lucide-static` into a typed module.
 *
 * Why generate rather than import at runtime: the site ships zero client JS for
 * icons, and pulling an icon library into the bundle to draw eight shapes would
 * be absurd on a $0 budget with a Lighthouse >=95 target. `lucide-static` stays
 * a devDependency; only the path data for the listed icons reaches `src/`.
 *
 * Re-run after adding a name to ICONS below:
 *   npm run sync:icons
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(ROOT, 'node_modules/lucide-static/icons');
const OUT = resolve(ROOT, 'src/icons/lucide.generated.ts');

/**
 * Deliberately short. Every icon added here is a decision about what deserves a
 * symbol — an interface where everything has an icon is one where nothing
 * stands out.
 */
const ICONS = [
  // Navigation and controls
  'menu',
  'x',
  'arrow-right',
  'arrow-up-right',
  'chevron-down',
  'check',
  // Contact
  // Note: no 'instagram' here — Lucide removed brand marks, so it lives in
  // src/icons/custom.ts alongside the illustrative set.
  'mail',
  'map-pin',
  // Content
  'shield-check', // food-safety protocol
  'clipboard-list', // produce list
  'printer', // /partners print view
  'users', // volunteers
  'calendar', // delivery schedule
  'leaf',
  'sun',

  // Roadmap — the August calendar and the phase rail both need a status glyph
  // per milestone. Three states only: shipped, in progress, not yet.
  'calendar-days',
  'circle-check', // a phase that has happened
  'circle-dot', // the phase we are in now
  'clock', // still ahead
  'chevron-right',

  // The QR -> recipe pipeline section
  'qr-code',
  'scan-line',
  'sparkles',

  // Supply wishlist. Produce gets a real botanical glyph rather than a generic
  // basket, because the grid is the one place a donor scans for "what do I buy".
  'carrot',
  'leafy-green',
  'salad',
  'flower-2', // herbs

  // One glyph per crop, all distinct — see the warning above CROPS in
  // src/crops.ts. basil/kale/spinach reuse the three above; these are the rest.
  // peppermint uses 'leaf', listed under Content above
  'clover', // cilantro
  'wheat', // dill
  'shrub', // oregano
  'snowflake', // the winter phases of the calendar

  'shovel', // tools
  'package', // cardboard boxes
  'droplets',

  // Safety gate + partner credibility
  'stethoscope', // medical lead
  'user-check', // adult advisor
  'file-check', // clinic-approved produce list
  'truck', // delivery to the clinic

  'download', // flyer PDFs
  'external-link',
];

mkdirSync(dirname(OUT), { recursive: true });

const entries = [];
for (const name of ICONS.sort()) {
  const file = join(SRC, `${name}.svg`);
  let svg;
  try {
    svg = readFileSync(file, 'utf8');
  } catch {
    console.error(`  missing icon: ${name}.svg — check the name against lucide.dev`);
    process.exit(1);
  }

  // Everything between the <svg> wrapper is the drawable content. The wrapper's
  // own attributes are supplied by Icon.astro so every icon is stroked
  // identically regardless of what Lucide shipped.
  const inner = svg
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<svg[\s\S]*?>/, '')
    .replace(/<\/svg>/, '')
    .replace(/\s+/g, ' ')
    .trim();

  entries.push(`  '${name}': '${inner.replace(/'/g, "\\'")}',`);
}

const banner = `/**
 * GENERATED FILE — do not edit by hand.
 * Run \`npm run sync:icons\` after changing the ICONS list in
 * scripts/sync-icons.mjs.
 *
 * Icons from Lucide (https://lucide.dev), ISC licensed.
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part
 * of Feather (MIT). All other copyright (c) for Lucide are held by Lucide
 * Contributors 2022.
 *
 * Drawn on Lucide's 24x24 grid. Stroke weight and line caps come from
 * Icon.astro, not from these strings, so the whole set stays consistent.
 */

export const LUCIDE_ICONS = {
${entries.join('\n')}
} as const;

export type LucideIconName = keyof typeof LUCIDE_ICONS;
`;

writeFileSync(OUT, banner, 'utf8');
console.log(`  ${entries.length} icons written to src/icons/lucide.generated.ts`);

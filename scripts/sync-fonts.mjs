/**
 * Copies the chosen font files from Fontsource into `public/fonts/`.
 *
 * Why copy instead of importing from node_modules:
 *   - `public/` gives stable, unhashed URLs, which is what `<link rel=preload>`
 *     in Base.astro needs. A Vite-hashed path would change every build.
 *   - The fonts are committed, so a clone builds identically without depending
 *     on node_modules internals that Fontsource is free to rearrange.
 *
 * Re-run after bumping either @fontsource-variable package:
 *   npm run sync:fonts && npm run check:fonts
 */

import { copyFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, basename } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DEST = resolve(ROOT, 'public/fonts');

/**
 * Variable `wght` axis only, latin subset.
 *
 * Deliberately NOT the `opsz` builds: Fraunces opsz is 67 KB vs 37 KB and Inter
 * opsz is 73 KB vs 48 KB. That is +55 KB of render-blocking preload to buy
 * optical sizing, against an explicit Lighthouse >=95 mobile-profile target
 * (task 6.4). Revisit only if 6.4 passes with headroom to spare.
 *
 * Italics are omitted entirely — no design in the system uses them. Adding one
 * later is a line in this list plus a matching @font-face.
 */
const FILES = [
  '@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2',
  '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
];

mkdirSync(DEST, { recursive: true });

let copied = 0;
for (const rel of FILES) {
  const src = resolve(ROOT, 'node_modules', rel);
  if (!existsSync(src)) {
    console.error(`  missing source: ${rel}`);
    console.error('  Did the Fontsource package layout change? Run `npm install` first.');
    process.exit(1);
  }

  const dest = resolve(DEST, basename(rel));
  copyFileSync(src, dest);
  console.log(`  ${basename(rel)}  ${(statSync(dest).size / 1024).toFixed(1)} KB`);
  copied++;
}

console.log(`\n${copied} font file(s) synced to public/fonts/.`);

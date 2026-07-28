/**
 * Text-over-photograph contrast gate.
 *
 * `check:contrast` compares colour tokens against each other. It cannot see the
 * one place on this site where text sits on a photograph, and that is exactly
 * where contrast fails in practice: a scrim opacity can be right in theory and
 * still lose against a bright image.
 *
 * This renders the page, hides the hero text, photographs what is BEHIND it,
 * and measures the worst (lightest) pixel under each text block against the
 * cream type colour. It caught the hero title at 3.35:1 — legal for large text
 * but with almost no margin, and one photograph swap from failing.
 *
 * Run against a served build:  npm run check:hero -- http://localhost:4321
 */

import sharp from 'sharp';
import { launch, evaluate, goto } from './lib/cdp.mjs';

const BASE = process.argv[2] ?? 'http://localhost:4321';
const ROUTES = ['/', '/es/'];

/** The cream the hero type is set in (--color-ink-inverse). */
const TYPE = [253, 251, 246];

/**
 * Floors per block. The title is display-sized so WCAG's large-text 3:1 would
 * apply, but it is held to 4.5 anyway — the whole point of a scrim is that it
 * works over a photograph nobody has chosen yet, and 3:1 leaves no room for
 * the founders swapping in their own.
 */
const BLOCKS = [
  { key: 'title', selector: '.hero__title', min: 4.5 },
  { key: 'lead', selector: '.hero__lead', min: 4.5 },
  { key: 'badge', selector: '.hero__badge', min: 4.5 },
];

const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const relLum = (r, g, b) => 0.2126 * lin(r / 255) + 0.7152 * lin(g / 255) + 0.0722 * lin(b / 255);
const TYPE_L = relLum(...TYPE);
const ratio = (bgL) => (Math.max(TYPE_L, bgL) + 0.05) / (Math.min(TYPE_L, bgL) + 0.05);

const { send, close } = await launch({ port: 9282 });
let failures = 0;

for (const route of ROUTES) {
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await goto(send, `${BASE}${route}`, { settle: 1800 });

  const boxes = await evaluate(
    send,
    `(() => {
       const out = {};
       ${JSON.stringify(BLOCKS)}.forEach(b => {
         const el = document.querySelector(b.selector);
         if (!el) return;
         const r = el.getBoundingClientRect();
         if (r.height <= 0) return;
         out[b.key] = { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
       });
       return out;
     })()`,
  );

  if (Object.keys(boxes).length === 0) {
    console.log(`  skip  ${route} — no hero text on this page`);
    continue;
  }

  // Photograph what is behind the text, not the text.
  await evaluate(
    send,
    `document.querySelectorAll('.hero__title,.hero__lead,.hero__badge,.hero__actions')
       .forEach(e => e.style.visibility = 'hidden')`,
  );
  await new Promise((r) => setTimeout(r, 400));

  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  const png = Buffer.from(data, 'base64');

  for (const block of BLOCKS) {
    const b = boxes[block.key];
    if (!b || b.y < 0) continue;

    const { data: px, info } = await sharp(png)
      .extract({
        left: Math.max(0, b.x),
        top: Math.max(0, b.y),
        width: Math.max(1, Math.min(b.w, 1440 - Math.max(0, b.x))),
        height: b.h,
      })
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Worst case for light type is the LIGHTEST pixel behind it.
    let worst = 0;
    for (let i = 0; i < px.length; i += info.channels * 5) {
      const L = relLum(px[i], px[i + 1], px[i + 2]);
      if (L > worst) worst = L;
    }

    const r = ratio(worst);
    const label = `${route} hero ${block.key}`;
    if (r < block.min) {
      failures++;
      console.error(`  FAIL  ${r.toFixed(2)}:1  (min ${block.min})  ${label}`);
      console.error(
        `        Strengthen the type guard in scripts/grade-photos.mjs and re-run npm run photos.`,
      );
    } else {
      console.log(`  pass  ${r.toFixed(2)}:1  (min ${block.min})  ${label}`);
    }
  }
}

close();

console.log('');
if (failures > 0) {
  console.error(`${failures} hero text block(s) below contrast floor.`);
  process.exit(1);
}
console.log('Hero text clears its contrast floor over the actual photograph.');

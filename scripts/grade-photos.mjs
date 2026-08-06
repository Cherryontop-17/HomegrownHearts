/**
 * Art direction pass over the source photographs.
 *
 * Stock images look like stock mainly because they do not match each other.
 * Grading them all through one pipeline is what turns five unrelated pictures
 * into something that reads as a single commissioned shoot, and it costs
 * nothing but a build step.
 *
 * The look: warm, slightly lifted shadows, gentle contrast, restrained
 * saturation. Tuned to sit inside the site's cream/clay/garden palette rather
 * than fight it — a cold blue-green photograph on a warm cream page is the
 * single most common reason a page looks assembled rather than designed.
 *
 * Sources live in `photos-src/`, graded output goes to `src/assets/photos/`.
 * Re-run after replacing a source:  npm run photos
 */

import sharp from 'sharp';
import { readdirSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(ROOT, 'photos-src');
const OUT = resolve(ROOT, 'src/assets/photos');

if (!existsSync(SRC)) {
  console.error(`No photos-src/ directory. Put ungraded sources there.`);
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });

/**
 * Per-slot recipe.
 *
 * `width`/`height` fix the delivered crop so the layout never has to guess.
 * `position` picks which part survives the crop — `attention` lets sharp find
 * the busiest region, which is right for produce and wrong for a shot that
 * needs deliberate empty space.
 *
 * `dim` darkens for type overlay. `warmth` and `sat` fine-tune per image so
 * they land on the same look despite different source white balance.
 *
 * `cool` scales the BLUE slope down, and it exists because `warmth` alone
 * cannot fix a cold picture. Warmth only lifts red, which warms the midtones
 * and leaves a light, cold highlight exactly as blue as it was — so a shot on
 * gray concrete stayed gray no matter how far warmth was pushed. Pulling blue
 * down is what neutralises the highlight. Defaults to 1, so every photo that
 * does not set it grades byte-identically to before.
 */
const RECIPES = {
  hero: {
    width: 2600,
    height: 1625, // 16:10
    position: sharp.strategy.attention,
    warmth: 1.06,
    sat: 1.06,
    // Was dim 0.9 + vignette 0.45 + typeGuard, all of which existed to carry
    // cream type laid across this photograph. The hero is now an editorial
    // split — the type sits on cream beside the picture, not on top of it — so
    // every one of those is pure loss: they were making the single largest
    // image on the site look muddy for no remaining reason.
    dim: 1.0,
    vignette: 0.12,
    typeGuard: false,
  },
  garden: {
    width: 1800,
    height: 1350,
    position: sharp.strategy.attention,
    warmth: 1.05,
    sat: 1.04,
  },
  harvest: {
    width: 1800,
    height: 1350,
    position: sharp.strategy.attention,
    warmth: 1.04,
    sat: 1.02,
  },
  bundle: { width: 1800, height: 1350, position: sharp.strategy.attention, warmth: 1.05, sat: 1.0 },
  /*
    The one photo that needed its own treatment.

    Source is a scoop of potting soil on a gray concrete slab in cold shade —
    dark, near-neutral, and the odd one out in a set of warm produce shots. At
    the standard recipe its mean channels were R62 G65 B61: literally gray. It
    is the widest image on the homepage, so being the coldest thing on the page
    was very visible.

    Pushed harder than anything else here, and `cool` does most of the work:
    the soil now reads warm brown and the concrete neutral rather than blue.
    R-B goes from -1 (blue-biased) to +9.
  */
  'break-produce': {
    width: 2600,
    height: 1114, // 21:9
    position: sharp.strategy.attention,
    warmth: 1.1,
    sat: 1.32,
    dim: 1.12,
    cool: 0.9,
  },
};

/** A radial darkening mask, as an SVG overlay. */
const vignetteSvg = (w, h, strength) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <radialGradient id="v" cx="50%" cy="46%" r="76%">
      <stop offset="55%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="${strength}"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#v)"/>
</svg>`;

/**
 * Extra shade under the headline so cream type always holds over it.
 *
 * Two gradients, not one. A single diagonal left the TITLE — which sits higher
 * than the lead — over a bright patch at 3.35:1: legal for large text, but with
 * almost no margin, and a different photograph would push it under. The
 * vertical pass covers the whole lower half where all the type lives; the
 * diagonal keeps the left side, where the line starts, darker still.
 *
 * Measured after this change by scripts/check-hero-contrast.mjs, which samples
 * the real composited pixels rather than trusting the maths.
 */
const typeGuardSvg = (w, h) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <linearGradient id="v" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#100e0c" stop-opacity="0.86"/>
      <stop offset="38%" stop-color="#100e0c" stop-opacity="0.68"/>
      <stop offset="70%" stop-color="#100e0c" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#100e0c" stop-opacity="0.06"/>
    </linearGradient>
    <linearGradient id="d" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#100e0c" stop-opacity="0.52"/>
      <stop offset="55%" stop-color="#100e0c" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#100e0c" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#v)"/>
  <rect width="${w}" height="${h}" fill="url(#d)"/>
</svg>`;

const sources = readdirSync(SRC).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
if (sources.length === 0) {
  console.error('photos-src/ is empty.');
  process.exit(1);
}

let done = 0;
for (const file of sources) {
  const slot = file.replace(/\.[^.]+$/, '');
  const recipe = RECIPES[slot];
  if (!recipe) {
    console.log(`  skip  ${file} (no recipe for "${slot}")`);
    continue;
  }

  const {
    width,
    height,
    position,
    warmth,
    sat,
    dim = 1,
    cool = 1,
    vignette = 0,
    typeGuard = false,
  } = recipe;

  let img = sharp(join(SRC, file)).rotate().resize(width, height, { fit: 'cover', position });

  // --- Grade ---------------------------------------------------------------
  // 1. Gentle S-curve. `linear` with a slope just over 1 and a matching
  //    negative offset lifts contrast without crushing the blacks, which is
  //    what keeps shadows warm rather than muddy.
  // 2. Saturation and brightness per image, so different source white balance
  //    still lands on the same look.
  // 3. A warm tint pulls the whole frame toward the cream page.
  // Per-channel linear, NOT `.tint()`. sharp's tint desaturates the image
  // before colouring it, which turns a photograph of vegetables into sepia —
  // it is a colourise operation, not a white-balance one. Warming per channel
  // (lift red, hold green, ease blue) keeps every colour and just moves the
  // balance toward the cream page.
  //
  // The slope above 1 with a negative offset is a gentle S-curve: more
  // contrast without crushing the blacks, which is what keeps shadows warm
  // rather than muddy.
  //
  // The multipliers below were raised from 1.07 / 1.06. The first pass was so
  // restrained that the grade did almost nothing: the photographs landed on the
  // page looking washed out and generic, which was the single biggest reason
  // the site read as flat. This is still a long way from over-processed — the
  // point is produce that looks worth eating, not a filter.
  img = img
    .linear([1.13 * warmth, 1.09, 0.995 * cool], [-11, -10, -6])
    .modulate({ saturation: sat * 1.22, brightness: dim * 1.02 });

  const overlays = [];
  if (vignette > 0) {
    overlays.push({ input: Buffer.from(vignetteSvg(width, height, vignette)), blend: 'over' });
  }
  if (typeGuard) {
    overlays.push({ input: Buffer.from(typeGuardSvg(width, height)), blend: 'over' });
  }
  if (overlays.length) img = img.composite(overlays);

  // Slight output sharpening — resizing always softens, and unsharpened
  // photographs are the other thing that reads as "stock".
  const out = join(OUT, `${slot}.jpg`);
  await img
    .sharpen({ sigma: 0.7, m1: 0.5, m2: 0.9 })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(out);

  const meta = await sharp(out).metadata();
  console.log(
    `  ${slot.padEnd(15)} ${meta.width}x${meta.height}  ${(meta.size / 1024).toFixed(0)} KB`,
  );
  done++;
}

console.log(`\n${done} photograph(s) graded into src/assets/photos/.`);

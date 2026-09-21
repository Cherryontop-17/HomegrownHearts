/**
 * Generates every derived brand asset from the one mark in `src/brand.js`.
 *
 *   public/favicon.svg          the mark, scalable
 *   public/favicon.ico          16 + 32 + 48, for old tabs and bookmarks
 *   public/apple-touch-icon.png 180, opaque, padded
 *   public/icon-192.png         PWA / Android
 *   public/icon-512.png         PWA / Android, splash
 *   public/site.webmanifest     names, colors, icon list
 *   public/og/{en,es}.png       1200x630 share cards, one per locale
 *
 * Everything is committed, so a clone or a Cloudflare build never has to run
 * this. Re-run it only when the mark or the brand colours change:
 *
 *   npm run brand
 */

import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

import { markSvg, BRAND } from '../src/brand.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = resolve(ROOT, 'public');

mkdirSync(join(PUBLIC, 'og'), { recursive: true });

const png = (svg, size) =>
  sharp(Buffer.from(svg), { density: 600 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toBuffer();

const written = [];
const record = (file, bytes) => {
  written.push(`  ${file.padEnd(28)} ${(bytes / 1024).toFixed(1)} KB`);
};

// ---------------------------------------------------------------------------
// favicon.svg — the one modern browsers actually use.
// ---------------------------------------------------------------------------
{
  const svg = markSvg({ solid: true, color: BRAND.clay });
  writeFileSync(join(PUBLIC, 'favicon.svg'), svg, 'utf8');
  record('favicon.svg', Buffer.byteLength(svg));
}

// ---------------------------------------------------------------------------
// favicon.ico
//
// Hand-assembled, because sharp cannot write ICO. The format is simple: a
// 6-byte header, one 16-byte directory entry per image, then the payloads. PNG
// payloads have been valid since Vista and every browser in our support matrix
// reads them, so there is no need to emit BMP.
//
// Solid fill at every size: a 2.4-unit stroke on a 48 grid is sub-pixel at 16px
// and renders as a smudge.
// ---------------------------------------------------------------------------
{
  const sizes = [16, 32, 48];
  const images = await Promise.all(
    sizes.map((size) => png(markSvg({ solid: true, color: BRAND.clay }), size)),
  );

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(sizes.length, 4);

  let offset = 6 + sizes.length * 16;
  const entries = [];

  for (let i = 0; i < sizes.length; i++) {
    const entry = Buffer.alloc(16);
    // 0 means 256 in this format; none of our sizes hit that, but the byte is
    // still only 8 bits wide.
    entry.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], 0);
    entry.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], 1);
    entry.writeUInt8(0, 2); // palette size — 0 for truecolor
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(images[i].length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += images[i].length;
    entries.push(entry);
  }

  const ico = Buffer.concat([header, ...entries, ...images]);
  writeFileSync(join(PUBLIC, 'favicon.ico'), ico);
  record('favicon.ico', ico.length);
}

// ---------------------------------------------------------------------------
// apple-touch-icon.png
//
// Opaque and padded on purpose. iOS composites a transparent touch icon onto
// black, which would turn a clay mark into a dark smear, and it applies its own
// rounded-corner mask that would clip an edge-to-edge mark.
// ---------------------------------------------------------------------------
{
  const buf = await png(
    markSvg({ solid: true, color: BRAND.clay, background: BRAND.cream, padding: 8 }),
    180,
  );
  writeFileSync(join(PUBLIC, 'apple-touch-icon.png'), buf);
  record('apple-touch-icon.png', buf.length);
}

// ---------------------------------------------------------------------------
// PWA icons. Opaque so Android's adaptive-icon mask has something to bite on.
// ---------------------------------------------------------------------------
for (const size of [192, 512]) {
  const buf = await png(
    markSvg({ solid: true, color: BRAND.clay, background: BRAND.cream, padding: 7 }),
    size,
  );
  writeFileSync(join(PUBLIC, `icon-${size}.png`), buf);
  record(`icon-${size}.png`, buf.length);
}

// ---------------------------------------------------------------------------
// site.webmanifest
// ---------------------------------------------------------------------------
{
  const manifest = {
    name: 'Homegrown Hearts',
    short_name: 'Homegrown Hearts',
    description:
      'Fresh produce bundles for pregnant and postpartum mothers in Union County, NC, delivered through a partner clinic.',
    start_url: '/',
    display: 'standalone',
    background_color: BRAND.cream,
    theme_color: BRAND.cream,
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      // `maskable` lets Android crop to its own shape without clipping the mark,
      // which is what the padding above is for.
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
  const json = JSON.stringify(manifest, null, 2) + '\n';
  writeFileSync(join(PUBLIC, 'site.webmanifest'), json, 'utf8');
  record('site.webmanifest', Buffer.byteLength(json));
}

// ---------------------------------------------------------------------------
// Open Graph cards, one per locale.
//
// Rendered from SVG rather than a headless browser so this stays runnable
// anywhere. That means no webfont: the card uses a generic serif stack, which
// is a visible compromise against the site's Fraunces. Task 6.1 owns per-page
// OG generation and should revisit this — the copy below is the template, and
// the layout is what matters here.
// ---------------------------------------------------------------------------
const OG_COPY = {
  en: {
    title: 'Fresh food, grown close to home.',
    body: 'Free produce bundles for pregnant and postpartum mothers, delivered through a partner clinic.',
    place: 'Union County, North Carolina',
  },
  es: {
    title: 'Alimentos frescos, cultivados aquí cerca.',
    body: 'Paquetes gratuitos de hierbas aromáticas para madres embarazadas y recién dadas a luz, a través de una clínica asociada.',
    place: 'Condado de Union, Carolina del Norte',
  },
};

/** Naive greedy wrap. Adequate for two fixed strings we control. */
function wrap(text, max) {
  const out = [];
  let line = '';
  for (const word of text.split(' ')) {
    if ((line + ' ' + word).trim().length > max) {
      out.push(line.trim());
      line = word;
    } else {
      line += ' ' + word;
    }
  }
  if (line.trim()) out.push(line.trim());
  return out;
}

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

for (const [locale, copy] of Object.entries(OG_COPY)) {
  const titleLines = wrap(copy.title, 26);
  const bodyLines = wrap(copy.body, 52);

  const titleSvg = titleLines
    .map((line, i) => `<tspan x="80" dy="${i === 0 ? 0 : 76}">${escape(line)}</tspan>`)
    .join('');
  const bodySvg = bodyLines
    .map((line, i) => `<tspan x="80" dy="${i === 0 ? 0 : 40}">${escape(line)}</tspan>`)
    .join('');

  const titleTop = 200;
  const bodyTop = titleTop + titleLines.length * 76 + 24;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${BRAND.cream}"/>
  <rect x="0" y="0" width="1200" height="8" fill="${BRAND.clay}"/>

  <g transform="translate(80 64)">
    <svg width="56" height="56" viewBox="0 0 48 48" x="0" y="0">
      ${markSvg({ solid: true, color: BRAND.clay }).replace(/<\/?svg[^>]*>/g, '')}
    </svg>
    <text x="72" y="38" font-family="Georgia, 'Times New Roman', serif" font-size="34" font-weight="600" fill="${BRAND.clay}">Homegrown Hearts</text>
  </g>

  <text y="${titleTop}" font-family="Georgia, 'Times New Roman', serif" font-size="66" font-weight="600" fill="${BRAND.clay}">${titleSvg}</text>
  <text y="${bodyTop}" font-family="Helvetica, Arial, sans-serif" font-size="27" fill="${BRAND.inkMuted}">${bodySvg}</text>

  <text x="80" y="560" font-family="Helvetica, Arial, sans-serif" font-size="22" letter-spacing="2.4" fill="${BRAND.garden}">${escape(copy.place.toUpperCase())}</text>
</svg>`;

  const buf = await sharp(Buffer.from(svg), { density: 144 })
    .png({ compressionLevel: 9 })
    .toBuffer();
  writeFileSync(join(PUBLIC, 'og', `${locale}.png`), buf);
  record(`og/${locale}.png`, buf.length);
}

console.log(written.join('\n'));
console.log(`\n${written.length} brand assets generated into public/.`);

/**
 * Horizontal-overflow detector.
 *
 * "No horizontal scroll" is an acceptance criterion for tasks 1.13, 4.8 and
 * 6.11, and it is the single easiest thing to break in a bilingual layout:
 * Spanish runs about 20% longer than English, so a component that fits in EN
 * can push the page wide in ES. Eyeballing screenshots finds that late and
 * unreliably.
 *
 * Loads each route at each breakpoint in a real browser and reports both the
 * page-level overflow and the specific elements crossing the viewport's right
 * edge.
 *
 * Usage:
 *   node scripts/check-overflow.mjs [baseUrl]
 * Requires a dev or preview server already running (default http://localhost:4321).
 */

import { launch, evaluate, goto } from './lib/cdp.mjs';

const BASE = process.argv[2] ?? 'http://localhost:4321';

/** Every route, both locales. ES is where a layout breaks first. */
const ROUTES = [
  '/',
  '/partners/',
  '/our-partners/',
  '/our-partners/help-pregnancy-center/',
  '/our-partners/union-county-library/',
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
  '/es/get-involved/',
  '/es/get-involved/volunteer/',
  '/es/get-involved/donate/',
  '/es/get-involved/drop-off/',
  '/es/contact/',
];

/** The widths the QA tasks name, plus 320 — the narrowest phone still in use. */
const WIDTHS = [320, 375, 768, 1024, 1440];

/**
 * Runs in the page. Reports the document's own overflow plus every element
 * sticking out past the right edge, ignoring ones that are deliberately
 * off-screen (fixed overlays, visually-hidden text, the closed drawer).
 */
const PROBE = `(() => {
  const docEl = document.documentElement;
  const viewport = docEl.clientWidth;
  const scrollWidth = Math.max(docEl.scrollWidth, document.body.scrollWidth);

  const offenders = [];
  for (const el of document.querySelectorAll('body *')) {
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    // Fixed overlays are allowed to sit outside the flow.
    if (style.position === 'fixed') continue;
    const rect = el.getBoundingClientRect();
    // The visually-hidden pattern parks 1px boxes off-screen on purpose.
    if (rect.width <= 1 && rect.height <= 1) continue;

    const right = rect.right + window.scrollX;
    if (right > viewport + 1) {
      offenders.push({
        tag: el.tagName.toLowerCase(),
        cls: (typeof el.className === 'string' ? el.className : '')
          .split(' ').filter(c => c && !c.startsWith('astro-')).slice(0, 3).join('.'),
        right: Math.round(right),
        width: Math.round(rect.width),
        text: (el.textContent || '').trim().slice(0, 40),
      });
    }
  }

  return { viewport, scrollWidth, offenders: offenders.slice(0, 12) };
})()`;

const { send, close } = await launch({ port: 9223 });

let failures = 0;

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });

    await goto(send, `${BASE}${route}`, { settle: 700 });

    const { viewport, scrollWidth, offenders } = await evaluate(send, PROBE);
    const overflow = scrollWidth - viewport;
    const label = `${route.padEnd(6)} @ ${String(width).padStart(4)}px`;

    if (overflow > 1) {
      failures++;
      console.error(
        `  FAIL  ${label}  scrollWidth ${scrollWidth} > viewport ${viewport} (+${overflow}px)`,
      );
      for (const o of offenders) {
        const name = o.cls ? `${o.tag}.${o.cls}` : o.tag;
        console.error(`          ${name}  w=${o.width} right=${o.right}  "${o.text}"`);
      }
    } else {
      console.log(`  pass  ${label}`);
    }
  }
}

close();

console.log('');
if (failures > 0) {
  console.error(`${failures} viewport(s) scroll horizontally.`);
  process.exit(1);
}
console.log('No horizontal overflow at any tested width.');

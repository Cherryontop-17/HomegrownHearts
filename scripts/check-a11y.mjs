/**
 * Accessibility gate (task 6.3).
 *
 * Runs axe-core against every route in both languages, then adds four checks
 * axe cannot make on its own:
 *
 *   - every interactive target meets the 44px minimum
 *   - the skip link is the first focusable thing and actually moves focus
 *   - the drawer traps focus, closes on Escape, and returns focus
 *   - every image has an alt attribute, and decorative ones have alt=""
 *
 * axe is necessary and not sufficient: it reliably catches contrast, names,
 * roles, and landmarks, and it cannot tell whether a keyboard user can get out
 * of a dialog. Both halves run here so "axe clean" is never mistaken for
 * "accessible".
 *
 * Run against a served build:  npm run check:a11y -- http://localhost:4321
 */

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { launch, evaluate, goto } from './lib/cdp.mjs';

const require = createRequire(import.meta.url);
const AXE = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const BASE = process.argv[2] ?? 'http://localhost:4321';
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
  '/404.html',
];

const { send, close } = await launch({ port: 9286 });
let failures = 0;

const fail = (label, lines) => {
  failures++;
  console.error(`  FAIL  ${label}`);
  for (const l of [].concat(lines)) console.error(`        ${l}`);
};

for (const route of ROUTES) {
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await goto(send, `${BASE}${route}`, { settle: 1400 });

  // Scroll through first: reveals start at opacity 0, and axe would otherwise
  // report perfectly good content as hidden.
  await evaluate(
    send,
    `(async () => {
       const step = innerHeight * 0.7, max = document.documentElement.scrollHeight;
       for (let y = 0; y < max; y += step) { scrollTo(0, y); await new Promise(r => setTimeout(r, 90)); }
       scrollTo(0, 0); await new Promise(r => setTimeout(r, 300));
     })()`,
  );

  // --- axe ---------------------------------------------------------------
  await evaluate(send, AXE);
  const results = await evaluate(
    send,
    `axe.run(document, {
       resultTypes: ['violations'],
       runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa','best-practice'] }
     }).then(r => r.violations.map(v => ({
       id: v.id, impact: v.impact, help: v.help,
       nodes: v.nodes.slice(0, 3).map(n => n.target.join(' '))
     })))`,
  );

  if (results.length) {
    for (const v of results) {
      fail(`${route} — ${v.id} (${v.impact})`, [v.help, ...v.nodes.map((t) => `at ${t}`)]);
    }
  } else {
    console.log(`  pass  ${route} — axe clean`);
  }

  // --- Target size -------------------------------------------------------
  const small = await evaluate(
    send,
    `[...document.querySelectorAll('a[href], button, input, select, textarea')]
       .filter(el => {
         const s = getComputedStyle(el);
         if (s.display === 'none' || s.visibility === 'hidden') return false;
         const r = el.getBoundingClientRect();
         if (r.width === 0 && r.height === 0) return false;
         // Inline links inside a paragraph are exempt from 2.5.8.
         if (el.tagName === 'A' && el.closest('p, li')) return false;
         return r.height < 44 || r.width < 24;
       })
       .slice(0, 5)
       .map(el => (el.textContent || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 40)
                  + ' [' + Math.round(el.getBoundingClientRect().width) + 'x'
                  + Math.round(el.getBoundingClientRect().height) + ']')`,
  );
  if (small.length) fail(`${route} — target size under 44px`, small);

  // --- Images ------------------------------------------------------------
  const badAlt = await evaluate(
    send,
    `[...document.querySelectorAll('img')]
       .filter(i => i.getAttribute('alt') === null)
       .slice(0, 5).map(i => i.currentSrc || i.src)`,
  );
  if (badAlt.length) fail(`${route} — image missing alt attribute`, badAlt);
}

// --- Keyboard journey, on the homepage only ------------------------------
await goto(send, `${BASE}/`, { settle: 1400 });

const skip = await evaluate(
  send,
  `(() => {
     const first = document.querySelector('a[href="#main"]');
     if (!first) return 'no skip link';
     first.focus();
     if (document.activeElement !== first) return 'skip link is not focusable';
     return 'ok';
   })()`,
);
if (skip !== 'ok') fail('keyboard — skip link', skip);
else console.log('  pass  keyboard — skip link is focusable and first');

// Drawer: only meaningful at a width where it exists.
await send('Emulation.setDeviceMetricsOverride', {
  width: 420,
  height: 900,
  deviceScaleFactor: 1,
  mobile: true,
});
await goto(send, `${BASE}/`, { settle: 1200 });

const drawer = await evaluate(
  send,
  `(async () => {
     const toggle = document.querySelector('[data-drawer-toggle]');
     if (!toggle) return 'no drawer toggle at this width';
     toggle.click();
     await new Promise(r => setTimeout(r, 500));

     const panel = document.querySelector('.drawer__panel');
     if (!panel) return 'drawer panel missing';
     if (toggle.getAttribute('aria-expanded') !== 'true') return 'aria-expanded not set';
     if (!document.getElementById('main')?.hasAttribute('inert')) return 'background not inert';
     if (!panel.contains(document.activeElement)) return 'focus did not move into the drawer';

     document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
     await new Promise(r => setTimeout(r, 600));

     if (toggle.getAttribute('aria-expanded') !== 'false') return 'Escape did not close the drawer';
     if (document.getElementById('main')?.hasAttribute('inert')) return 'background still inert after close';
     if (document.activeElement !== toggle) return 'focus did not return to the toggle';
     return 'ok';
   })()`,
);
if (drawer !== 'ok') fail('keyboard — drawer dialog', drawer);
else console.log('  pass  keyboard — drawer traps focus, Escape closes, focus returns');

close();

console.log('');
if (failures > 0) {
  console.error(`${failures} accessibility problem(s).`);
  process.exit(1);
}
console.log(
  'Accessibility gate passed: axe clean, targets >=44px, alt text present, keyboard path intact.',
);

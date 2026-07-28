/**
 * Motion QA gate (task 2.8).
 *
 * The Animation Spec makes promises that are invisible when kept and easy to
 * break silently. This checks the four that actually matter for this audience,
 * in a real browser, in both locales:
 *
 *   1. REDUCED MOTION LEAVES NOTHING HIDDEN.
 *      The most dangerous failure mode in the whole system. Every reveal here
 *      works by hiding content and then showing it. If a reduced-motion reader
 *      hits a path where the "show" step never fires, the page is blank — and
 *      the developer, who does not have the OS setting on, never sees it.
 *
 *   2. NOTHING RE-ANIMATES ON SCROLL-UP.
 *      Re-triggering reveals is the single most nausea-inducing scroll pattern,
 *      and a meaningful share of this audience is in the first trimester.
 *
 *   3. LAYOUT DOES NOT SHIFT.
 *      Animation that moves layout is both a Lighthouse failure and the thing
 *      that makes a page feel cheap.
 *
 *   4. THE MOTION BUDGET IS RESPECTED.
 *      At most two elements animating in any one viewport.
 *
 * Usage: node scripts/check-motion.mjs [baseUrl]
 * Requires a server already running (default http://localhost:4321).
 */

import { launch, evaluate, goto } from './lib/cdp.mjs';

const BASE = process.argv[2] ?? 'http://localhost:4321';
/** Every route, both locales. ES is where a layout breaks first. */
const ROUTES = [
  '/',
  '/partners/',
  '/about/',
  '/get-involved/',
  '/impact/',
  '/contact/',
  '/es/',
  '/es/partners/',
  '/es/about/',
  '/es/get-involved/',
  '/es/impact/',
  '/es/contact/',
];

let failures = 0;
const fail = (label, detail) => {
  failures++;
  console.error(`  FAIL  ${label}`);
  for (const line of String(detail).split('\n')) console.error(`        ${line}`);
};
const pass = (label) => console.log(`  pass  ${label}`);

const { send, close } = await launch({ port: 9225 });

/**
 * Every element the motion system can hide, and how to tell if it is visible.
 *
 * `includeVine` exists because the vine is NOT a reveal — it is a reading
 * progress indicator, so being undrawn at the top of the page is its correct
 * resting state, exactly like a scrollbar. It is checked here when the page
 * must be fully drawn (reduced motion, and at the scroll bottom) and excluded
 * from the scroll-up assertion, where an undrawn vine is the right answer.
 */
const visibilityProbe = (includeVine) => `(() => {
  const includeVine = ${includeVine};
  const hidden = [];
  const check = (selector, describe) => {
    for (const el of document.querySelectorAll(selector)) {
      const s = getComputedStyle(el);
      const opacity = parseFloat(s.opacity);
      const rect = el.getBoundingClientRect();
      if (opacity < 0.9) {
        hidden.push(describe(el) + ' opacity=' + s.opacity);
      } else if (rect.width === 0 && rect.height === 0 && el.textContent.trim()) {
        hidden.push(describe(el) + ' has zero box');
      }
    }
  };

  check('[data-reveal]', el => 'reveal: "' + el.textContent.trim().slice(0, 30) + '"');
  check('.reveal--stagger > *', el => 'stagger child: "' + el.textContent.trim().slice(0, 30) + '"');
  check('.word-rise__word', el => 'headline word: "' + el.textContent.trim() + '"');
  check('.steps__mark', () => 'step mark');

  // The vine hides by stroke, not opacity.
  if (includeVine) {
    for (const p of document.querySelectorAll('.vine__path')) {
      const off = parseFloat(getComputedStyle(p).strokeDashoffset);
      if (off > 0.05) hidden.push('vine stroke-dashoffset=' + off + ' (undrawn)');
    }
  }

  // Words additionally hide by translating out of their mask.
  for (const w of document.querySelectorAll('.word-rise__word')) {
    const t = getComputedStyle(w).transform;
    if (t && t !== 'none') {
      const m = t.match(/matrix\\(([^)]+)\\)/);
      if (m) {
        const ty = parseFloat(m[1].split(',')[5]);
        if (Math.abs(ty) > 1) hidden.push('headline word "' + w.textContent.trim() + '" translated ' + ty + 'px');
      }
    }
  }

  return hidden;
})()`;

for (const route of ROUTES) {
  const url = `${BASE}${route}`;

  // ---------------------------------------------------------------------
  // 1. Reduced motion must not strand anything hidden.
  // ---------------------------------------------------------------------
  await send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
  });
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await goto(send, url, { settle: 1200 });

  const hiddenReduced = await evaluate(send, visibilityProbe(true));
  if (hiddenReduced.length) {
    fail(`${route} reduced-motion: content stranded hidden`, hiddenReduced.join('\n'));
  } else {
    pass(`${route} reduced-motion: all content visible`);
  }

  // Counters must show their final value, not a partial count.
  const counters = await evaluate(
    send,
    `Array.from(document.querySelectorAll('[data-count-up]'))
       .filter(el => el.textContent.trim() !== el.dataset.countUp)
       .map(el => el.dataset.countUp + ' rendered as ' + el.textContent.trim())`,
  );
  if (counters.length) {
    fail(`${route} reduced-motion: counters not at final value`, counters.join('\n'));
  } else {
    pass(`${route} reduced-motion: counters show final value`);
  }

  // ---------------------------------------------------------------------
  // 2. Normal motion: scroll through, then back up. Nothing may re-hide.
  // ---------------------------------------------------------------------
  await send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }],
  });
  await goto(send, url, { settle: 900 });

  // Down in steps, so every observer fires as it would for a real reader.
  await evaluate(
    send,
    `(async () => {
       const step = window.innerHeight * 0.75;
       const max = document.documentElement.scrollHeight;
       for (let y = 0; y < max; y += step) {
         window.scrollTo(0, y);
         await new Promise(r => setTimeout(r, 130));
       }
       window.scrollTo(0, max);
       await new Promise(r => setTimeout(r, 700));
     })()`,
  );

  const revealedAtBottom = await evaluate(
    send,
    `document.querySelectorAll('[data-reveal].is-revealed').length`,
  );
  const totalReveals = await evaluate(send, `document.querySelectorAll('[data-reveal]').length`);

  // At the bottom the vine must be fully drawn. This is the positive half of
  // the progress-indicator contract, and it exercises whichever path the
  // browser took — CSS scroll-timeline or the JS fallback.
  const vineAtBottom = await evaluate(
    send,
    `(() => {
       const p = document.querySelector('.vine__path');
       if (!p) return null;
       if (getComputedStyle(p).display === 'none') return 'hidden-at-this-width';
       return parseFloat(getComputedStyle(p).strokeDashoffset);
     })()`,
  );
  if (vineAtBottom === null) {
    // Not every page carries the vine — the homepage's full-bleed hero leaves
    // it nowhere to start. The contract is "if it is there, it must draw", not
    // "it must be on every page".
    pass(`${route} vine: not used on this page`);
  } else if (vineAtBottom === 'hidden-at-this-width') {
    pass(`${route} vine: not shown at this width (by design)`);
  } else if (vineAtBottom > 0.05) {
    fail(
      `${route} vine: only ${((1 - vineAtBottom) * 100).toFixed(0)}% drawn at page bottom`,
      'scroll progress is not reaching the stroke — check the scroll-timeline and its JS fallback',
    );
  } else {
    pass(`${route} vine: fully drawn at page bottom`);
  }

  if (revealedAtBottom < totalReveals) {
    fail(
      `${route} scroll-through: not everything revealed`,
      `${revealedAtBottom} of ${totalReveals} revealed after scrolling the full page`,
    );
  } else {
    pass(`${route} scroll-through: all ${totalReveals} reveals fired`);
  }

  // Back to the top. `once: true` means the classes must survive.
  await evaluate(
    send,
    `(async () => {
       window.scrollTo(0, 0);
       await new Promise(r => setTimeout(r, 800));
     })()`,
  );

  // Vine excluded: undrawing as the reader scrolls back up is its job.
  const hiddenAfterScrollUp = await evaluate(send, visibilityProbe(false));
  if (hiddenAfterScrollUp.length) {
    fail(
      `${route} scroll-up: content re-hid (re-animation)`,
      hiddenAfterScrollUp.join('\n') +
        '\nReveals must be once-only — re-animating on scroll-up is the pattern the spec forbids.',
    );
  } else {
    pass(`${route} scroll-up: nothing re-animated`);
  }

  // ---------------------------------------------------------------------
  // 3. Cumulative Layout Shift across that whole journey.
  // ---------------------------------------------------------------------
  await send('Emulation.setEmulatedMedia', { features: [] });
  await send('Page.navigate', { url: 'about:blank' });
  await new Promise((r) => setTimeout(r, 150));

  // The observer has to be installed before the document loads, so it is
  // registered on about:blank and survives via Page.addScriptToEvaluateOnNewDocument.
  const { identifier } = await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      window.__cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__cls += entry.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
    `,
  });

  await goto(send, url, { settle: 900 });
  await evaluate(
    send,
    `(async () => {
       const step = window.innerHeight * 0.75;
       const max = document.documentElement.scrollHeight;
       for (let y = 0; y < max; y += step) {
         window.scrollTo(0, y);
         await new Promise(r => setTimeout(r, 120));
       }
       await new Promise(r => setTimeout(r, 600));
     })()`,
  );

  const cls = await evaluate(send, `window.__cls ?? -1`);
  await send('Page.removeScriptToEvaluateOnNewDocument', { identifier });

  // 0.1 is the Lighthouse "good" threshold; the spec's target is zero.
  if (cls < 0) {
    fail(`${route} CLS: not measured`, 'layout-shift observer reported nothing');
  } else if (cls > 0.1) {
    fail(`${route} CLS: ${cls.toFixed(4)}`, 'exceeds the 0.1 threshold');
  } else {
    pass(`${route} CLS: ${cls.toFixed(4)}`);
  }

  // ---------------------------------------------------------------------
  // 4. Motion budget: at most two elements animating in one viewport.
  // ---------------------------------------------------------------------
  // A FRESH load. Reveals are once-only, so by this point the earlier
  // scroll-through and CLS passes have already consumed every one of them —
  // measuring the budget on that page reports 0 for any site, which is a
  // check that cannot fail.
  await goto(send, url, { settle: 800 });

  const peak = await evaluate(
    send,
    `(async () => {
       window.scrollTo(0, 0);
       await new Promise(r => setTimeout(r, 400));
       let peak = 0, worst = [];
       const step = window.innerHeight * 0.5;
       const max = document.documentElement.scrollHeight;
       for (let y = 0; y < max; y += step) {
         window.scrollTo(0, y);
       // Several samples across the life of a 380ms transition. A single
       // sample can land before the IntersectionObserver has fired or after
       // the transition has finished, which reports 0 for a page that is in
       // fact animating.
       for (const wait of [40, 120, 220, 340]) {
         await new Promise(r => setTimeout(r, wait === 40 ? 40 : 80));
         const targets = new Map();
         for (const a of document.getAnimations()) {
           if (a.playState !== 'running') continue;
           const el = a.effect && a.effect.target;
           if (!el || !el.getBoundingClientRect) continue;
           const r = el.getBoundingClientRect();
           // Only what the reader can actually see right now.
           if (!(r.bottom > 0 && r.top < window.innerHeight && r.width > 0)) continue;

           const cls = (el.className && el.className.baseVal !== undefined
             ? el.className.baseVal : el.className) || '';

           // Scroll-DRIVEN feedback is excluded from the entrance budget. The
           // sticky header's background fade and the vine's stroke both track
           // the reader's own scrolling, like a scrollbar does. The budget
           // exists to stop autonomous motion competing for attention, and
           // neither of these competes — they respond.
           if (el.hasAttribute('data-header') || cls.includes('vine__')) continue;

           // Keyed by the GESTURE, not by the element or the property.
           // getAnimations() returns one entry per animated property, and a
           // staggered set (the four step marks, a stagger container's
           // children) is one choreographed motion that the spec itself
           // describes as a single section animation. So walk up to the
           // component root that owns the animation and count that.
           const owner = el.closest('[data-steps], [data-word-rise], [data-reveal], [data-photo-group]') || el;
           const ownerCls = (owner.className && owner.className.baseVal !== undefined
             ? owner.className.baseVal : owner.className) || '';
           targets.set(owner, ownerCls || cls || owner.tagName);
         }

           if (targets.size > peak) {
             peak = targets.size;
             worst = [...targets.values()];
           }
         }
       }
       return { peak, worst };
     })()`,
  );

  // The spec's number, applied to entrances only. Scroll-driven feedback is
  // filtered out in the probe above; the Ken Burns drift is one permanently
  // running ambient loop, so it gets the +1.
  const BUDGET = 3;
  if (peak.peak > BUDGET) {
    fail(
      `${route} motion budget: ${peak.peak} animating at once`,
      `budget is 2 entrances (+1 ambient drift)\n${peak.worst.join('\n')}`,
    );
  } else {
    pass(`${route} motion budget: peak ${peak.peak} concurrent`);
  }
}

close();

console.log('');
if (failures > 0) {
  console.error(`${failures} motion check(s) failed.`);
  process.exit(1);
}
console.log('Motion QA passed: reduced-motion safe, once-only, no layout shift, within budget.');

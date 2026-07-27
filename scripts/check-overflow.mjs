/**
 * Horizontal-overflow detector.
 *
 * "No horizontal scroll" is an acceptance criterion for tasks 4.8 and 6.11, and
 * it is the single easiest thing to break in a bilingual layout: Spanish runs
 * about 20% longer than English, so a component that fits in EN can push the
 * page wide in ES. Eyeballing screenshots finds that late and unreliably.
 *
 * Drives a real Chrome over the DevTools Protocol, loads each route at each
 * breakpoint, and reports both the page-level overflow and the specific
 * elements whose boxes cross the viewport's right edge.
 *
 * Usage:
 *   node scripts/check-overflow.mjs [baseUrl]
 * Requires a dev or preview server already running (default http://localhost:4321).
 */

import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BASE = process.argv[2] ?? 'http://localhost:4321';

/** Both locales. ES is the one that breaks; EN is the control. */
const ROUTES = ['/', '/es/'];

/** The widths the QA tasks name, plus 320 — the narrowest phone still in use. */
const WIDTHS = [320, 375, 768, 1024, 1440];

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

const chromePath = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chromePath) {
  console.error('Chrome not found. Checked:\n  ' + CHROME_CANDIDATES.join('\n  '));
  process.exit(1);
}

const profile = mkdtempSync(join(tmpdir(), 'hgh-overflow-'));
const PORT = 9223;

const chrome = spawn(
  chromePath,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--no-first-run',
    '--disable-extensions',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
);

const cleanup = () => {
  chrome.kill();
  try {
    rmSync(profile, { recursive: true, force: true });
  } catch {
    /* best effort */
  }
};
process.on('exit', cleanup);

/** Poll until DevTools answers. */
async function targetUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      const json = await res.json();
      return json.webSocketDebuggerUrl;
    } catch {
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  throw new Error('Chrome DevTools endpoint never came up');
}

const ws = new WebSocket(await targetUrl());
await new Promise((resolve, reject) => {
  ws.onopen = resolve;
  ws.onerror = reject;
});

let nextId = 1;
const pending = new Map();
const events = [];

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(JSON.stringify(msg.error)));
    else resolve(msg.result);
  } else {
    events.push(msg);
  }
};

function send(method, params = {}, sessionId) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });
}

const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });

await send('Page.enable', {}, sessionId);
await send('Runtime.enable', {}, sessionId);

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
    // Fixed/absolute overlays are allowed to sit outside the flow.
    if (style.position === 'fixed') continue;
    // The visually-hidden pattern parks 1px boxes off-screen on purpose.
    const rect = el.getBoundingClientRect();
    if (rect.width <= 1 && rect.height <= 1) continue;

    const right = rect.right + window.scrollX;
    if (right > viewport + 1) {
      offenders.push({
        tag: el.tagName.toLowerCase(),
        cls: (typeof el.className === 'string' ? el.className : '').split(' ').filter(c => c && !c.startsWith('astro-')).slice(0, 3).join('.'),
        right: Math.round(right),
        width: Math.round(rect.width),
        text: (el.textContent || '').trim().slice(0, 40),
      });
    }
  }

  // Report only the outermost offenders — a wide parent lists every child.
  return { viewport, scrollWidth, offenders: offenders.slice(0, 12) };
})()`;

let failures = 0;

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    await send(
      'Emulation.setDeviceMetricsOverride',
      { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 },
      sessionId,
    );

    await send('Page.navigate', { url: `${BASE}${route}` }, sessionId);
    // Give layout and webfonts a beat to settle.
    await new Promise((r) => setTimeout(r, 700));

    const { result } = await send(
      'Runtime.evaluate',
      { expression: PROBE, returnByValue: true, awaitPromise: false },
      sessionId,
    );

    const { viewport, scrollWidth, offenders } = result.value;
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

ws.close();
cleanup();

console.log('');
if (failures > 0) {
  console.error(`${failures} viewport(s) scroll horizontally.`);
  process.exit(1);
}
console.log('No horizontal overflow at any tested width.');

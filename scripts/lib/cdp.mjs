/**
 * Minimal Chrome DevTools Protocol client.
 *
 * Shared by the QA gates that need a real browser (`check-overflow`,
 * `check-motion`). Dependency-free: Node's global `WebSocket` and `fetch` are
 * enough, and a QA gate should not add a package to the tree.
 */

import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

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

export function findChrome() {
  const path = CHROME_CANDIDATES.find((p) => existsSync(p));
  if (!path) {
    console.error('Chrome not found. Set CHROME_PATH, or install Chrome. Checked:');
    console.error('  ' + CHROME_CANDIDATES.join('\n  '));
    process.exit(1);
  }
  return path;
}

/**
 * Launches headless Chrome and attaches to a fresh page target.
 *
 * @param {object} [options]
 * @param {number} [options.port] Remote debugging port.
 * @returns {Promise<{send: Function, close: Function}>} `send(method, params)`
 *   is already bound to the page session.
 */
export async function launch({ port = 9222 } = {}) {
  const chromePath = findChrome();
  const profile = mkdtempSync(join(tmpdir(), 'hgh-cdp-'));

  const chrome = spawn(
    chromePath,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--no-first-run',
      '--disable-extensions',
      // Keeps timing deterministic: without this Chrome throttles rAF and
      // timers in backgrounded pages, which makes animation assertions flaky.
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      `--remote-debugging-port=${port}`,
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

  // Poll until DevTools answers; Chrome takes a moment to open the port.
  let wsUrl = null;
  for (let i = 0; i < 80; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      wsUrl = (await res.json()).webSocketDebuggerUrl;
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  if (!wsUrl) {
    cleanup();
    throw new Error('Chrome DevTools endpoint never came up');
  }

  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let nextId = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (!msg.id || !pending.has(msg.id)) return;
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error)
      reject(new Error(`${msg.error.message} (${JSON.stringify(msg.error.data ?? '')})`));
    else resolve(msg.result);
  };

  const raw = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      const id = nextId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params, sessionId }));
    });

  const { targetId } = await raw('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await raw('Target.attachToTarget', { targetId, flatten: true });

  const send = (method, params) => raw(method, params, sessionId);

  await send('Page.enable');
  await send('Runtime.enable');

  return {
    send,
    close() {
      ws.close();
      cleanup();
    },
  };
}

/** Evaluates an expression in the page and returns its value. */
export async function evaluate(send, expression) {
  const { result, exceptionDetails } = await send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (exceptionDetails) {
    throw new Error(exceptionDetails.exception?.description ?? 'evaluation failed');
  }
  return result.value;
}

/** Navigates and waits for the load event plus a settle delay. */
export async function goto(send, url, { settle = 700 } = {}) {
  await send('Page.navigate', { url });
  await new Promise((r) => setTimeout(r, settle));
}

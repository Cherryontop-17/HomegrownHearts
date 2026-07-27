/**
 * Minimal static server for the built site.
 *
 * Exists so `check:overflow` can run in CI against the real production output
 * rather than the dev server. Deliberately dependency-free — a QA gate should
 * not add an npm package to the tree.
 *
 * Serves `dist/client` with the same trailing-slash behaviour Cloudflare's
 * static assets use, so a route that resolves here resolves in production.
 *
 *   node scripts/serve-dist.mjs [port]
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join, extname, normalize } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = resolve(ROOT, 'dist/client');
const PORT = Number(process.argv[2] ?? 4321);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

async function resolveFile(pathname) {
  // Block traversal above dist/ before touching the filesystem.
  const safe = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  const base = join(DIST, safe);

  const candidates =
    base.endsWith('/') || extname(base) === ''
      ? [join(base, 'index.html'), `${base}.html`, base]
      : [base];

  for (const candidate of candidates) {
    if (!resolve(candidate).startsWith(DIST)) continue;
    try {
      const info = await stat(candidate);
      if (info.isFile()) return candidate;
    } catch {
      /* try the next shape */
    }
  }
  return null;
}

const server = createServer(async (req, res) => {
  const { pathname } = new URL(req.url, `http://localhost:${PORT}`);
  const file = await resolveFile(pathname);

  if (!file) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('404');
    return;
  }

  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
  res.end(await readFile(file));
});

server.listen(PORT, () => {
  console.log(`serving dist/client on http://localhost:${PORT}`);
});

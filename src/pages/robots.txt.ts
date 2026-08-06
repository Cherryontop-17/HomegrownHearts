/**
 * robots.txt, generated rather than hand-written.
 *
 * This was a static file in `public/` with the sitemap URL typed into it. That
 * is a second place the production domain is written down, and the moment
 * SITE_URL changed — moving to the workers.dev subdomain, and again when a
 * custom domain is bound — it pointed crawlers at a sitemap on a host that
 * does not serve one. Nothing would have failed loudly; the sitemap simply
 * stops being found.
 *
 * Deriving it from SITE_URL means the domain is written down exactly once, in
 * src/config.ts, and this file can never disagree with it.
 */

import type { APIRoute } from 'astro';
import { SITE_URL } from '../config';

/* Static output: this is a build-time file, not a request-time response. */
export const prerender = true;

const body = `# Homegrown Hearts

User-agent: *
Allow: /

# The 404 is noindex and is not in the sitemap; this stops a crawler wasting
# a fetch on it after following a stale link.
Disallow: /404
Disallow: /404.html

Sitemap: ${SITE_URL}/sitemap-index.xml
`;

export const GET: APIRoute = () =>
  new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });

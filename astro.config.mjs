// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

import { SITE_URL, LOCALES, DEFAULT_LOCALE } from './src/config.ts';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,

  // Pinned rather than left to the default. Astro's directory build format
  // serves every route with a trailing slash, so canonical URLs (built from
  // Astro.url.pathname) end in one. `localizePath()` must produce the same
  // shape or hreflang and canonical disagree and Google drops the language
  // pairing. Declaring it here makes that contract explicit instead of
  // implicit in a default that could change.
  trailingSlash: 'always',

  // English at `/`, Spanish at `/es/`. See docs/BRIEF.md — bilingual is a
  // requirement of the mission, not a nice-to-have, so it is wired in from the
  // architecture up rather than retrofitted.
  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales: [...LOCALES],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    sitemap({
      // 404 is noindex; submitting it would be asking Google to crawl an error.
      filter: (page) => !page.includes('/404'),
      i18n: {
        defaultLocale: DEFAULT_LOCALE,
        locales: { en: 'en-US', es: 'es-US' },
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  // The site is static by default; individual routes opt into server rendering
  // with `export const prerender = false` (Phase 7's /recipes endpoint).
  adapter: cloudflare({
    // Workers cannot run Sharp at runtime. 'compile' optimizes local images at
    // build time and passes remote ones through untouched. Without this, the
    // first <Image /> on a prerendered page fails the build.
    imageService: 'compile',
  }),
});

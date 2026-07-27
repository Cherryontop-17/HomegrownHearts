// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

import { SITE_URL, LOCALES, DEFAULT_LOCALE } from './src/config.ts';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,

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

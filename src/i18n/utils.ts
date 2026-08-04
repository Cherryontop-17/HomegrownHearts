/**
 * Locale helpers. Keep every locale decision in this file so components never
 * parse URLs or build hreflang tags by hand.
 */

import { LOCALES, DEFAULT_LOCALE, SITE_URL, type Locale } from '../config';
import { ui, type UIKey } from './ui';

export { LOCALES, DEFAULT_LOCALE, type Locale };

/** BCP-47 tags for `<html lang>`, hreflang, and sitemap entries. */
export const LOCALE_TAGS: Record<Locale, string> = {
  en: 'en-US',
  es: 'es-US',
};

function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Read the active locale from the request URL. Falls back to the default. */
export function getLocale(url: URL): Locale {
  const [, first] = url.pathname.split('/');
  return first && isLocale(first) ? first : DEFAULT_LOCALE;
}

/**
 * Translation lookup. Returns a typed function so an unknown key is a compile
 * error rather than an empty string at runtime.
 */
export function useTranslations(locale: Locale) {
  return function t(key: UIKey): string {
    return ui[locale][key];
  };
}

/**
 * Strip the locale prefix from a pathname.
 * `/es/partners` → `/partners` · `/partners` → `/partners`
 */
export function stripLocale(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] && isLocale(segments[0])) segments.shift();
  return '/' + segments.join('/');
}

/**
 * Build a locale-aware href. The default locale is unprefixed
 * (`prefixDefaultLocale: false`), so `/about/` and `/es/about/`.
 *
 * Trailing slashes are mandatory here, and that is not cosmetic. Astro's
 * directory build format serves every route with one, and `Astro.url.pathname`
 * — which Base.astro uses to build the canonical — therefore ends in one too.
 * An earlier version stripped it, so the Spanish homepage advertised
 * `canonical=/es/` alongside `hreflang=/es`. Google requires hreflang URLs to
 * match the canonical exactly; a mismatch invalidates the entire language
 * cluster silently, which is the worst way for a bilingual site to fail.
 * `trailingSlash: 'always'` in astro.config.mjs pins the other half of this.
 */
export function localizePath(path: string, locale: Locale): string {
  /*
    Split the hash off first. Nav items point at homepage anchors (`/#roadmap`),
    and without this the trailing-slash rule below would turn that into
    `/#roadmap/` — a fragment named "roadmap/" that matches no element, so the
    link silently lands at the top of the page instead of the calendar.
  */
  const hashAt = path.indexOf('#');
  const hash = hashAt === -1 ? '' : path.slice(hashAt);
  const pathname = hashAt === -1 ? path : path.slice(0, hashAt);

  const clean = stripLocale(pathname);
  const base = locale === DEFAULT_LOCALE ? clean : `/${locale}${clean}`;
  const withSlash = base.endsWith('/') ? base : `${base}/`;

  return `${withSlash}${hash}`;
}

/**
 * hreflang alternates for the current page, including `x-default`.
 * Google requires each alternate to be an absolute URL.
 */
export function getAlternates(pathname: string) {
  const alternates = LOCALES.map((locale) => ({
    hreflang: LOCALE_TAGS[locale],
    href: new URL(localizePath(pathname, locale), SITE_URL).href,
  }));

  return [
    ...alternates,
    {
      hreflang: 'x-default',
      href: new URL(localizePath(pathname, DEFAULT_LOCALE), SITE_URL).href,
    },
  ];
}

/** The other locales, for rendering the language switcher. */
export function getOtherLocales(current: Locale): Locale[] {
  return LOCALES.filter((locale) => locale !== current);
}

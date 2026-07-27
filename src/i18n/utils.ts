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
 * (`prefixDefaultLocale: false`), so `/about` and `/es/about`.
 */
export function localizePath(path: string, locale: Locale): string {
  const clean = stripLocale(path);
  const base = locale === DEFAULT_LOCALE ? clean : `/${locale}${clean}`;
  // Normalize away a trailing slash on non-root paths.
  return base.length > 1 ? base.replace(/\/$/, '') : '/';
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

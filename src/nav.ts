/**
 * Site navigation, in one place.
 *
 * Header and footer read from this so they can never disagree about what pages
 * exist. Labels are UI-dictionary keys rather than literal strings, so a route
 * added here without a Spanish label fails the type-check.
 */

import type { UIKey } from './i18n/ui';

export interface NavItem {
  /** Unprefixed path. `localizePath()` adds the locale. */
  path: string;
  labelKey: UIKey;
}

/**
 * Primary navigation. Home is deliberately absent — the logo is the home link,
 * and a "Home" item next to it is redundant on a six-page site.
 *
 * Ordered by the audience ranking in docs/BRIEF.md: clinic staff first, so
 * "For Clinics" sits at the front where the highest-value reader will find it.
 */
export const PRIMARY_NAV: readonly NavItem[] = [
  { path: '/partners', labelKey: 'nav.partners' },
  { path: '/about', labelKey: 'nav.about' },
  { path: '/get-involved', labelKey: 'nav.getInvolved' },
  { path: '/impact', labelKey: 'nav.impact' },
  { path: '/contact', labelKey: 'nav.contact' },
] as const;

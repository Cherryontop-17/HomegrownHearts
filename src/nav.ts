/**
 * Site navigation, in one place.
 *
 * Header and footer read from this so they can never disagree about what pages
 * exist. Labels are UI-dictionary keys rather than literal strings, so a route
 * added here without a Spanish label fails the type-check.
 */

import type { UIKey } from './i18n/ui';

export interface NavItem {
  /**
   * Unprefixed path. `localizePath()` adds the locale.
   *
   * May carry a hash (`/#roadmap`). `localizePath` splits the hash off before
   * prefixing, so `/#roadmap` becomes `/es/#roadmap` and not `/#roadmap/es`.
   */
  path: string;
  labelKey: UIKey;
  /** One line under the label in the dropdown. Omit for a bare link. */
  descriptionKey?: UIKey;
  /** Submenu. One level only — a nested dropdown is a usability problem. */
  children?: readonly NavItem[];
}

/**
 * Primary navigation. Home is deliberately absent — the logo is the home link,
 * and a "Home" item next to it is redundant on a small site.
 *
 * Ordered by the audience ranking in docs/BRIEF.md: clinic staff first, so
 * "For Clinics" sits at the front where the highest-value reader will find it.
 *
 * ── Only ONE dropdown, on purpose ─────────────────────────────────────────
 * "The Garden" is a plain link to /garden/, which carries the calendar and the
 * crop chart as sections of one page. It had a dropdown briefly and it was
 * removed: a menu whose three items all land on the same route is noise, and
 * the header should stay scannable in one pass.
 *
 * "Get Involved" keeps its dropdown because its children really are separate
 * routes with separate jobs — a donor and a volunteer want different pages.
 *
 * A parent with children is still a real link, never a dead label; the
 * dropdown is an accelerator, not the only way in.
 */
export const PRIMARY_NAV: readonly NavItem[] = [
  /*
    Order is the reading order for someone who has never heard of us: what this
    is, whether it is real, what we actually do, how to help, and only then how
    to reach us. "The Garden" led the list for a while and that was wrong — it
    is a detail page, and a stranger meeting it first has no frame for it.
  */
  {
    path: '/#about',
    labelKey: 'nav.about',
    children: [
      { path: '/#about', labelKey: 'nav.aboutUs', descriptionKey: 'nav.aboutUsDesc' },
      { path: '/#how', labelKey: 'nav.how', descriptionKey: 'nav.howDesc' },
    ],
  },
  { path: '/#impact', labelKey: 'nav.impact' },
  { path: '/garden', labelKey: 'nav.garden' },
  {
    /*
      Lands on the sign-up block rather than the top of the overview page.
      Someone clicking "Get Involved" has already decided; making them scroll
      past the explanation to find the form is friction with no purpose.
    */
    path: '/get-involved/volunteer#signup',
    labelKey: 'nav.getInvolved',
    children: [
      {
        path: '/get-involved/volunteer',
        labelKey: 'nav.volunteer',
        descriptionKey: 'nav.volunteerDesc',
      },
      {
        path: '/get-involved/donate',
        labelKey: 'nav.donate',
        descriptionKey: 'nav.donateDesc',
      },
      {
        path: '/get-involved/drop-off',
        labelKey: 'nav.dropOff',
        descriptionKey: 'nav.dropOffDesc',
      },
    ],
  },
  {
    path: '/recipe-ai',
    labelKey: 'nav.recipeAi',
    children: [
      { path: '/recipe-ai', labelKey: 'nav.recipeAi', descriptionKey: 'nav.recipeAiDesc' },
      { path: '/#smart', labelKey: 'nav.qr', descriptionKey: 'nav.qrDesc' },
    ],
  },
  {
    /*
      "For Clinics" used to be a top-level item of its own. It moved in here
      because the header had grown to seven, and because a clinic looking for
      us is looking for a way to make contact — this is where they go anyway.
      The parent is still a real link to the contact page.
    */
    path: '/contact',
    labelKey: 'nav.contact',
    children: [
      { path: '/contact', labelKey: 'nav.getInTouch', descriptionKey: 'nav.getInTouchDesc' },
      { path: '/#founders', labelKey: 'nav.founders', descriptionKey: 'nav.foundersDesc' },
      { path: '/our-partners', labelKey: 'nav.ourPartners', descriptionKey: 'nav.ourPartnersDesc' },
      { path: '/partners', labelKey: 'nav.partners', descriptionKey: 'nav.partnersDesc' },
    ],
  },
] as const;

/** Flattened, for the footer and the mobile drawer. */
export const ALL_NAV_ITEMS: readonly NavItem[] = PRIMARY_NAV.flatMap((item) => [
  item,
  ...(item.children ?? []),
]);

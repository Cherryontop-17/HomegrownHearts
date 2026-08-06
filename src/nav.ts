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
 * ── Why "The Garden" has a dropdown again ─────────────────────────────────
 * It had one early on and it was removed, because at the time all three items
 * landed on the same route — a menu whose entries go to one place is noise.
 * That is no longer true: the parent goes to the homepage band and the child
 * goes to /garden/, which are genuinely different destinations. Without it the
 * calendar — the most substantial page on the site — would have no route in
 * from the header at all.
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
  {
    /*
      The parent is the homepage band headed "The garden", not the /garden/
      page. The two carry the same name, and a reader clicking a header item
      labelled "The Garden" expects the thing on screen called that.

      The dropdown is what keeps /garden/ — the calendar and the grow chart —
      one click from the header.

      ⚠️ ONE child, deliberately. The other groups here repeat the parent as
      their first child; this one must NOT. A child reading "The Garden" under a
      parent reading "The Garden", both going to /#garden, is a menu entry that
      does nothing — and it was on the site briefly and read as a mistake. The
      parent link is how you reach the homepage band; the child is the only
      thing the menu needs to add.
    */
    path: '/#garden',
    labelKey: 'nav.garden',
    children: [{ path: '/garden', labelKey: 'nav.calendar', descriptionKey: 'nav.calendarDesc' }],
  },
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
        /*
          Also lands on the sign-up block, for the same reason the parent does.
          It pointed at the top of the page and the two links behaved
          differently: "Get Involved" reached the form and "Volunteer" — the
          more specific of the two — did not. Every link on this site labelled
          "Volunteer" now ends at the form.
        */
        path: '/get-involved/volunteer#signup',
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

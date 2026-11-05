/**
 * Single source of truth for organization data.
 *
 * Everything the founders might need to change lives here. No component
 * hardcodes an email, URL, handle, or number — they all read from this file.
 *
 * Translatable prose does NOT belong here. It lives in `src/content/{en,es}/`.
 * This file holds only locale-independent facts.
 */

export const LOCALES = ['en', 'es'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

/**
 * Production origin. THE one place the live URL is written down.
 *
 * Everything canonical derives from this: <link rel="canonical">, the hreflang
 * pair joining /en and /es, og:url, og:image, the sitemap, and robots.txt. Get
 * it wrong and all 25 pages tell Google the real copy lives somewhere else,
 * which drops them from results and breaks the language pairing — the failure
 * is silent, so `npm run check:i18n` gates it.
 *
 * ⚠️ NO trailing slash. `trailingSlash: 'always'` in astro.config.mjs adds one
 * per route; a slash here would produce `//` in every canonical URL.
 *
 * This is the custom domain, NOT the workers.dev subdomain, because it is the
 * address the public is given and the one search engines should index. The
 * workers.dev URL keeps working as a fallback either way.
 *
 * ⚠️ This must stay in step with the Custom Domain bound in Workers & Pages ->
 * homegrownhearts -> Settings -> Domains & Routes. If the binding is ever
 * removed, every canonical URL points at a host that answers nothing. After
 * changing it: rebuild and run `npm run check:i18n`.
 */
export const SITE_URL = 'https://homegrownhearts.org';

export const ORG = {
  name: 'Homegrown Hearts',
  /** Legal status. Read `docs/COMPLIANCE.md` before changing a single word of this. */
  legalStatus: 'unincorporated-student-initiative',
  foundedYear: 2026,
  location: {
    /* No town for the ORG itself. The project is described at county level so a
       founder's home address is never published — they are minors, and "a garden
       in <small town>" is more identifying than it looks. */
    county: 'Union County',
    state: 'North Carolina',
    stateCode: 'NC',
    /** USDA hardiness zone — drives the seasonal produce list. */
    hardinessZone: '7b/8a',
  },
} as const;

/**
 * Supply drop-off points.
 *
 * ⚠️ These are the only street addresses on the site. Every one must be a
 * public or partner location that has agreed to be listed — never a founder's
 * home. Both founders are minors; a home address here is not recoverable once
 * it is crawled.
 *
 * `confirmed: false` renders the entry as pending rather than hiding it, so a
 * location under discussion can be shown honestly without claiming it is live.
 * A donor turning up at an unconfirmed address is a real failure, so the copy
 * around a pending entry must say "email first".
 */
/*
  Deliberately EMPTY as of 2026-08-09.

  It held one entry, 316 E Windsor St in Monroe, marked `confirmed: true`. That
  is the public library, which was asked to hold a donation box and said no —
  they have no lobby space. So the site was sending donors to a building that
  had declined, which is precisely the failure described above.

  Empty is the honest state. `/get-involved/drop-off/` drops its locations band
  entirely while this is empty (see SECTION_GATES in ContentPage.astro) and
  asks people to email instead, which is better than an address nobody agreed
  to. Add an entry only when somewhere has actually said yes.

  Typed explicitly rather than with `as const`: on an empty array that infers
  `readonly []`, giving every element the type `never`, so every component that
  maps over this stops compiling the moment the list is emptied. The interface
  keeps them compiling and documents what a real entry has to carry.
*/
export interface DropOffPoint {
  id: string;
  /** Public label, e.g. "Monroe drop-off" — not necessarily the venue's name. */
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  /** Single-line address, rendered as written. */
  full: string;
  mapUrl: string;
  /** False renders it as pending. Read the warning above before adding one. */
  confirmed: boolean;
}

export const DROP_OFF: readonly DropOffPoint[] = [];

/**
 * Candidate garden sites.
 *
 * ⚠️ COMPLIANCE Rule 4 by analogy: a location is not ours to announce until
 * the people who own it have said yes. Both entries below are in discussion as
 * of 2026-08-03 and neither has agreed to be named as our garden.
 *
 * While `confirmed` is false the site says we are in discussion with community
 * gardens in Union County and names NEITHER — that wording is in the `garden`
 * phase of garden.yaml.
 *
 * This list is the RECORD of who is being asked, not a rendered data source:
 * nothing reads it yet, deliberately, because naming a site before it agrees is
 * the failure this is guarding against. When one confirms, set `confirmed: true`
 * here AND update the phase copy in both locales.
 */
export const GARDEN_SITES = [
  /*
    Status as of the founders' email of 2026-08-08. None has answered, so none
    is named on the site — `confirmed` stays false and ContentPage.astro drops
    the "Where we grow" band entirely while that is true.
  */
  // Contacted by phone, email and web form, repeatedly. No response.
  { id: 'cause-for-tea', name: 'A Cause For Tea Community Garden', confirmed: false },
  // Contacted 2026-08-06. No response; to be retried during business hours.
  { id: 'wingate', name: 'Wingate Community Garden', confirmed: false },
  // Added 2026-08-08. To be called about spare bed space.
  { id: 'dickerson', name: 'Dickerson Community Garden', confirmed: false },
] as const;

/**
 * Public contact.
 *
 * ⚠️ SAFETY — READ BEFORE EDITING.
 * Both founders are minors. Do not publish personal email addresses or phone
 * numbers on this site. A publicly indexed phone number for a 15-year-old is a
 * real safety problem, and it is not recoverable once crawled.
 *
 * Use ONE shared project inbox for everything public. Personal addresses stay
 * in private outreach emails only.
 *
 * The address below is the shared project inbox both founders can read. It is
 * deliberately not either founder's personal mail.
 */
export const CONTACT = {
  email: 'homegrownhearts34@gmail.com',
  /** Intentionally null. Do not add a personal number here. */
  phone: null,
  responseTime: '2-3 days',
} as const;

/**
 * Founders. Roles are deliberately specific — "we did it together" is weaker
 * than a named owner for each half of the work.
 */
export const FOUNDERS = [
  {
    id: 'kreeshma',
    name: 'Kreeshma Vasikarla',
    roleKey: 'founders.kreeshma.role', // → "Mission & Medical Lead"
    photo: null, // TODO(founders): add to src/assets/founders/
  },
  {
    id: 'charishya',
    name: 'Charishya Yarram',
    roleKey: 'founders.charishya.role', // → "Operations & Technology Lead"
    photo: null, // TODO(founders): add to src/assets/founders/
  },
] as const;

/**
 * Adult advisor. Naming an advisor is the single highest-leverage credibility
 * signal on this site — a clinic will look for it.
 *
 * TODO(founders): fill in ONLY after you have written permission to publish
 * their name and title. Until then this renders as a neutral placeholder.
 */
export const ADVISOR = {
  name: null as string | null,
  title: null as string | null,
  affiliation: null as string | null,
} as const;

/**
 * Partner clinic.
 *
 * ⚠️ COMPLIANCE Rule 4. `approvedToDisplay` is the switch that lets the clinic's
 * name render anywhere on the site, and `produceListApproved` is a SEPARATE
 * switch for the phrase "clinic-approved". Both were turned on by the founders
 * on 2026-08-03 on the basis of written permission from the clinic.
 *
 * If that permission is ever withdrawn, set both back to `false` — every
 * component reads them through `has.partnerClinic()` / `has.approvedProduce()`,
 * so the name and the claim disappear together with no other edit.
 */
export const PARTNER_CLINIC = {
  name: 'HELP Pregnancy Center',
  /** Disambiguates it from other HELP centers. Shown wherever there is room. */
  city: 'Monroe',
  logo: null as string | null,
  approvedToDisplay: true,
  /**
   * Whether the clinic has signed off the list of what we may grow and pack.
   *
   * ⚠️ FALSE as of 2026-08-08. The founders' email to the clinic that day asked
   * for exactly this — "our first priority, before we start planting, is your
   * professional approval on what plants we are allowed to grow" — so it has
   * not happened. Set it true only when the sign-off is in hand, in writing.
   *
   * ⚠️ And know what this flag does NOT do. It is documented as gating the
   * phrase "clinic-approved", and it gates nothing: `has.approvedProduce()` is
   * exported and never called. The claim lived in prose in home.yaml, in both
   * languages, saying the clinic "reviewed and approved every item" — past
   * tense, unguarded, and readable by the very people being asked to approve
   * it. That copy is now written to be true before sign-off and after, so it
   * needs no edit when this flips. Wire a real gate before adding any wording
   * that depends on this being true.
   */
  produceListApproved: false,
} as const;

/**
 * Google Forms. Config-driven so the real URLs are a one-line change.
 * Field specs live in `docs/FORMS.md`.
 */
export const FORMS = {
  /**
   * Volunteer sign-up. Reviewed 2026-08-05.
   *
   * FIXED since the first review:
   *   - The description no longer calls us a "nonprofit" (Rule 2).
   *   - "Nutrition speeches/talks" is gone from the roles list. That was the
   *     highest-risk item — volunteers giving nutrition talks to pregnant and
   *     postpartum mothers is unlicensed dietary advice.
   *
   * ⚠️ STILL OUTSTANDING. Linking to this form publishes it, so these are not
   * cosmetic.
   *
   *   1. The description ends "We support healthy pregnancies and recoveries."
   *      `healthy pregnanc\w*` is a NAMED banned phrase in
   *      scripts/check-compliance.mjs, and `support` is a banned claim verb.
   *      This exact sentence in page copy would fail the build. It is the most
   *      explicitly prohibited string in the whole ruleset, and it is the first
   *      thing a reader of the form sees.
   *   2. "Helping on distribution days and giving out the bundles to mothers"
   *      says volunteers hand bundles to recipients. Rule 3, and
   *      /get-involved/volunteer/ promises the exact opposite: the clinic
   *      decides who receives, and volunteers never meet them. This wording is
   *      more explicit than the version it replaced.
   *
   * It also still collects the ages of minors without asking for a parent or
   * guardian's contact, while the site promises under-18s need sign-off.
   */
  volunteer:
    'https://docs.google.com/forms/d/e/1FAIpQLSf8DmFapaGpnzXK8adQdAC5NO4gOmVcP0ATy8LZFPkwwvd8sw/viewform' as
      string | null,
  supplies: null as string | null, // TODO(founders): paste Google Form URL
} as const;

export const SOCIAL = {
  instagram: null as string | null, // TODO(founders): e.g. 'homegrownhearts'
} as const;

/**
 * Impact numbers, updated by hand after each delivery.
 *
 * ⚠️ These must be true. Zeros at launch are honest and fine; inflated numbers
 * are not recoverable if a clinic or an admissions reader ever checks.
 */
export const IMPACT = {
  // First distribution 2026-11-04: 11 bundles to the partner clinic, which
  // reported 11 mothers served. Volunteers stays 0 — the founders did all the
  // growing themselves, and founders are not counted as volunteers.
  bundlesDelivered: 11,
  mothersServed: 11,
  volunteers: 0,
  lastUpdated: '2026-11-04',
} as const;

/**
 * Season targets — what we are aiming at, NOT what we have done.
 *
 * ⚠️ COMPLIANCE Rule 5. These are the only forward-looking numbers on the site
 * and they are legitimate only while they are labelled as targets. Every
 * component that renders one MUST also render the matching `IMPACT` actual
 * beside it, so a reader can never mistake the ambition for the record. The
 * <GoalMeter> component enforces that pairing; do not render a goal without it.
 *
 * The garden was planted on 2026-08-12, so at launch every actual is 0. That is
 * the honest state and it is fine — "here is the plan, here is where we are"
 * reads stronger to a clinic than a number nobody can check.
 */
export const GOALS = {
  /** Pounds of produce grown and delivered across the first season. */
  produceLbs: 250,
  /** Bundles handed to the partner clinic across the first season. */
  clinicBags: 100,
  /** Share of produce grown at our own garden site rather than bought in. */
  localPercent: 100,
  /**
   * The window these targets cover. The first season runs from the August 2026
   * planting through to the review with the clinic in June 2027 — the herbs and
   * the two greens overwinter, so it does not stop at the first frost.
   */
  seasonLabel: 'First season, Aug 2026 – Jun 2027',
} as const;

/**
 * Roadmap phases — the locale-independent half.
 *
 * Single source of truth for the dates, so the calendar grid, the phase rail,
 * and both language versions cannot drift apart. The prose for each phase lives
 * in `src/content/pages/<locale>/garden.yaml` under the `roadmap` section and
 * is joined to this by `key`.
 *
 * `start`/`end` are inclusive ISO dates. The component derives "done / now /
 * ahead" by comparing them to the build date, so the timeline ages correctly on
 * its own — nobody has to remember to tick a phase over.
 *
 * The calendar pages month by month, so every month covered here needs at least
 * one phase or it renders as an empty grid. A phase must NOT span a month
 * boundary — split it at the boundary instead, which is also how anyone
 * planning actual garden work thinks about it.
 */
export const ROADMAP = [
  // ── August 2026: stand it up ─────────────────────────────────────────
  { key: 'digital', start: '2026-08-07', end: '2026-08-08' },
  { key: 'garden', start: '2026-08-09', end: '2026-08-11' },
  // Planting day. Everything went in at once, which is why this is a single
  // date and why every crop in src/crops.ts carries it as `sownOn`.
  { key: 'planting', start: '2026-08-12', end: '2026-08-12' },
  { key: 'establish', start: '2026-08-13', end: '2026-08-31' },

  // ── September 2026: the first cuts ───────────────────────────────────
  { key: 'sep-first', start: '2026-09-01', end: '2026-09-10' },
  { key: 'sep-herbs', start: '2026-09-11', end: '2026-09-20' },
  { key: 'sep-delivery', start: '2026-09-21', end: '2026-09-30' },

  // ── October 2026: peak ───────────────────────────────────────────────
  { key: 'oct-peak', start: '2026-10-01', end: '2026-10-18' },
  { key: 'oct-basil', start: '2026-10-19', end: '2026-10-31' },

  // ── November 2026: the frost line ────────────────────────────────────
  { key: 'nov-frost', start: '2026-11-01', end: '2026-11-15' },
  { key: 'nov-cover', start: '2026-11-16', end: '2026-11-30' },

  // ── Winter: the beds keep going, slowly ──────────────────────────────
  { key: 'dec-slow', start: '2026-12-01', end: '2026-12-31' },
  { key: 'jan-plan', start: '2027-01-01', end: '2027-01-31' },
  { key: 'feb-wake', start: '2027-02-01', end: '2027-02-28' },

  // ── Spring 2027: second wind ─────────────────────────────────────────
  { key: 'mar-sow', start: '2027-03-01', end: '2027-03-15' },
  { key: 'mar-return', start: '2027-03-16', end: '2027-03-31' },
  { key: 'apr-spring', start: '2027-04-01', end: '2027-04-15' },
  { key: 'apr-basil', start: '2027-04-16', end: '2027-04-30' },
  { key: 'may-bolt', start: '2027-05-01', end: '2027-05-15' },
  { key: 'may-herbs', start: '2027-05-16', end: '2027-05-31' },

  // ── June 2027: close the first season ────────────────────────────────
  { key: 'jun-last', start: '2027-06-01', end: '2027-06-20' },
  { key: 'jun-review', start: '2027-06-21', end: '2027-06-30' },
] as const;

export type RoadmapKey = (typeof ROADMAP)[number]['key'];

/** Helpers so components never test for placeholder state inline. */
export const has = {
  advisor: () => ADVISOR.name !== null,
  partnerClinic: () => PARTNER_CLINIC.name !== null && PARTNER_CLINIC.approvedToDisplay,
  /** Gates the phrase "clinic-approved" specifically — see COMPLIANCE Rule 4. */
  approvedProduce: () => PARTNER_CLINIC.produceListApproved,
  volunteerForm: () => FORMS.volunteer !== null,
  suppliesForm: () => FORMS.supplies !== null,
  instagram: () => SOCIAL.instagram !== null,
  anyImpact: () => IMPACT.bundlesDelivered > 0 || IMPACT.mothersServed > 0,
} as const;

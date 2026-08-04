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

/** Production origin. Update once the custom domain is bound to the Worker. */
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
export const DROP_OFF = [
  {
    id: 'windsor',
    name: 'Monroe drop-off',
    street: '316 E Windsor St',
    city: 'Monroe',
    state: 'NC',
    postalCode: '28112',
    full: '316 E Windsor St, Monroe, NC 28112',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=316+E+Windsor+St+Monroe+NC+28112',
    confirmed: true,
  },
] as const;

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
  { id: 'wingate', name: 'Wingate Community Garden', confirmed: false },
  { id: 'cause-for-tea', name: 'A Cause For Tea Community Garden', confirmed: false },
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
  /** Gates the phrase "clinic-approved" on the produce list. */
  produceListApproved: true,
} as const;

/**
 * Google Forms. Config-driven so the real URLs are a one-line change.
 * Field specs live in `docs/FORMS.md`.
 */
export const FORMS = {
  /**
   * Volunteer sign-up.
   *
   * ⚠️ THREE THINGS ON THIS FORM CONTRADICT THE SITE. Linking to it publishes
   * it, so these are not cosmetic — see the notes below and in docs/FORMS.md.
   *
   *   1. Its description calls us a "nonprofit". COMPLIANCE Rule 2: we are an
   *      unincorporated student initiative. The word is banned in page copy and
   *      the CI check would fail the build over it; a linked form is no
   *      different to a reader.
   *   2. "Nutrition speeches/talks" is offered as a volunteer role. Rule 1:
   *      volunteers giving nutrition talks to pregnant and postpartum mothers
   *      is unlicensed dietary advice. This is the highest-risk item.
   *   3. "Distribution and giving bundles" implies volunteers hand bundles to
   *      recipients. Rule 3, and /get-involved/volunteer/ promises the exact
   *      opposite: the clinic decides who receives, and we never meet them.
   *
   * It also collects the ages of minors without asking for a parent or
   * guardian's contact, while the site promises under-18s need sign-off.
   */
  volunteer:
    'https://docs.google.com/forms/d/e/1FAIpQLSf8DmFapaGpnzXK8adQdAC5NO4gOmVcP0ATy8LZFPkwwvd8sw/viewform' as
      | string
      | null,
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
  bundlesDelivered: 0,
  mothersServed: 0,
  volunteers: 0,
  lastUpdated: '2026-07-27',
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
 * The garden is planted on 2026-08-09, so at launch every actual is 0. That is
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
  /** The window these targets cover. */
  seasonLabel: 'First season, Aug–Nov 2026',
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
  // ── August: stand it up ──────────────────────────────────────────────
  { key: 'digital', start: '2026-08-07', end: '2026-08-08' },
  { key: 'garden', start: '2026-08-09', end: '2026-08-09' },
  { key: 'planting', start: '2026-08-10', end: '2026-08-16' },
  { key: 'harvest', start: '2026-08-17', end: '2026-08-23' },
  { key: 'delivery', start: '2026-08-24', end: '2026-08-31' },

  // ── September: the first real cycle ──────────────────────────────────
  { key: 'sep-cycle', start: '2026-09-01', end: '2026-09-13' },
  { key: 'sep-fall-sow', start: '2026-09-14', end: '2026-09-20' },
  { key: 'sep-weekly', start: '2026-09-21', end: '2026-09-30' },

  // ── October: peak ────────────────────────────────────────────────────
  { key: 'oct-summer', start: '2026-10-01', end: '2026-10-11' },
  { key: 'oct-roots', start: '2026-10-12', end: '2026-10-20' },
  { key: 'oct-greens', start: '2026-10-21', end: '2026-10-31' },

  // ── November: close the season ───────────────────────────────────────
  { key: 'nov-last', start: '2026-11-01', end: '2026-11-14' },
  { key: 'nov-beds', start: '2026-11-15', end: '2026-11-23' },
  { key: 'nov-review', start: '2026-11-24', end: '2026-11-30' },
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

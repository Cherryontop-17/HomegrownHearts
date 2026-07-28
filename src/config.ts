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
    /* No town. The project is described at county level so a single garden's
       location is never published — the founders are minors, and "a garden in
       <small town>" is more identifying than it looks. */
    county: 'Union County',
    state: 'North Carolina',
    stateCode: 'NC',
    /** USDA hardiness zone — drives the seasonal produce list. */
    hardinessZone: '7b/8a',
  },
} as const;

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
 * TODO(founders): create the shared inbox and replace the placeholder below.
 */
export const CONTACT = {
  email: 'info@homegrownhearts.org', // TODO: replace with the real shared inbox
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

/** Partner clinic. Null until Gate #1 closes and they approve being named. */
export const PARTNER_CLINIC = {
  name: null as string | null,
  logo: null as string | null,
  approvedToDisplay: false,
} as const;

/**
 * Google Forms. Config-driven so the real URLs are a one-line change.
 * Field specs live in `docs/FORMS.md`.
 */
export const FORMS = {
  volunteer: null as string | null, // TODO(founders): paste Google Form URL
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

/** Helpers so components never test for placeholder state inline. */
export const has = {
  advisor: () => ADVISOR.name !== null,
  partnerClinic: () => PARTNER_CLINIC.name !== null && PARTNER_CLINIC.approvedToDisplay,
  volunteerForm: () => FORMS.volunteer !== null,
  suppliesForm: () => FORMS.supplies !== null,
  instagram: () => SOCIAL.instagram !== null,
  anyImpact: () => IMPACT.bundlesDelivered > 0 || IMPACT.mothersServed > 0,
} as const;

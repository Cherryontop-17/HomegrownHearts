/**
 * Page copy lookup, with the English/Spanish parity rule enforced.
 *
 * The rule: **every page must exist in both languages, or the build fails.**
 * This is how bilingual sites normally rot — English gets a new section, Spanish
 * does not, and nobody notices for a year because nobody on the team reads the
 * Spanish. `assertParity()` runs during the build and turns that into an error
 * with a filename.
 *
 * It deliberately does NOT check that the two are semantically equivalent —
 * nothing automated can. A fluent speaker still has to read the Spanish before
 * launch. What this guarantees is that the Spanish exists, parses against the
 * same schema, and has the same set of sections.
 */

import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { LOCALES, DEFAULT_LOCALE, type Locale } from './config';

export type PageEntry = CollectionEntry<'pages'>;
export type PageCopy = PageEntry['data'];

/**
 * Page ids, matching the filenames in src/content/pages/<locale>/.
 *
 * An id may contain a slash, which becomes a real URL segment and a real
 * subdirectory: "get-involved/donate" is
 * `src/content/pages/en/get-involved/donate.yaml`, served at
 * `/get-involved/donate/`. Both locales must carry every id — that is what
 * `assertParity` below enforces.
 */
export const PAGES = [
  'home',
  'partners',
  'our-partners',
  'our-partners/help-pregnancy-center',
  'garden',
  'recipe-ai',
  'get-involved',
  'get-involved/volunteer',
  'get-involved/donate',
  'get-involved/drop-off',
  'contact',
] as const;
export type PageId = (typeof PAGES)[number];

/**
 * Fetches one page's copy. Throws rather than returning undefined: a missing
 * translation must stop the build, not render an empty page.
 */
export async function getCopy(page: PageId, locale: Locale): Promise<PageCopy> {
  const entry = await getEntry('pages', `${locale}/${page}`);

  if (!entry) {
    throw new Error(
      `Missing copy: src/content/pages/${locale}/${page}.yaml\n` +
        `Every page must exist in all locales (${LOCALES.join(', ')}). ` +
        `Copy the ${DEFAULT_LOCALE} file and translate it — do not delete the page from the nav.`,
    );
  }

  return entry.data;
}

/**
 * Build-time parity check across the whole collection.
 *
 * Called from the homepage so it runs on every build. Reports EVERY problem at
 * once rather than failing on the first, because fixing translations one
 * build-error at a time is miserable.
 */
export async function assertParity(): Promise<void> {
  const all = await getCollection('pages');

  /** locale -> set of page ids present */
  const byLocale = new Map<string, Set<string>>();
  for (const locale of LOCALES) byLocale.set(locale, new Set());

  const problems: string[] = [];

  for (const entry of all) {
    /*
      Split on the FIRST slash only. Page ids are nested now
      ("get-involved/donate" -> src/content/pages/en/get-involved/donate.yaml),
      and a plain destructure would take "get-involved" as the page id and drop
      the rest — every subpage would then look missing in both locales.
    */
    const slash = entry.id.indexOf('/');
    const locale = slash === -1 ? '' : entry.id.slice(0, slash);
    const page = slash === -1 ? '' : entry.id.slice(slash + 1);
    if (!locale || !page) {
      problems.push(`Unexpected content path: ${entry.id} (expected <locale>/<page>)`);
      continue;
    }
    if (!byLocale.has(locale)) {
      problems.push(`Unknown locale directory: src/content/pages/${locale}/`);
      continue;
    }
    byLocale.get(locale)!.add(page);
  }

  // Every declared page must exist in every locale.
  for (const locale of LOCALES) {
    const present = byLocale.get(locale)!;
    for (const page of PAGES) {
      if (!present.has(page)) {
        problems.push(`Missing: src/content/pages/${locale}/${page}.yaml`);
      }
    }
    // And nothing may exist that is not declared — a stray file is copy that
    // no route renders, which is worse than a missing one because it looks done.
    for (const page of present) {
      if (!(PAGES as readonly string[]).includes(page)) {
        problems.push(
          `Undeclared page: src/content/pages/${locale}/${page}.yaml — ` +
            `add "${page}" to PAGES in src/copy.ts or delete the file.`,
        );
      }
    }
  }

  // Section-level parity. A translated page with half the sections renders as a
  // visibly shorter page in Spanish, which is the failure this is really for.
  for (const page of PAGES) {
    const reference = all.find((e) => e.id === `${DEFAULT_LOCALE}/${page}`);
    if (!reference) continue;
    const expected = reference.data.sections.map((s) => s.id);

    for (const locale of LOCALES) {
      if (locale === DEFAULT_LOCALE) continue;
      const translated = all.find((e) => e.id === `${locale}/${page}`);
      if (!translated) continue;

      const got = translated.data.sections.map((s) => s.id);
      const missing = expected.filter((id) => !got.includes(id));
      const extra = got.filter((id) => !expected.includes(id));

      if (missing.length) {
        problems.push(
          `src/content/pages/${locale}/${page}.yaml is missing section(s): ${missing.join(', ')}`,
        );
      }
      if (extra.length) {
        problems.push(
          `src/content/pages/${locale}/${page}.yaml has section(s) not in ${DEFAULT_LOCALE}: ${extra.join(', ')}`,
        );
      }
    }
  }

  if (problems.length) {
    throw new Error(
      `Content parity check failed (${problems.length} problem${problems.length === 1 ? '' : 's'}):\n\n` +
        // ASCII only. Astro surfaces build errors through an HTTP header, and a
        // non-ASCII bullet there triggers a warning that buries the message you
        // actually need to read.
        problems.map((p) => `  - ${p}`).join('\n') +
        `\n\nSee docs/CONTENT.md for how the copy files work.`,
    );
  }
}

/** Finds one section by id, or throws — a renamed section should not silently vanish. */
export function section(copy: PageCopy, id: string) {
  const found = copy.sections.find((s) => s.id === id);
  if (!found) {
    throw new Error(
      `No section "${id}" in this page's copy. ` +
        `Sections present: ${copy.sections.map((s) => s.id).join(', ') || '(none)'}`,
    );
  }
  return found;
}

/**
 * Icons Lucide does not have.
 *
 * Drawn on Lucide's 24x24 grid at the same stroke weight, so the custom and
 * library sets are indistinguishable in use — a mixed icon set where half the
 * shapes are visibly heavier is one of the clearest "assembled from clip art"
 * tells, and this site's whole positioning is against that.
 *
 * `seed`, `sprout`, `basket` and `heart` are the Grow -> Harvest -> Pack ->
 * Deliver sequence (task 4.3, animated in 2.5). They are a set: the sprout is
 * the seed opened, and the heart is the logo's heart at icon scale, so the
 * sequence lands on the brand mark rather than on a generic symbol.
 */

export const CUSTOM_ICONS = {
  /** Grow. A seed with its crease. */
  seed:
    '<path d="M12 20.5c-2.9 0-5.2-2.6-5.2-5.9C6.8 10.4 9.4 5.4 12 3.5c2.6 1.9 5.2 6.9 5.2 11.1 0 3.3-2.3 5.9-5.2 5.9Z" />' +
    '<path d="M12 17.5c-1.1-1.6-1.1-3.6 0-5.4" />',

  /** The same sprout as the logo, at icon scale. */
  sprout:
    '<path d="M12 21c0-4.5 0-7.5 0-9.5" />' +
    '<path d="M12 13.2C9.7 11.9 8 9.6 7.6 6.3c3.3.6 5.2 3.1 4.4 6.9Z" />' +
    '<path d="M12 13.2c2.3-1.3 4-3.6 4.4-6.9-3.3.6-5.2 3.1-4.4 6.9Z" />',

  /** Harvest and pack. */
  basket:
    '<path d="M3.5 9.5h17l-1.4 9.6a2 2 0 0 1-2 1.7H6.9a2 2 0 0 1-2-1.7Z" />' +
    '<path d="M8 9.5a4 4 0 0 1 8 0" />' +
    '<path d="M9 13v4M15 13v4" />',

  /** Deliver. Geometry shared with the logo mark. */
  heart:
    '<path d="M12 20.4C10.3 18.6 5 15 5 11.4 5 9.1 6.7 7.5 8.6 7.5c1.6 0 2.85 1.05 3.4 2.5.55-1.45 1.8-2.5 3.4-2.5 1.9 0 3.6 1.6 3.6 3.9 0 3.6-5.3 7.2-7 9Z" />',

  /**
   * Instagram. Lucide removed brand marks, so this is drawn to match the set.
   * Used only as the link to the org's own profile — nominative use.
   */
  instagram:
    '<rect x="3" y="3" width="18" height="18" rx="5" />' +
    '<circle cx="12" cy="12" r="4" />' +
    '<path d="M17.5 6.5h.01" />',
} as const;

export type CustomIconName = keyof typeof CUSTOM_ICONS;

/**
 * Every photograph the site will ever show, declared before any of them exist.
 *
 * Real photos are one of the four genuinely human-blocked items in TASKS.md, so
 * the whole site is built against this manifest and renders generated
 * stand-ins until files appear. See docs/PHOTOS.md for the swap procedure —
 * it is a file drop, with no code change.
 *
 * `aspect` is mandatory. Every slot reserves its box before anything loads, so
 * swapping a placeholder for a real photo cannot shift the layout (CLS is a
 * launch gate — task 6.4).
 */

export type PhotoTone = 'garden' | 'harvest' | 'care';

export interface PhotoSlot {
  /** Drop a file named `<id>.{jpg,jpeg,png,webp}` into src/assets/photos/. */
  id: string;
  /** CSS aspect-ratio. Reserves the box so nothing reflows on load. */
  aspect: string;
  /** Palette family for the generated stand-in. Follows the seasonal drift. */
  tone: PhotoTone;
  /** What the photo must show. Feeds the shot list in task 3.10. */
  brief: string;
  /**
   * Whether this image carries meaning or is decorative.
   * `decorative` renders `alt=""`, which is correct — a decorative image with
   * invented alt text is worse for a screen reader than no alt text at all.
   */
  role: 'meaningful' | 'decorative';
}

export const PHOTO_SLOTS = {
  hero: {
    id: 'hero',
    aspect: '16 / 9',
    tone: 'garden',
    brief: 'Wide shot of the garden bed with someone working in it. Hands and soil visible.',
    role: 'decorative',
  },
  garden: {
    id: 'garden',
    aspect: '4 / 3',
    tone: 'garden',
    brief: 'The growing beds. Close enough to see the plants are real and tended.',
    role: 'meaningful',
  },
  harvest: {
    id: 'harvest',
    aspect: '4 / 3',
    tone: 'harvest',
    brief: 'Just-picked produce in a basket or crate, outdoors, natural light.',
    role: 'meaningful',
  },
  bundle: {
    id: 'bundle',
    aspect: '4 / 3',
    tone: 'harvest',
    brief: 'A complete packed bundle as a clinic would receive it. This is the credibility shot.',
    role: 'meaningful',
  },
  'break-produce': {
    id: 'break-produce',
    aspect: '21 / 9',
    tone: 'harvest',
    brief:
      'Wide, edge-to-edge shot of mixed produce. Used as a full-bleed break ' +
      'between chapters, so it must read at a very shallow crop.',
    role: 'decorative',
  },
  /*
    First distribution, 2026-11-04 — the homepage "Big news" band. Real photos
    from the founders. Bundles are shown alone, before delivery, never at the
    handoff (COMPLIANCE Rule 3). A shot of the bundles at the clinic was left
    out: its wall lettering could identify a partner that has not agreed to be
    named.
  */
  'season-growing': {
    id: 'season-growing',
    aspect: '3 / 4',
    tone: 'garden',
    brief: 'Herb seedlings coming up in two of our pots, from above.',
    role: 'meaningful',
  },
  'season-pots': {
    id: 'season-pots',
    aspect: '3 / 4',
    tone: 'garden',
    brief: 'The row of herb pots with a bowl of just-picked basil.',
    role: 'meaningful',
  },
  'news-harvest': {
    id: 'news-harvest',
    aspect: '3 / 4',
    tone: 'harvest',
    brief: 'Kale from the first harvest, picked for the first distribution.',
    role: 'meaningful',
  },
  'news-bundles': {
    id: 'news-bundles',
    aspect: '3 / 4',
    tone: 'harvest',
    brief: 'Finished bundles from the first distribution, before delivery.',
    role: 'meaningful',
  },
  'founder-kreeshma': {
    id: 'founder-kreeshma',
    aspect: '1 / 1',
    tone: 'care',
    brief: 'Kreeshma, outdoors, natural light, plain background. Shoulders up.',
    role: 'meaningful',
  },
  'founder-charishya': {
    id: 'founder-charishya',
    aspect: '1 / 1',
    tone: 'care',
    brief: 'Charishya, outdoors, natural light, plain background. Shoulders up.',
    role: 'meaningful',
  },
} as const satisfies Record<string, PhotoSlot>;

export type PhotoId = keyof typeof PHOTO_SLOTS;

/**
 * ⚠️ No photograph of a mother or of a bundle being handed to anyone may ever
 * be added here. docs/BRIEF.md §6: no mother is named, photographed, or
 * described. Bundles are photographed alone, before delivery.
 */

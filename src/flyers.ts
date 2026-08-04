/**
 * Flyer manifest, built from whatever is in `src/assets/flyers/`.
 *
 * This lives in its own module rather than inside <Flyers> so the homepage can
 * ask "are there any flyers?" and skip the entire section — heading, band and
 * all — without rendering the component first. An empty section with a heading
 * and nothing under it is worse than no section.
 *
 * `import.meta.glob` resolves at build time, so an empty folder is an empty
 * object rather than an error. Same idiom as `src/photos.ts` and <Photo>:
 * the founders drop a file in and it appears, with no code change.
 *
 * See `src/assets/flyers/README.md` for the naming rules this parses.
 */

import type { ImageMetadata } from 'astro';

export interface Flyer {
  /** Processed image, ready for <Image>. */
  src: ImageMetadata;
  /** Derived from the filename. Rendered as visible text, not as alt. */
  caption: string;
  /** Matching PDF in public/flyers/, or null if there is not one. */
  pdf: string | null;
}

/* Eager: <Image> needs intrinsic width/height at build time to reserve the box. */
const files = import.meta.glob<{ default: ImageMetadata }>(
  './assets/flyers/*.{png,jpg,jpeg,webp,avif}',
  { eager: true },
);

/*
  Existence check only — never imported for its bytes. Files in public/ are
  served as-is, so the download link is a plain path.
*/
const pdfs = import.meta.glob('../public/flyers/*.pdf');
const pdfBaseNames = new Set(
  Object.keys(pdfs).map((p) => stripExtension(basename(p))),
);

function basename(path: string): string {
  return path.split('/').pop() ?? path;
}

function stripExtension(name: string): string {
  return name.replace(/\.[^.]+$/, '');
}

/** "01-volunteer-drive.png" -> "Volunteer drive" */
function captionFrom(path: string): string {
  const base = stripExtension(basename(path))
    // A leading "01-" is an ordering hint, not part of the name.
    .replace(/^\d+[-_]/, '');
  const words = base.replace(/[-_]+/g, ' ').trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export const FLYERS: Flyer[] = Object.entries(files)
  // Alphabetical by path, so a numeric prefix controls the order.
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, mod]) => {
    const base = stripExtension(basename(path));
    return {
      src: mod.default,
      caption: captionFrom(path),
      pdf: pdfBaseNames.has(base) ? `/flyers/${base}.pdf` : null,
    };
  });

export const hasFlyers = FLYERS.length > 0;

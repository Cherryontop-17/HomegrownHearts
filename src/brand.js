/**
 * The logo mark's geometry and brand colors — the single source both the
 * runtime component and the asset generator read.
 *
 * Plain JS with JSDoc rather than TS so `scripts/generate-brand-assets.mjs` can
 * import it directly under plain `node`, with no build step and no duplicated
 * path data. The favicon previously carried its own copy of these paths, which
 * is exactly the kind of duplication that goes stale silently — a logo tweak
 * would have left the favicon on the old shape forever.
 *
 * Drawn on a 48x48 grid. See src/components/Logo.astro for the design notes.
 */

/** Heart outline, as one continuous path so it can be stroke-drawn. */
export const HEART =
  'M24 40.8C20.6 37.2 10 30 10 22.8C10 18.2 13.4 15 17.2 15C20.4 15 22.9 17.1 24 20C25.1 17.1 27.6 15 30.8 15C34.6 15 38 18.2 38 22.8C38 30 27.4 37.2 24 40.8Z';

/** Stem, rising out of the heart's cleft. */
export const STEM = 'M24 19.8C24 16.5 24 14.2 24 12';

export const LEAF_LEFT = 'M24 13.5C21.4 11.8 18.6 10.6 18 6.4C21.8 7.4 23.4 10.2 24 13.5Z';
export const LEAF_RIGHT = 'M24 13.5C26.6 11.8 29.4 10.6 30 6.4C26.2 7.4 24.6 10.2 24 13.5Z';

/** Stroke weight on the 48 grid. Keep in sync with Logo.astro's `.mark`. */
export const STROKE_WIDTH = 2.4;

/**
 * Literal hex values, not CSS variables. Everything here renders outside the
 * browser — into PNG and ICO files — where `var()` means nothing.
 * Must match the tokens in src/styles/global.css.
 */
export const BRAND = {
  clay: '#9a3412',
  cream: '#fdfbf6',
  sand: '#f4ece0',
  garden: '#2f6b4f',
  ink: '#22201d',
  inkMuted: '#5f574d',
};

/**
 * The mark as a standalone SVG document.
 *
 * @param {object} [options]
 * @param {boolean} [options.solid] Filled rather than stroked. Required below
 *   roughly 32px, where a 2.4 stroke on a 48 grid closes up into a blob.
 * @param {string} [options.color] Any CSS color. Defaults to clay.
 * @param {string|null} [options.background] Background fill, or null for
 *   transparent. Apple touch icons must not be transparent — iOS composites
 *   them onto black, and a dark mark disappears.
 * @param {number} [options.padding] Padding in grid units on all sides.
 * @returns {string} A complete SVG document.
 */
export function markSvg({ solid = true, color = BRAND.clay, background = null, padding = 0 } = {}) {
  const size = 48 + padding * 2;
  const offset = padding;

  const bg = background ? `<rect width="${size}" height="${size}" fill="${background}"/>` : '';

  // The stem stays a stroke even in the solid build: it is an open path, and
  // filling it would collapse it to nothing.
  const body = solid
    ? `<g fill="${color}">
    <path d="${HEART}"/>
    <path d="${LEAF_LEFT}"/>
    <path d="${LEAF_RIGHT}"/>
  </g>
  <path d="${STEM}" fill="none" stroke="${color}" stroke-width="${STROKE_WIDTH}" stroke-linecap="round"/>`
    : `<g fill="none" stroke="${color}" stroke-width="${STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round">
    <path d="${HEART}"/>
    <path d="${STEM}"/>
    <path d="${LEAF_LEFT}"/>
    <path d="${LEAF_RIGHT}"/>
  </g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  ${bg}
  <g transform="translate(${offset} ${offset})">
    ${body}
  </g>
</svg>`;
}

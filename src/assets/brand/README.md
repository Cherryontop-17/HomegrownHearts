# Custom logo

Drop your logo file here and the site picks it up on the next build. No code
change.

## What to name it

```
src/assets/brand/logo.svg     ← preferred
src/assets/brand/logo.png     ← also fine (use 2x the display size, ≥512px wide)
```

Accepted extensions: `.svg`, `.png`, `.webp`, `.avif`, `.jpg`.

If more than one matches, `.svg` wins, then `.png`, then the rest alphabetically.

## What happens if this folder is empty

`<Logo>` falls back to the built-in heart-and-sprout mark drawn in
[`src/brand.js`](../../brand.js). That is the current state, and it is a real
logo — nothing is broken while this folder is empty.

## Two things worth knowing before you drop a file in

**1. The mark is used at 28px in the header.** Anything with fine detail or
small text inside it will turn to mush at that size. If your logo has a
wordmark baked into the image, prefer the `mark` variant of your artwork here
(the symbol alone) — the site already renders "Homegrown Hearts" as live text
next to it, so a baked-in wordmark would render the name twice.

**2. SVG beats PNG here, but only if it is clean.** Export with text converted
to outlines and no embedded raster images. If your SVG uses `currentColor` for
its fills, it will inherit the right colour automatically in the header (clay)
and the footer (cream), the way the built-in mark does. A hardcoded fill is
fine too — it just will not adapt to the dark footer, so check it there.

## Favicon and social images

Those are generated separately from `src/brand.js` by `npm run brand`. Dropping
a logo here does **not** regenerate them — if you want the favicon and the
Open Graph image to match your new logo, say so and they can be rewired.

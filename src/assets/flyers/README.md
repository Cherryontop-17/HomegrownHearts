# Flyers

Drop your flyer images here. They appear on the homepage automatically, newest
name first — no code change.

## What to name them

The filename becomes the caption, so name them like captions:

```
src/assets/flyers/volunteer-drive.png      →  "Volunteer drive"
src/assets/flyers/clinic-partnership.jpg   →  "Clinic partnership"
```

Hyphens become spaces and the first letter is capitalised. Accepted:
`.png`, `.jpg`, `.jpeg`, `.webp`, `.avif`.

## Ordering

Alphabetical by filename. Prefix with a number if you care about the order:

```
01-volunteer-drive.png
02-supply-drive.png
```

## Adding a downloadable PDF

Images are what get displayed; a PDF is what people print. If you want a
download button under a flyer, put the PDF in `public/flyers/` with the **same
base name**:

```
src/assets/flyers/volunteer-drive.png   ← displayed
public/flyers/volunteer-drive.pdf       ← download button appears automatically
```

No PDF, no button. Nothing breaks.

## Before you upload — two checks

**1. Alt text.** The caption derived from the filename is what a screen reader
reads. A flyer is an image of text, and all of that text is invisible to
assistive tech, so whatever the flyer _says_ must also exist as real text
somewhere on the site. If a flyer announces something not written on a page,
tell me and I will add it as text alongside.

**2. COMPLIANCE.md applies to flyers too.** A flyer is published content. In
particular, check it does not: call us a nonprofit or a charity, describe the
produce as doing anything to a body or a pregnancy, name the partner clinic if
that permission ever changes, or show a recipient. See
[`docs/COMPLIANCE.md`](../../../docs/COMPLIANCE.md) — the CI check scans page
copy, but it cannot read words baked into an image.

## What happens if this folder is empty

The flyer section does not render at all. The homepage is complete without it.

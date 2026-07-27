# Photographs — how to add the real ones

**For the founders. No code knowledge needed, and no developer required.**

Right now every photo slot on the site shows a generated stand-in: a soft
brand-coloured gradient with a vine motif. That is deliberate. The site is
finished and shippable without photographs, and the real ones drop in later
without anything being rebuilt or rewritten.

---

## The whole procedure

1. Take the photos (the shot list is in [`TASKS.md`](../TASKS.md) task 3.10).
2. Name each file after its slot id from the table below — `garden.jpg`, `bundle.jpg`, and so on.
3. Put them in **`src/assets/photos/`**.
4. Commit and push.

That is all. The site picks them up automatically. You do not edit any component,
and you do not need to resize, compress, or convert anything — the build
generates optimized WebP at multiple densities from whatever you provide.

**Do not** put photos in `public/`. Files there are served untouched, skipping
the optimization step entirely, and a 4 MB phone photo on the homepage will cost
more Lighthouse points than the photo gains.

---

## The slots

| File name               | Shape      | What it needs to show                                              |
| ----------------------- | ---------- | ------------------------------------------------------------------ |
| `hero.jpg`              | Wide 16:9  | The garden bed with someone working in it. Hands and soil visible. |
| `garden.jpg`            | 4:3        | The growing beds, close enough to see the plants are real          |
| `harvest.jpg`           | 4:3        | Just-picked produce in a basket or crate, outdoors, natural light  |
| `bundle.jpg`            | 4:3        | A complete packed bundle as a clinic receives it                   |
| `founder-kreeshma.jpg`  | Square 1:1 | Kreeshma, outdoors, natural light, plain background, shoulders up  |
| `founder-charishya.jpg` | Square 1:1 | Charishya, outdoors, natural light, plain background, shoulders up |

`.jpg`, `.jpeg`, `.png`, `.webp`, and `.avif` all work. Shoot the largest size
your phone will produce — the build makes the small versions, and it can only
shrink, never sharpen.

The shapes above are how each slot is cropped. Frame a little loose so the crop
has room.

---

## Two rules that are not negotiable

**1. No photograph of a mother. Ever.**

Not named, not anonymised, not from behind, not a hand. Bundles are photographed
on their own, before delivery. This is in [`docs/BRIEF.md`](BRIEF.md) §6 and it
is the single thing on this site that could cause real harm to a real person.

**2. Anyone recognisable in a photo has agreed to be on a public website.**

That means the two of you and any volunteer who is clearly identifiable. For a
volunteer under 18, that means their parent has agreed. If you are not certain,
shoot it so faces are not identifiable — hands, tools, and produce carry the
story perfectly well.

---

## Adding a new slot later

If a new page needs a photo that is not listed above, add it to `PHOTO_SLOTS` in
[`src/photos.ts`](../src/photos.ts) and use `<Photo photo="your-id" alt="..." />`.
Set `role: 'meaningful'` if the image carries information, `role: 'decorative'`
if it is atmosphere. Meaningful slots refuse to build without alt text, which is
intentional.

---

## Checking it worked

```
npm run dev
```

Open the page. If a photo still shows a gradient, the file name does not match
the slot id — check spelling and that there is no `.JPG`/`.jpg` case mismatch or
a doubled extension like `garden.jpg.jpg`.

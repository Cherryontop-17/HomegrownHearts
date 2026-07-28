# Photography credits and licences

**These are temporary.** Every file here is a licensed stand-in so the site does
not look unfinished while the founders' own photographs are pending. Each one is
replaced by dropping a file of the same name into this folder — see
[`docs/PHOTOS.md`](../../../docs/PHOTOS.md) and the shot list in
[`docs/SHOT-LIST.md`](../../../docs/SHOT-LIST.md).

**Replace them.** A real photograph of the actual garden is worth more to a
clinic reader than any stock image, because the entire argument of this site is
that the thing is real.

---

## Selection rules

Every image here had to pass all four:

1. **No identifiable people.** Not a compliance nicety — `COMPLIANCE.md` Rule 3
   forbids picturing recipients, and a stock photograph of a stranger on a page
   about mothers invites exactly the wrong inference.
2. **No cooked or prepared food.** We distribute whole, raw produce. A photo of a
   plated meal misrepresents what is in a bundle.
3. **No watermarks, no visible branding.**
4. **Licence permits commercial use with no attribution required**, so the site
   carries no obligation the founders could accidentally breach.

---

## Files

| File                | Subject                      | Source   | Licence                                                                  |
| ------------------- | ---------------------------- | -------- | ------------------------------------------------------------------------ |
| `hero.jpg`          | Soil, trowel, potting bench  | Unsplash | [Unsplash Licence](https://unsplash.com/license) — free, no attribution  |
| `garden.jpg`        | Seedlings in peat pots       | Pexels   | [Pexels Licence](https://www.pexels.com/license/) — free, no attribution |
| `harvest.jpg`       | Market stall: carrots, beets | Pexels   | [Pexels Licence](https://www.pexels.com/license/)                        |
| `bundle.jpg`        | Cucumbers, cabbage, tomatoes | Pexels   | [Pexels Licence](https://www.pexels.com/license/)                        |
| `break-produce.jpg` | Mixed vegetables, full-bleed | Pexels   | [Pexels Licence](https://www.pexels.com/license/)                        |

Both licences permit commercial use and modification without attribution. Both
prohibit selling unmodified copies or using images to build a competing stock
service — neither is anything this site does.

---

## Why there are no founder portraits here

`founder-kreeshma.jpg` and `founder-charishya.jpg` are **deliberately absent**
and still render as generated placeholders.

Putting a stock photograph of a stranger under a founder's name would be a
straightforward lie, on the page whose entire job is to convince a clinic that
these are real people running a real project. Those two slots stay empty until
the founders photograph themselves.

Everything else on this page is a stand-in for something real. Those two would
be stand-ins for someone who does not exist.

---

## Grading

These files are **generated**, not the originals. Ungraded sources live in
`photos-src/`; `npm run photos` crops and grades them into this folder.

Stock images look like stock mainly because they do not match each other, so
all five run through one pipeline: a gentle S-curve, a per-channel warm shift
toward the cream page, restrained saturation, and output sharpening. The hero
additionally gets a vignette and a bottom-left shade so cream type always holds
over it.

One trap worth recording: sharp's `.tint()` is a **colourise** operation, not a
white-balance one. It desaturates before tinting, which turned every photograph
sepia on the first pass. Warming is done with per-channel `.linear()` instead.

To swap a photograph, replace the file in `photos-src/` and re-run
`npm run photos`. To change the look for all of them, edit the recipe in
`scripts/grade-photos.mjs`.

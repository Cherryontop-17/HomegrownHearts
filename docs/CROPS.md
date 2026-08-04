# Crop data — sourcing and verification

**Status:** verification pending · **Owner:** Kreeshma (produce list), Charishya (data entry)
**Data lives in:** [`src/crops.ts`](../src/crops.ts)

This is the answer to "do I need to cite my sources, and do I need documentation."
Short version: **yes to both, and there is a third thing that matters more than
either.**

---

## 1. Do I need to cite sources?

**Yes, for every number.** Not because a teacher will ask, but because the whole
credibility argument of this site is "our numbers are checkable." A clinic
partner who spot-checks one figure and finds it invented stops trusting all of
them, including the safety ones.

The rule this site already runs on is in
[`SOURCES.md`](SOURCES.md): every published number maps to a named source.
Crop data is no different.

**Use NC State Extension as the primary source.** Not a seed packet, not a blog,
not a national average:

- [NC State Extension Gardener Plant Toolbox](https://plants.ces.ncsu.edu/) —
  per-plant pages, written for North Carolina
- [NC State Extension Gardener Handbook, Ch. 16: Vegetable Gardening](https://content.ces.ncsu.edu/extension-gardener-handbook/16-vegetable-gardening) —
  planting dates and spacing by region
- [Union County Cooperative Extension](https://union.ces.ncsu.edu/) — our own county

Why Extension specifically: it is the land-grant university's public
horticulture service, it is written for our exact hardiness zone (7b/8a), and
it is the source a Master Gardener would cite. "NC State Extension says 25–65
days for kale in the Piedmont" is a sentence that survives being questioned.

## 2. Do I need documentation?

**Yes — this file is it.** Keep the table below current. When you verify a
number against its Extension page, paste the URL and flip the status. That is
the entire process.

---

## Verification table

⚠️ **Everything below is UNVERIFIED.** The day ranges in `src/crops.ts` are
typical published figures for zone 7b/8a, entered so the calendar and grow
chart could be built. They are plausible, not sourced. **Do not show this
calendar to HELP Pregnancy Center as sourced data until this table is filled
in.**

| `sourceKey`     | Crop           | Claim in `crops.ts`             | Status     | Verified against |
| --------------- | -------------- | ------------------------------- | ---------- | ---------------- |
| `ncsu-basil`    | Genovese basil | 21–30 days **from transplant**  | unverified |                  |
| `ncsu-kale`     | Kale           | 25–65 days from seed            | unverified |                  |
| `ncsu-lettuce`  | Lettuce mix    | 21–45 days from seed            | unverified |                  |
| `ncsu-spinach`  | Spinach        | 40–50 days from seed            | unverified |                  |
| `ncsu-tomato`   | Cherry tomato  | 55–70 days **from transplant**  | unverified |                  |
| `ncsu-carrot`   | Carrots        | 60–80 days from seed            | unverified |                  |
| `ncsu-cucumber` | Cucumbers      | 50–70 days from seed            | unverified |                  |

**How to verify one row:** open the Plant Toolbox page for the crop, find the
days-to-harvest figure, paste that URL into the last column, change the status
to `verified`, and correct the number in `src/crops.ts` if it differs. Ten
minutes for the whole table.

---

## 3. The thing that matters more than either

**You asked for nutrients and "what it is best for, in say healing." That
cannot go on this site, and a citation does not fix it.**

This is not a judgement call — it is [`COMPLIANCE.md`](COMPLIANCE.md) Rule 1,
which is binding, CI-enforced, and says so in as many words:

> A citation does not launder a health claim.

The reason is specific to you two. A per-crop panel saying what a vegetable is
"best for" is **dietary advice**, published by two people who are not licensed
clinicians, on a site whose stated audience is pregnant and postpartum mothers,
distributed through a medical partner. That is the exact fact pattern the whole
compliance ruleset exists to prevent. It is also the thing most likely to end
the clinic partnership, because their compliance officer will catch it
immediately.

It stays banned even when the claim is true and well sourced. USDA FoodData
Central will tell you exactly how much folate is in a cup of spinach, and that
figure is correct, and putting it next to the word "pregnancy" on our site still
makes it our claim about a body.

### What the crop panels show instead

Growing and kitchen information, which is genuinely more useful to a volunteer
and to a mother holding the bag:

- days to harvest, and what the plant looks like when it is ready
- sun, water, spacing, sowing depth
- how to store it once picked, and how long it keeps
- plain ways to cook it

### The compliant way to point at nutrition

Link out and add nothing of your own:

> For guidance on eating during pregnancy, see
> [ACOG's patient FAQ](https://www.acog.org/womens-health/faqs/nutrition-during-pregnancy).

That is a referral, not a claim. It stays a referral only as long as we add no
characterisation — no "helpful guide", no "learn how good nutrition supports
you." The link is already in the page copy.

---

## If you want the nutrition angle anyway

There is one legitimate route, and it is not a code change: **ask the clinic to
own it.** If HELP Pregnancy Center writes the nutrition content, reviews it, and
agrees to be credited as its author, then it is a clinician's claim published
with their permission, not ours. That is a conversation for Kreeshma to have,
and it would need the same written sign-off the produce list got.

Until that exists, the answer is growing information only.

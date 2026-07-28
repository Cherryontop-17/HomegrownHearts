# Compliance ruleset

**Status:** binding · **Enforced by:** `npm run check:compliance` · **Owner:** SME role

Every word published on this site passes these five rules. They are not style
preferences. Rules 1 and 2 are the line between a student food project and two
15-year-olds making unlicensed medical claims and misrepresenting a charity.

The checkable parts are enforced by [`scripts/check-compliance.mjs`](../scripts/check-compliance.mjs),
which runs in CI against the content collections in both languages. The
judgement parts are listed here as a review checklist, because no regex catches
them.

---

## Rule 1 — Zero health claims

> **Describe the food. Never describe its effects.**

We are allowed to say what is in a bundle, where it was grown, when it was
picked, and who it goes to. We are **not** allowed to say — or imply — what
eating it does to a body, a pregnancy, or a baby.

This holds even when the claim is true and well supported. The problem is not
accuracy; it is that neither founder is a licensed clinician, and a produce
delivery paired with a health outcome is dietary advice.

| ❌ Never                                         | ✅ Instead                                         |
| ------------------------------------------------ | -------------------------------------------------- |
| "Leafy greens support a healthy pregnancy"       | "Each bundle includes leafy greens"                |
| "Fresh food helps your baby develop"             | "Picked the morning it goes out"                   |
| "Nutrients your baby needs"                      | "Seasonal vegetables grown in Union County"        |
| "Good nutrition prevents complications"          | _(cut entirely — replace with nothing)_            |
| "Boosts energy during pregnancy"                 | _(cut entirely)_                                   |
| "Eating well is essential for expecting mothers" | "Our partner clinic decides who receives a bundle" |

**Banned verbs anywhere near food, nutrients, pregnancy, or babies:**
`helps` · `supports` · `boosts` · `improves` · `prevents` · `reduces` ·
`promotes` · `aids` · `strengthens` · `enhances` · `heals` · `cures` ·
`treats` · `protects` · `ensures`

**Banned phrases:** `healthy pregnancy` · `healthy baby` · `fetal development` ·
`birth outcomes` · `essential for` · `vital for` · `good for you` ·
`nutrient-rich` · `superfood` · `immune` · `doctor recommended`

### Where health information IS allowed

Nowhere in our own voice. If a page needs to point at nutrition guidance, it
**links out to ACOG** and attributes it plainly:

> For guidance on eating during pregnancy, see
> [ACOG's patient FAQ](https://www.acog.org/womens-health/faqs/nutrition-during-pregnancy).

That is a referral, not a claim. It stays a referral only if we add no
characterisation of our own — no "helpful guide", no "learn how good nutrition
supports you".

### The statistics we may cite

Only **food access and consumption** data. Never health-outcome data.

- ✅ "18.4% of U.S. households with children were food insecure in 2024." — a fact about access
- ✅ "10% of U.S. adults meet federal vegetable intake recommendations." — a fact about consumption
- ❌ "Poor nutrition in pregnancy is linked to low birth weight." — a health-outcome claim, even with a citation

A citation does not launder a health claim. See [`SOURCES.md`](SOURCES.md).

---

## Rule 2 — We are not a 501(c)(3), and we never imply otherwise

Homegrown Hearts is an unincorporated student initiative. It has no tax-exempt
status, no EIN, and no bank account.

**Banned:** `501(c)(3)` · `nonprofit` / `non-profit` (describing us) · `charity`
(describing us) · `tax-deductible` (except inside the explicit negation) ·
`your donation is deductible` · `write-off` · `foundation` · `we are a registered…`

**Required, verbatim, in the footer of every page:**

> Homegrown Hearts is a student-led initiative. We accept donated supplies only.
> Donations are not tax-deductible.

**We never accept money.** Not cash, not Venmo, not a GoFundMe, not "just to
cover seeds". Accepting money without an entity or an adult treasurer creates a
real legal problem and a real safeguarding problem. Supplies only.

If a donor asks to give money, the answer is a list of supplies they could buy
instead. That answer belongs on `/get-involved`.

---

## Rule 3 — No mother is ever named, photographed, or described

Not by name, not by initials, not anonymised with identifying detail ("a mother
of three in Union County"), not from behind, not a hand, not a quote.

Recipients are reached through the partner clinic and are never our contacts. We
do not know who they are, and the site must make clear that this is by design.

**Required, in the footer of every page:**

> We never collect, store, or publish the names, photographs, or details of the
> mothers we serve. Our partner clinic decides who receives a bundle.

Bundles are photographed **alone, before delivery**. See [`PHOTOS.md`](PHOTOS.md).

---

## Rule 4 — Nothing is claimed as approved until it is

Two things require the partner clinic's actual, recorded agreement:

1. **Naming the clinic**, or showing its logo.
2. **Calling the produce list "clinic-approved."**

Until both exist, the produce list is published marked _pending clinic approval_
and `PARTNER_CLINIC.approvedToDisplay` stays `false` in
[`src/config.ts`](../src/config.ts). The `has.partnerClinic()` guard means no
component can render a clinic name that has not been cleared.

Likewise the adult advisor: their name appears only once they have given written
permission to publish it.

---

## Rule 5 — Numbers are true, including the small ones

Impact numbers come from [`src/config.ts`](../src/config.ts) and are updated by
hand after each delivery. **Zeros are fine at launch.** "We are just getting
started" is a credible thing for a new project to say; an inflated number is not
recoverable if a clinic or an admissions reader ever checks.

Never: "hundreds of pounds", "dozens of families", "countless", "many". If it
cannot be counted, it does not go on the site.

---

## Review checklist — the parts no linter catches

Run through these before any content merge:

- [ ] Does any sentence imply a health benefit **by juxtaposition**? (A produce
      photo beside the word "pregnancy" makes a claim the copy never wrote.)
- [ ] Does any sentence imply the founders select recipients?
- [ ] Does any sentence imply medical involvement we do not have?
- [ ] Does the Spanish carry an implication the English does not? Spanish
      health register slides toward the clinical very easily — see Rule 6.
- [ ] Would a clinic compliance officer reading this page find anything to
      object to? If unsure, cut it. Nothing on this site is worth a partnership.

---

## Rule 6 — Spanish is checked separately, not assumed

A translation can introduce a claim the English never made. Two specific traps
in Spanish:

- **`saludable` / `sano`** attach far more readily to outcomes than "healthy"
  does in English. "comida saludable" reads close to "food that makes you
  healthy". Prefer `fresco`, `de temporada`, `recién cosechado`.
- **`ayudar a`** is the natural Spanish verb for almost everything, and it is a
  health claim the moment it touches a body. "para ayudar a las madres" is fine;
  "para ayudar a su embarazo" is not.

Banned Spanish forms mirror Rule 1: `ayuda a` · `mejora` · `previene` ·
`fortalece` · `favorece` · `beneficia` · `esencial para` · `vital para` ·
`desarrollo fetal` · `embarazo saludable` · `bebé sano` · `nutritivo`.

Banned status forms mirror Rule 2: `sin fines de lucro` · `sin ánimo de lucro` ·
`organización benéfica` · `deducible de impuestos` (except in the negation).

> ⚠️ **A fluent speaker must read the Spanish before launch.** The translation is
> the agent's, and register slips in health-adjacent Spanish read as either
> condescending or as a medical claim. This is on the founders' pre-launch
> checklist alongside advisor sign-off.

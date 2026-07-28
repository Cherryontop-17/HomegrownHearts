# Editing the words on the site

**For the founders. You do not need a developer, and you cannot break the site
by editing text.**

Every word on Homegrown Hearts lives in `src/content/pages/`. There are two
folders — `en/` for English and `es/` for Spanish — and one file per page.

```
src/content/pages/
  en/  home.yaml  partners.yaml  about.yaml  get-involved.yaml  impact.yaml  contact.yaml
  es/  home.yaml  partners.yaml  about.yaml  get-involved.yaml  impact.yaml  contact.yaml
```

Open a file, change the words between the quotes, save, commit. That is the
whole process.

---

## Before you change anything

**Read [`COMPLIANCE.md`](COMPLIANCE.md).** It is short, and Rules 1 and 2 are not
optional — they are what keeps this a student food project rather than two
teenagers giving medical advice and misrepresenting a charity.

The short version:

- **Never say what food does to a body.** Describe the vegetables. Never the effects.
- **Never imply we are a registered charity** or that donations are deductible.
- **Never name, photograph, or describe a mother.**

`npm run check:compliance` catches most violations of those rules automatically
and tells you which line to fix.

---

## What the parts of a file mean

```yaml
title: About us # browser tab + Google result. Under 60 characters.
description: ... # the grey text under a Google result. 50-165 characters.

hero: # the big bit at the top
  eyebrow: About # small label above the headline
  title: A garden, two students, and a clinic.
  lead: >- # the paragraph under the headline
    Homegrown Hearts started in Waxhaw...

sections: # everything below the hero, in order
  - id: mission # never change an id — see below
    eyebrow: What we do
    title: We grow food and give it away.
    body: # one entry per paragraph
      - First paragraph...
      - Second paragraph...
    items: # cards, steps, or list entries
      - title: Kreeshma Vasikarla
        body: Mission and medical lead.
    note: Small print shown in a quieter style.
```

### The `>-` thing

`>-` lets a long paragraph wrap across several lines in the file while still
being one paragraph on the site. Keep the indentation as it is. If you would
rather not deal with it, put short text in quotes on one line instead:

```yaml
title: 'A garden, two students, and a clinic.'
```

### Two rules about ids

1. **Do not change an `id`.** It is how the page finds the section. Change the
   `title` freely; leave the `id` alone.
2. **The same sections must exist in both languages.** If you add a section to
   `en/home.yaml`, add it to `es/home.yaml` too.

That second rule is enforced. If you forget, `npm run build` stops and tells you
exactly which file and which section is missing — it will not quietly publish a
half-translated page.

---

## Adding a whole new page

1. Create `en/<name>.yaml` **and** `es/<name>.yaml`.
2. Add `'<name>'` to the `PAGES` list in [`src/copy.ts`](../src/copy.ts).
3. Add it to `PRIMARY_NAV` in [`src/nav.ts`](../src/nav.ts) if it belongs in the menu.

---

## Numbers, emails, and links

Those are **not** in the copy files. They live in
[`src/config.ts`](../src/config.ts), because they appear in several places at
once and should only ever be typed in one:

- impact numbers (bundles delivered, mothers served, volunteers)
- the contact email address
- the Instagram handle
- the advisor's name
- Google Form links

Statistics with a citation are different again — those come from
[`SOURCES.md`](SOURCES.md), and **every number on the site must have an entry
there**. Do not add a statistic you have not personally opened the source and
read.

---

## Checking your work

```
npm run dev                 # look at it: http://localhost:4321 and /es/
npm run check:compliance    # the rules in COMPLIANCE.md
npm run build               # catches missing translations and bad formatting
```

If `build` fails, read the message — it names the file and the problem. It is
being helpful, not broken.

---

## Getting the Spanish read

The Spanish on this site was written by an AI, not a native speaker. **Before
launch, a fluent Spanish speaker must read it**, especially anything near food
or health, where a small register slip reads as either condescending or as a
medical claim.

That is on the pre-launch checklist alongside the advisor sign-off.

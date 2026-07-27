# Homegrown Hearts — Website Build Tasks

**Stack:** Astro 7 + Tailwind 4 + GSAP · **Host:** Cloudflare Workers (Static Assets) · **Registrar:** Cloudflare
**Languages:** English + Spanish
**Founders:** Charishya Yarram (Operations & Technology) · Kreeshma Vasikarla (Mission & Medical)

**Execution model:** the agent performs every task below, wearing all six roles. Each task is tagged with its
governing role. Every completed task gets a self-review + rating logged in the [Review Log](#review-log).

| Tag     | Role                  | Owns                                                  |
| ------- | --------------------- | ----------------------------------------------------- |
| `PO`    | Product Owner         | Scope, priority, acceptance criteria, cut decisions   |
| `ARCH`  | Technical Architect   | Stack, structure, build/deploy, performance budget    |
| `WRITE` | Content Writer        | All copy, microcopy, meta descriptions, tone          |
| `SME`   | Subject Matter Expert | Maternal nutrition, food safety, nonprofit compliance |
| `DEV`   | Senior Web Developer  | Implementation, motion, accessibility engineering     |
| `QA`    | Quality Assurance     | Test passes, audits, sign-off gates                   |

---

## Phase 0 — Foundations

- [x] **0.1** `PO` Write the product brief: audience ranking (clinic staff → donors/volunteers → admissions), success criteria, explicit v1 cut-list → [`docs/BRIEF.md`](docs/BRIEF.md)
- [x] **0.2** `ARCH` Scaffold Astro in repo root — Astro 7.1.4, Minimal + TS Strict
- [x] **0.3** `ARCH` Add Tailwind 4 + Cloudflare adapter; `wrangler.jsonc` with the static-assets binding
- [ ] **0.4** `ARCH` `git init`, `.gitignore`, initial commit, push to public GitHub repo `homegrownhearts`
- [ ] **0.5** `ARCH` Ship a deploy pipeline: `wrangler deploy` → live on `*.workers.dev`, then wire Workers Builds to GitHub for push-to-deploy
- [ ] **0.6** `ARCH` Document the Cloudflare Registrar + custom-domain steps in `docs/DEPLOY.md` _(purchase is the founders' call — ~$10/yr at cost)_
- [x] **0.7** `ARCH` [`src/config.ts`](src/config.ts) — single source of truth for org data, contacts, form URLs, socials, advisor, impact numbers. Nothing hardcoded in components
- [x] **0.8** `ARCH` Astro image service set to `'compile'` for Cloudflare — **the adapter cannot run Sharp at runtime**
- [x] **0.9** `ARCH` Tooling — Prettier + `prettier-plugin-astro`, `astro check`, GitHub Actions CI on every push
- [x] **0.10** `ARCH` **i18n foundation** — Astro `i18n` config (`en` at `/`, `es` at `/es/`), [`src/i18n/`](src/i18n/) helpers, typed UI dictionary, `hreflang` + `x-default` builder

## Phase 1 — Design system & shell

- [ ] **1.1** `DEV` `global.css` — full token set (cream / sand / clay / garden / leaf / ink), 8px spacing scale, motion duration + easing tokens
- [ ] **1.2** `DEV` Tailwind 4 `@theme` block in the same file — brand colors, Fraunces/Inter families, fluid clamp-based type scale _(Tailwind 4 is CSS-first; there is no `tailwind.config.mjs`)_
- [ ] **1.3** `ARCH` Self-host Fraunces + Inter as subset `.woff2`, preloaded, `font-display: swap`. **Subset must include Latin-1 Supplement** (á é í ó ú ñ ü ¿ ¡) or Spanish renders with fallback-font flashes
- [ ] **1.4** `DEV` Design and build the logo as **SVG** — heart + sprout lockup, currentColor-driven, animatable _(replaces the unusable `.jpg`)_
- [ ] **1.5** `DEV` `Base.astro` layout — head, meta, skip-link, View Transitions, header/footer slots
- [ ] **1.6** `DEV` `Header.astro` — sticky, transparent over hero, blurs in past 80px, mobile drawer with focus trap
- [ ] **1.7** `DEV` `Footer.astro` — contact, socials, advisor credit, legal status line
- [ ] **1.8** `DEV` Primitives: `Button`, `Section`, `StatCard`, `Eyebrow`, `Reveal`
- [ ] **1.9** `ARCH` Placeholder-asset system: generated SVG/gradient stand-ins for every photo slot, each with a documented swap path so real photos drop in without code changes
- [ ] **1.10** `DEV` Icon system — Lucide inline SVG pipeline + custom seed / sprout / basket / heart set drawn on one grid and stroke-weight
- [ ] **1.11** `DEV` Brand assets from the SVG logo — favicon set, apple-touch-icon, `site.webmanifest`, per-locale OG image template
- [ ] **1.12** `DEV` Language switcher — in header and footer, preserves the current page across locales, `lang`-labelled for screen readers, choice persisted

## Phase 2 — Motion system _(spec: [Animation Spec](#animation-spec))_

- [ ] **2.1** `DEV` `motion.css` — reveal keyframes, easing tokens, global `prefers-reduced-motion` kill-switch
- [ ] **2.2** `DEV` `Reveal.astro` — IntersectionObserver fade-up, `once: true`, stagger support, zero dependencies
- [ ] **2.3** `DEV` **The Growing Vine** — page-height SVG stroke drawing with scroll progress; CSS `animation-timeline: scroll()` with GSAP ScrollTrigger fallback
- [ ] **2.4** `DEV` Hero motion — masked word-rise headline, logo heart DrawSVG, 20s Ken Burns
- [ ] **2.5** `DEV` "How it works" — sequenced seed → sprout → basket → heart
- [ ] **2.6** `DEV` Impact count-up + bar growing from baseline
- [ ] **2.7** `DEV` Micro-interactions — button lift, link underline draw, card hover, leaf unfurl on primary CTA
- [ ] **2.8** `QA` Motion QA — reduced-motion path, 60fps under CPU throttle, zero CLS, no re-animation on scroll-up

## Phase 3 — Content authoring

- [ ] **3.1** `SME` Research and cite prenatal/postpartum nutrition sources (ACOG, CDC, NC WIC). Build the citation set the site will use
- [ ] **3.2** `SME` Author the seasonal NC 7b/8a produce list + the food-safety protocol, both marked _pending clinic approval_
- [ ] **3.3** `SME` Compliance ruleset: zero health claims, accurate non-501(c)(3) status line, recipient-privacy statement — encoded as a lint-able checklist
- [ ] **3.4** `WRITE` Homepage copy `EN` — hero, all section bodies, every CTA and microcopy string
- [ ] **3.5** `WRITE` `/partners` copy `EN` — the clinic-conversion page. Highest-stakes writing on the site
- [ ] **3.6** `WRITE` `/about`, `/get-involved`, `/impact`, `/contact` copy `EN` + all meta titles/descriptions
- [ ] **3.7** `WRITE` **Full Spanish translation `ES`** — every string above, translated for meaning not word-for-word. Latin-American Spanish, plain register, `usted` form
- [ ] **3.8** `SME` Spanish compliance re-check — verify no phrasing drifts into a health claim in translation, and that the non-501(c)(3) status line is legally accurate in Spanish
- [ ] **3.9** `WRITE` Centralize all copy in `src/content/{en,es}/` with a shared schema, so founders edit text without touching components and missing translations fail the build
- [ ] **3.10** `PO` Photography shot list — the exact shots to take, with framing and lighting notes, so the founders can unblock the placeholders in one afternoon
- [ ] **3.11** `PO` Google Forms field spec — exact questions and field types for the volunteer and supply-drive forms, **bilingual**, ready to paste

## Phase 4 — Homepage build

- [ ] **4.1** `DEV` Hero — headline, subhead, dual CTA, scrim
- [ ] **4.2** `DEV` "Why fresh food matters" — 3 stats + cited source
- [ ] **4.3** `DEV` "How it works" — Grow → Harvest → Pack → Deliver, clinic-distribution stated explicitly
- [ ] **4.4** `DEV` "What's in a bundle" — produce list + clinic-approval note
- [ ] **4.5** `DEV` Founders — two cards, named roles, bios
- [ ] **4.6** `DEV` Impact strip — three honest numbers (zeros are fine at launch)
- [ ] **4.7** `DEV` Three-way CTA — Volunteer / Donate supplies / Partner
- [ ] **4.8** `QA` Responsive audit at 375 / 768 / 1024 / 1440

## Phase 5 — Remaining pages

- [ ] **5.1** `DEV` `/partners` — **build first.** Deliverables, food safety, advisor, low-burden ask
- [ ] **5.2** `DEV` `/about` — mission, founders, advisor, timeline
- [ ] **5.3** `DEV` `/get-involved` — volunteer + supply-drive forms (config-driven so real Form URLs drop in)
- [ ] **5.4** `DEV` `/impact` — numbers + Markdown updates log via content collections
- [ ] **5.5** `DEV` `/contact` — names, emails, response expectation
- [ ] **5.6** `DEV` `404.astro` + Worker error page, both on-brand and offering a route back

## Phase 6 — Launch readiness

- [ ] **6.1** `DEV` SEO — per-page title/description, OG image generation, `sitemap.xml`, `robots.txt`, canonicals
- [ ] **6.2** `DEV` JSON-LD `NGO` schema + local-area markup
- [ ] **6.3** `QA` Accessibility audit — keyboard nav, focus rings, 4.5:1 contrast, alt text, axe clean
- [ ] **6.4** `QA` Lighthouse ≥95 all four categories, mobile profile
- [ ] **6.5** `ARCH` Cloudflare config — Polish/WebP, Brotli, cache rules, Web Analytics (free, cookieless)
- [ ] **6.6** `QA` Compliance sweep against 3.3 — no health claims, correct status line, no mother named or pictured
- [ ] **6.7** `DEV` `public/_headers` — CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`
- [ ] **6.8** `DEV` Print stylesheet for `/partners` — clinic staff will print it to show a supervisor; make that page survive paper
- [ ] **6.9** `QA` Cross-browser gate — iOS Safari, Android Chrome, Firefox. Explicitly verify the Growing Vine's `animation-timeline` fallback path renders correctly, not just "doesn't crash"
- [ ] **6.10** `QA` Link audit + end-to-end form submission test against the live Google Forms
- [ ] **6.11** `QA` **i18n QA** — every route resolves in both locales, no untranslated strings, `hreflang`/`x-default` correct, per-locale sitemap entries, language switcher preserves page, Spanish text does not overflow any component (ES runs ~20% longer than EN)
- [ ] **6.12** `PO` Launch sign-off — fresh-eyes test ("what do we do, who do we serve?" in 10s), handover doc, **and account-ownership note** (Cloudflare + GitHub must not be tied to one founder's personal account only)

---

## i18n — English + Spanish

**Decided in scope for v1.** Union County pregnancy centers serve a substantial Spanish-speaking
population. For a maternal-health mission, this is closer to a requirement than a feature — and a
bilingual site is itself a credibility signal to a clinic partner.

| Aspect              | Decision                                                                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Locales             | `en` (default, at `/`) · `es` (at `/es/`)                                                                                                   |
| Routing             | Astro native `i18n` config, `prefixDefaultLocale: false`                                                                                    |
| Content             | `src/content/{en,es}/` sharing one Zod schema — **a missing translation fails the build**, so Spanish can never silently rot behind English |
| Register            | Latin-American Spanish, plain language, `usted` form. Translate for meaning, never word-for-word                                            |
| Switcher            | Header + footer, preserves current page, `hreflang`-labelled                                                                                |
| SEO                 | `hreflang` pairs + `x-default`, both locales in `sitemap.xml`, per-locale OG images                                                         |
| Fonts               | Subset must include Latin-1 Supplement for diacritics                                                                                       |
| Layout              | Spanish runs ~20% longer than English — every component tested against ES strings, not EN                                                   |
| Recipe tool (Ph. 7) | Responds in the user's active locale                                                                                                        |

> ⚠️ **Human review needed.** I write the Spanish, but a fluent speaker should read it before launch —
> especially anything adjacent to health or food safety, where a small register slip reads as either
> condescending or as a medical claim. Add this to the founders' pre-launch checklist alongside the
> advisor sign-off.

---

## Open decisions — founders' call

| #      | Decision                                        | Recommendation                                                                                                                | Consequence of deferring                                |
| ------ | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| **D1** | ~~Spanish translation~~                         | ✅ **DECIDED — in scope for v1.** English + Spanish, bilingual from the architecture up. See [i18n](#i18n--english--spanish). | —                                                       |
| **D2** | Buy `homegrownhearts.org` now vs. after Gate #1 | Buy now (~$10/yr at cost) — K's outreach emails look materially more credible with a real domain.                             | Emails go out with a `*.workers.dev` URL.               |
| **D3** | Who owns the Cloudflare + GitHub accounts       | Create org-owned accounts on the shared project Gmail, not a personal one.                                                    | The org loses its own website when a founder graduates. |

## Phase 7 — AI recipe tool _(blocked on Gate #1: clinic-approved produce list)_

- [ ] **7.1** `DEV` `/recipes` UI — produce checkbox grid, time + difficulty filters
- [ ] **7.2** `ARCH` Worker API route — Cloudflare Workers AI (free daily allocation) or Claude API via `wrangler secret`
- [ ] **7.3** `SME` Hardcoded approved-ingredient allowlist + system prompt forbidding health claims
- [ ] **7.4** `DEV` KV rate limiting + static fallback recipes for quota/outage
- [ ] **7.5** `DEV` QR code generation, print-tested at bag size

---

## Genuinely human-blocked

Everything else is mine. These four are not:

1. **Real photographs** — garden, harvest, packed bundle, founder headshots. I ship placeholders with a one-file swap path.
2. **Advisor name + written permission to publish it.**
3. **Clinic approval** of the produce list and partner logo usage _(Gate #1)_.
4. **Live Google Form URLs** + Instagram handle — I build the forms config-driven so these are a one-line change.

---

## Animation Spec

**Concept:** one idea across the whole page — _a seed becomes a vine becomes a harvest becomes a heart._

### Signature — The Growing Vine

A single continuous SVG stroke runs the full page height, drawing in proportion to scroll progress, sprouting a leaf at each section boundary and terminating in the logo's heart at the footer. Doubles as a reading-progress indicator.
`<path pathLength="1">` + `stroke-dasharray: 1` + `stroke-dashoffset` via `animation-timeline: scroll(root block)`; GSAP ScrollTrigger fallback where unsupported.

### Per section

| Section      | Motion                                                                                                           |
| ------------ | ---------------------------------------------------------------------------------------------------------------- |
| Hero         | Headline words rise from behind a mask (sprouting from soil), 60ms stagger · logo heart draws in · 20s Ken Burns |
| Stats        | Count-up on view, growth-eased                                                                                   |
| How it works | Sequential seed → sprout → basket → heart, 150ms apart                                                           |
| Bundle       | Produce scales in with `back.out(1.4)` overshoot, 80ms stagger — like being packed                               |
| Founders     | Clip-path wipe reveal                                                                                            |
| Impact       | Count-up + bar growing from baseline                                                                             |
| CTA          | Leaf unfurls on hover                                                                                            |
| Footer       | Vine completes into the heart, one gentle pulse                                                                  |

### Seasonal accent drift

Section accent hue shifts down the page: fresh green (grow) → warm gold (harvest) → terracotta (care). Color carries the narrative.

### Motion budget — non-negotiable

- Max **2** animated elements per viewport
- All durations ≤600ms; `ease-out` entering, `ease-in` exiting
- Every reveal `once: true` — **never** re-animate on scroll-up
- **No parallax on text. No scroll-jacking. No smooth-scroll library.**
- Full `prefers-reduced-motion` path: reveals instant, vine pre-drawn, Ken Burns off, counters show final value

> ⚠️ A meaningful share of this audience is in the first trimester. Parallax and scroll-jacking trigger nausea. Restraint here is an accessibility requirement, not a style preference.

### Libraries

GSAP 3 + ScrollTrigger + DrawSVG + SplitText (full plugin suite is free), lazy-loaded only where used. CSS scroll-driven animations preferred wherever they suffice.

---

## Review Log

Every completed task is self-reviewed against **Correctness · Design · Accessibility · Performance · Code quality**, rated /10, with the weakest axis named and either fixed or logged as debt.

| #   | Task                          | Role   | Rating   | Weakest axis | Notes                                                                                                                                                                                                                                                                                                                                                               |
| --- | ----------------------------- | ------ | -------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.1 | Product brief                 | `PO`   | **7**/10 | Judgement    | Audience ranking and constraints are solid and traceable to source material. But the v1 cut-list was **wrong on multi-language** — I cut Spanish for launch speed on a maternal-health project serving a heavily Spanish-speaking county. Founder overruled it and was right. Brief amended; the cut-list now carries a decision table instead of silent omissions. |
| 0.2 | Astro scaffold                | `ARCH` | **8**/10 | Process      | Astro 7.1.4 + TS strict, builds clean in 3.2s. Lost points because `npm create astro .` silently created `./teal-trappist` instead of using the non-empty root — caught immediately and files relocated, but I should have anticipated the non-empty-directory behaviour and scaffolded to a temp path by design rather than by recovery.                           |
| 0.3 | Tailwind + Cloudflare adapter | `ARCH` | **9**/10 | —            | Tailwind 4.3.3 (Vite plugin), `@astrojs/cloudflare` 14.1.5, `wrangler.jsonc` generated with the ASSETS binding and observability on. Plan correction: Tailwind 4 is CSS-first, so the planned `tailwind.config.mjs` task dissolves into `@theme` inside `global.css` — one fewer file, and tokens live next to the CSS that uses them.                              |

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

- [x] **1.1** `DEV` `global.css` — full token set (cream / sand / clay / garden / leaf / ink), 8px spacing scale, motion duration + easing tokens
- [x] **1.2** `DEV` Tailwind 4 `@theme` block in the same file — brand colors, Fraunces/Inter families, fluid clamp-based type scale _(Tailwind 4 is CSS-first; there is no `tailwind.config.mjs`)_
- [x] **1.3** `ARCH` Self-host Fraunces + Inter as subset `.woff2`, preloaded, `font-display: swap`. **Subset must include Latin-1 Supplement** (á é í ó ú ñ ü ¿ ¡) or Spanish renders with fallback-font flashes
- [x] **1.4** `DEV` Design and build the logo as **SVG** — heart + sprout lockup, currentColor-driven, animatable _(replaces the unusable `.jpg`)_
- [x] **1.5** `DEV` `Base.astro` layout — head, meta, skip-link, View Transitions, header/footer slots
- [x] **1.6** `DEV` `Header.astro` — sticky, transparent over hero, blurs in past 80px, mobile drawer with focus trap
- [x] **1.7** `DEV` `Footer.astro` — contact, socials, advisor credit, legal status line
- [x] **1.8** `DEV` Primitives: `Button`, `Section`, `StatCard`, `Eyebrow`, `Reveal`
- [x] **1.9** `ARCH` Placeholder-asset system: generated SVG/gradient stand-ins for every photo slot, each with a documented swap path so real photos drop in without code changes
- [x] **1.10** `DEV` Icon system — Lucide inline SVG pipeline + custom seed / sprout / basket / heart set drawn on one grid and stroke-weight
- [x] **1.11** `DEV` Brand assets from the SVG logo — favicon set, apple-touch-icon, `site.webmanifest`, per-locale OG image template
- [x] **1.12** `DEV` Language switcher — in header and footer, preserves the current page across locales, `lang`-labelled for screen readers, choice persisted
- [x] **1.13** `DEV` **Mobile-first responsive foundation** — every component authored mobile-up (base styles are the small-screen styles, `min-width` queries only), 320px as the narrowest supported width, and an automated no-horizontal-scroll gate (`npm run check:overflow`) run against **both locales** at 320 / 375 / 768 / 1024 / 1440. Most visitors arrive on a phone; mobile is the default case, not the degraded one

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

| #    | Task                          | Role   | Rating   | Weakest axis  | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---- | ----------------------------- | ------ | -------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.1  | Product brief                 | `PO`   | **7**/10 | Judgement     | Audience ranking and constraints are solid and traceable to source material. But the v1 cut-list was **wrong on multi-language** — I cut Spanish for launch speed on a maternal-health project serving a heavily Spanish-speaking county. Founder overruled it and was right. Brief amended; the cut-list now carries a decision table instead of silent omissions.                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 0.2  | Astro scaffold                | `ARCH` | **8**/10 | Process       | Astro 7.1.4 + TS strict, builds clean in 3.2s. Lost points because `npm create astro .` silently created `./teal-trappist` instead of using the non-empty root — caught immediately and files relocated, but I should have anticipated the non-empty-directory behaviour and scaffolded to a temp path by design rather than by recovery.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 0.3  | Tailwind + Cloudflare adapter | `ARCH` | **9**/10 | —             | Tailwind 4.3.3 (Vite plugin), `@astrojs/cloudflare` 14.1.5, `wrangler.jsonc` generated with the ASSETS binding and observability on. Plan correction: Tailwind 4 is CSS-first, so the planned `tailwind.config.mjs` task dissolves into `@theme` inside `global.css` — one fewer file, and tokens live next to the CSS that uses them.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 0.7  | `src/config.ts`               | `ARCH` | **9**/10 | Placeholders  | Every org fact in one typed module with `has.*` guards so components never test placeholder state inline. **Caught a real safety issue the source plan missed:** it lists both founders' personal emails and phone numbers for public use. Both founders are minors; a publicly indexed phone number for a 15-year-old is not recoverable once crawled. `phone` is hard-coded `null` with a comment explaining why, and contact routes through one shared project inbox. Points off because that inbox is still a placeholder needing founder action.                                                                                                                                                                                                                                                                         |
| 0.8  | Cloudflare image service      | `ARCH` | **7**/10 | Verification  | Set to `'compile'`, which is correct — the Workers runtime cannot execute Sharp, so the default would have failed on the first local image. Build confirms the adapter logs "Enabling compile-time image optimization". Rated 7 not 9 because the task's own acceptance criterion was _prove `<Image />` builds_, and there are no images in the project yet. Verification genuinely deferred to 1.9, not quietly dropped.                                                                                                                                                                                                                                                                                                                                                                                                    |
| 0.9  | Tooling + CI                  | `ARCH` | **8**/10 | Verification  | Prettier (+ astro plugin), `astro check` clean at 0 errors / 0 warnings / 0 hints across 6 files, and a GitHub Actions workflow gating type-check, format, and build. The type-check step doubles as the missing-translation gate. Untested in anger — no remote exists yet, so the workflow has never actually run.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 0.10 | i18n foundation               | `ARCH` | **9**/10 | Review needed | Astro native i18n (`en` at `/`, `es` at `/es/`), locale helpers, and hreflang/`x-default` builder. Best decision here: typing `es` as `Record<UIKey, string>` so an omitted Spanish key is a **compile error** — CI now blocks any PR where Spanish falls behind English, which is the usual way bilingual sites rot. Held back from 10 because the Spanish is mine and still needs a fluent reader before launch, and because `hreflang` has nowhere to render until `Base.astro` exists.                                                                                                                                                                                                                                                                                                                                    |
| 0.4  | git init + first commit       | `ARCH` | **7**/10 | Incomplete    | Repo initialized on `main`, 23 files committed clean. Push is **blocked** — `gh` is not installed on this machine and no remote exists, so "push to GitHub" is genuinely unfinished rather than done. Flagged to the founders as an action, not silently marked complete.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 1.1  | Design tokens                 | `DEV`  | **9**/10 | Verification  | Full token set — surfaces, brand, seasonal accents, fluid type, radius, warm-tinted elevation, motion. **Caught three real accessibility bugs by testing rather than eyeballing:** `season-harvest` sat at 2.9:1 and `season-grow` at 3.8:1 against the parchment band, and `leaf` cleared no surface at 3:1. All three are text or meaningful-graphic colors that would have failed the 6.3 gate after every component was already built on them. Root cause was checking accents against cream only, when sections alternate three bands. Retuned and now gated by `npm run check:contrast` in CI.                                                                                                                                                                                                                          |
| 1.2  | Tailwind 4 `@theme`           | `DEV`  | **8**/10 | Correctness   | Probed the generated CSS instead of assuming the namespaces resolve — worth it, because two assumptions were wrong. Tailwind 4 **tree-shakes unused theme variables**, so tokens referenced only from Astro `<style>` blocks (which Tailwind never scans) would have vanished from `:root`; fixed with `@theme static`. And `--duration-*` is not a real namespace, so `duration-base` silently generated nothing — documented the `duration-[var(--duration-base)]` form instead. Points off because both were found by probing after the fact, not by reading the v4 theme docs first.                                                                                                                                                                                                                                      |
| 1.3  | Self-hosted fonts             | `ARCH` | **9**/10 | Judgement     | Fraunces + Inter, variable `wght` 100-900, latin subset, preloaded with `crossorigin`, 83 KB total. The acceptance criterion was Spanish coverage, so I verified it against the **actual cmap** rather than the declared `unicode-range` — `npm run check:fonts` reads every character in the real EN + ES dictionary out of the font tables (123 distinct, all present). Declined the `opsz` builds (+55 KB) against the Lighthouse mobile target; that trade was made on file size alone without rendering both, which is the weak part.                                                                                                                                                                                                                                                                                    |
| 1.4  | Logo — heart + sprout         | `DEV`  | **8**/10 | Verification  | Single 48x48 grid, `currentColor`, `pathLength="1"` on every path so a draw-in works at any size, plus a solid build for small sizes. Rendered each iteration to PNG at 256/64/32/16 and actually looked at it rather than shipping blind geometry — v1's leaves merged into a bar below 32px and v2's sprout was 57% of the heart's width; v3 fixed both. Held at 8 because two founders have not seen their own logo, and `favicon.ico` is still Astro's default until 1.11.                                                                                                                                                                                                                                                                                                                                                |
| 1.5  | `Base.astro`                  | `DEV`  | **8**/10 | Scope         | Head, canonical, hreflang, font preloads, skip link, View Transitions, header/footer slots. Unblocked 0.10's hreflang builder, which had nowhere to render. The inline `.js` class is deliberate: `Reveal` hides content only under it, so a JS failure shows the page instead of blanking it. Points off because social/OG tags are deferred to 6.1, so a link shared today previews bare.                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 1.6  | `Header.astro`                | `DEV`  | **8**/10 | Verification  | Sticky, blurs past 80px behind an `@supports` guard, rAF-throttled scroll. The drawer is a real dialog — focus trap, Escape, `inert` on the background, focus returned to the toggle, and it closes on navigation because View Transitions keep the DOM alive. Rated 8 not 9: the keyboard path is verified by reading and by hand, not by an automated test, and 6.3 should not be the first time it is exercised properly.                                                                                                                                                                                                                                                                                                                                                                                                  |
| 1.7  | `Footer.astro`                | `DEV`  | **8**/10 | Placeholders  | Four columns collapsing to one, both compliance lines rendered from the dictionary in both locales, advisor block that states the neutral fact until a real name exists. The status line is set at body weight on purpose — a legal statement rendered as grey fine print reads as something nobody is meant to check. Held back because the contact address is still a placeholder inbox.                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| 1.8  | Primitives                    | `DEV`  | **7**/10 | Correctness   | Button (renders `<a>` vs `<button>` by role, 44px targets), Section (bands + seasonal `--accent`), Eyebrow, StatCard, Reveal. Lowest score of the phase, and earned: `<Reveal class="stats">` silently did nothing, because **Astro scoped styles do not follow a class passed into a child component**. It type-checked, built, and looked fine in HTML — only a screenshot showed the stats stacked instead of 3-up. Fixed by spreading `...rest` on every primitive so the parent's scope hash lands, and documented at length in Reveal.astro. The real lesson is that nothing in the toolchain can catch this class of bug, so it needed a rendered page to find.                                                                                                                                                        |
| 1.12 | Language switcher             | `DEV`  | **8**/10 | Judgement     | Links, not a dropdown, for two locales. Each points at the _current page_ in the other language, `hreflang` + `lang` set so "Español" is announced in Spanish, `aria-current` on the active one. Persistence applies only to a bare visit to `/`, via `location.replace` so Back is not trapped — deep links are never rewritten. That scoping is a judgement call I would want a second opinion on; auto-switching languages can surprise people even when it is technically what they asked for.                                                                                                                                                                                                                                                                                                                            |
| 1.13 | Mobile-first responsive       | `DEV`  | **9**/10 | Coverage      | Added mid-phase at the founder's direction, and it immediately paid: the header overflowed a 320px viewport by 36px in **both** locales, because the toggle carried a visible "Menu" label. `npm run check:overflow` drives real Chrome over CDP across 320/375/768/1024/1440 in EN and ES, names the offending elements, and now runs in CI against the production build via a dependency-free static server. Fixed with an icon-only toggle and a shrinkable logo (`min-width: 0`). Not a 10 because only two routes exist to test — the gate's real value arrives when Phases 4-5 add pages to it.                                                                                                                                                                                                                         |
| 1.9  | Placeholder assets            | `ARCH` | **9**/10 | Blocked input | `src/photos.ts` declares every photo the site will ever show; `Photo.astro` renders the real file if `src/assets/photos/<id>.jpg` exists and a generated gradient-and-vine stand-in if it does not. The swap path is a **file drop with no code change** — `import.meta.glob` resolves it at build time — and [`docs/PHOTOS.md`](docs/PHOTOS.md) is written for the founders, not for a developer. Two things worth more than the placeholder art: `aspect` is mandatory so a real photo replacing a stand-in cannot shift layout, and a `meaningful` slot **throws at build** without alt text rather than shipping a silent accessibility failure. Also closes 0.8's deferred check — dropped a real 2000x1125 JPEG in, confirmed compile-time optimization produced 1x/2x WebP with intrinsic dimensions, then removed it. |
| 1.10 | Icon system                   | `DEV`  | **8**/10 | Consistency   | `npm run sync:icons` extracts only the 15 icons we use out of `lucide-static` (a devDependency — nothing reaches the bundle) into a generated module, plus five drawn here: seed, sprout, basket, heart for the Grow→Harvest→Pack→Deliver sequence, and Instagram, which Lucide dropped with the rest of its brand marks. Drew each on Lucide's 24 grid and **rendered them to PNG to check the silhouettes** rather than trusting the path data. `Icon.astro` sets stroke weight in one place, so the library and custom sets are indistinguishable. Corrected a false claim in Logo.astro while here: it said the logo shared the icon grid, and it does not — 48 vs 24, matched by eye.                                                                                                                                    |
| 1.11 | Brand assets                  | `DEV`  | **8**/10 | Fidelity      | One `npm run brand` generates favicon.svg, a hand-assembled multi-size favicon.ico (sharp cannot write ICO, so the directory structure is built by hand), opaque padded apple-touch-icon, 192/512 maskable PWA icons, the webmanifest, and a 1200x630 OG card per locale — all from the single mark in `src/brand.js`, which Logo.astro now imports too, so the favicon can no longer drift from the logo. **The honest weakness:** the OG cards render through sharp with no webfont, so they fall back to Georgia rather than Fraunces. Legible and correctly typeset — Spanish diacritics verified — but it is not the site's typeface. Task 6.1 owns per-page OG generation and should re-render these through the headless-Chrome pipeline already in `scripts/check-overflow.mjs`, which would use the real fonts.      |

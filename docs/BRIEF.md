# Product Brief — Homegrown Hearts Website

**Owner:** Product Owner role · **Status:** approved for build · **Version:** 1.0

---

## 1. What this organization does

Homegrown Hearts is a student-led initiative in Union County, NC. It grows fresh produce in a small
local garden and assembles free produce bundles for pregnant and postpartum mothers. Bundles are
distributed **through a partner clinic** — never handed directly to families by the founders.

Founded by two rising 10th graders: Kreeshma Vasikarla (Mission & Medical) and Charishya Yarram
(Operations & Technology), operating under an adult advisor.

## 2. What this website is for

The site exists to convert **adults** into three actions: partner with us, donate supplies, volunteer.

The single highest-value job it does is make a clinic staffer, reading a cold email from two
15-year-olds, decide these people are credible and worth 20 minutes.

## 3. Audience, in priority order

| #     | Audience                            | Arrives via                                 | Needs to feel                                    | Their action                       |
| ----- | ----------------------------------- | ------------------------------------------- | ------------------------------------------------ | ---------------------------------- |
| **1** | **Clinic / pregnancy center staff** | Link in K's outreach email                  | "This is organized, safe, and low-burden for me" | Reply to the email, take a meeting |
| **2** | Local donors & volunteers           | Instagram bio, library flyer, word of mouth | "This is real and my tools/hours will be used"   | Submit a form                      |
| **3** | Community & local press             | Search, community Facebook                  | "This is a genuine local story"                  | Share, feature                     |
| **4** | Admissions readers (2–3 yrs out)    | Direct link on an application               | "This person built something that lasted"        | —                                  |

**Mothers are not a website audience in v1.** They receive a physical bag; they never visit this site.
They become the primary audience of exactly one page — `/recipes` — in Phase 7, reached by QR code
on the bundle insert card. Designing v1 for mothers would be designing for traffic that does not exist.

## 4. Success criteria

**Primary (the site is working):**

- A clinic staffer can answer "what do they deliver, how is it safe, what do they need from me" without
  leaving `/partners`
- At least one clinic partnership meeting is attributable to the site link
- Volunteer and supply-drive form submissions arrive from people the founders did not personally ask

**Secondary (the site is good):**

- Lighthouse ≥95 across Performance, Accessibility, Best Practices, SEO on mobile profile
- Fresh-eyes test: a stranger states what the org does and who it serves within 10 seconds
- Zero health claims, zero implied 501(c)(3) status, zero mothers named or pictured
- Founders can update copy and impact numbers without an engineer

**Explicit non-goals for v1:** online cash donations, mother-facing accounts, a blog, a newsletter,
multi-language, a CMS admin UI.

## 5. Scope

### In — v1 (launch)

Seven pages: `/`, `/about`, `/partners`, `/get-involved`, `/impact`, `/contact`, plus 404.
Full design system, the concept-driven motion system, embedded Google Forms, Markdown-driven impact
updates, SEO + structured data, self-hosted fonts, Cloudflare Workers deploy.

### In — Phase 7 (post-launch, gated)

`/recipes` AI tool + QR code. **Blocked on Gate #1** — a clinic must approve a produce list before an
AI can be constrained to it. Building this first would be building on sand.

### Cut from v1 — and why

| Cut                       | Reason                                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------------------ |
| Online cash donations     | No 501(c)(3), no bank account. Accepting money would create a real legal problem, not a feature. |
| Blog                      | Two founders with a garden to run will not sustain it. An empty blog is worse than no blog.      |
| Newsletter                | No list, no sender reputation, no time. Instagram covers this.                                   |
| Custom volunteer database | Google Forms works today for free. Revisit only if volume justifies it.                          |
| Mother-facing content     | No traffic until QR codes exist.                                                                 |
| Dark mode                 | Warm cream palette is the brand. A dark variant doubles QA for near-zero audience benefit.       |

## 6. Constraints

**Hard:**

- **$0 budget** apart from the ~$10/yr domain. Every dependency must be free at this scale.
- **No health claims anywhere.** Describe the food, never its effects. Non-negotiable — this is the
  line between a student food project and unlicensed medical advice.
- **Not a 501(c)(3).** The site must state status accurately and never imply tax-deductibility.
- **No mother is named, photographed, or described**, even anonymously with identifying detail.
- Produce list and bundle contents are **clinic-approved**, and the site says so.

**Soft:**

- Founders must be able to maintain it. Complexity they cannot edit is a liability, not an asset.
- The build should be genuine portfolio evidence for C — real tooling, real repo, real deploys.

## 7. Positioning

**Credible first, warm second.** The failure mode for a student nonprofit site is looking like a school
project: bright colors, clip-art, exclamation marks, stock photography of smiling strangers.

We counter with restraint — warm earth palette, editorial typography, generous whitespace, real
photographs of actual dirt, a named adult advisor, and cited sources. Warmth comes from the palette and
the photography, not from decoration.

**Tone:** plain, specific, quietly confident. Never precious about the mission. Numbers stated honestly,
including small ones.

## 8. Risks

| Risk                                     | Mitigation                                                                               |
| ---------------------------------------- | ---------------------------------------------------------------------------------------- |
| Gate #1 fails — no clinic partner        | `/partners` is built to convert. Site works as an outreach asset regardless.             |
| No real photos at launch                 | Placeholder system with one-file swap path; no code changes needed later.                |
| Site launches then goes stale            | `/impact` is Markdown-driven; monthly update is a 5-minute edit. Handover doc covers it. |
| Motion causes nausea in target audience  | Hard motion budget + full reduced-motion path. QA gate before launch.                    |
| Copy drifts into health claims over time | Compliance ruleset written as a checkable list; QA sweep is a launch gate.               |

## 9. Definition of done for v1

All Phase 0–6 tasks complete and self-reviewed, both QA gates passed (accessibility + compliance),
Lighthouse target met, site live on the custom domain, and a handover doc exists that lets the founders
update copy, photos, and impact numbers on their own.

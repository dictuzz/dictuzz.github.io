# dictuzz.me — Awwwards and Checklist Design Audit

**Prepared:** 5 November 2026  
**Scope:** Public site at `https://dictuzz.me/` and the supplied repository snapshot  
**Purpose:** Identify the work needed to make this portfolio a credible, public-facing Awwwards submission. This is an improvement plan, not a promise of an award.

## Executive assessment

The site has useful raw material: a distinctive editorial portfolio direction, several real case-study narratives, measurable outcomes, multilingual content, semantic page shells, responsive styles, reduced-motion rules, and a static architecture with no framework runtime. Its strongest work is not currently reachable by a first-time visitor. On 5 November 2026, the live `/portfolio/` page displayed an “Authorized Personnel Only” passphrase gate. The same `portfolio.js` module is loaded by the case pages, and the module adds a page-hiding class unless a session flag is set. This is the release-blocking issue for an award entry.

The root page is a centered profile/link hub. It introduces the person and role, but sends the visitor elsewhere for proof of work and keeps contact/social groups collapsed. The richer portfolio is a better potential entry surface, but needs to be publicly accessible, more demonstrative, and more uniquely interactive. Editorial styling and strong copy are a promising direction; the currently documented work does not yet show enough original visual evidence, interface craft, or interaction to compete at the Awwwards level.

**Does it fulfill every Checklist Design standard? No—and “every” is not a meaningful target.** Checklist Design is a library of checklists for different website pages, product surfaces, components, and flows, rather than one universal certification standard. A personal portfolio does not need checkout, signup, or other unrelated product checklists. The relevant page patterns provide a useful review lens, but completing a page checklist alone does not establish accessibility conformance or award readiness.

## What was reviewed

- Live homepage accessibility tree and live portfolio page in a browser.
- Root HTML/CSS/JS, portfolio landing HTML/CSS/JS, one case page, resume shell, resources page, content model, Lighthouse CI configuration, and project documentation.
- Awwwards’ published evaluation page and relevant Checklist Design page-library material.

This was a focused design and source review, not a full production QA cycle. No Lighthouse, axe, keyboard-only, screen-reader, cross-browser, device, or performance test was run. The Lighthouse configuration sets accessibility/performance/SEO targets but is not evidence that the current site meets them. Several deeper site pages were not visually inspected. Findings below separate observed facts from recommendations and areas that still need verification.

## Awwwards evaluation lens

Awwwards publishes four weighted criteria: **Design 40%, Usability 30%, Creativity 20%, Content 10%**. Its evaluation page states that at least 18 jury members score approved sites; the three scores furthest from the average are removed. It states that a jury score of 6.5 or higher earns an Honorable Mention, while Site of the Day is awarded to the highest-scoring work. These are competitive outcomes, not a checklist guarantee. [Awwwards evaluation system](https://www.awwwards.com/about-evaluation/)

The ratings below are **directional audit estimates**, not Awwwards scores or a prediction. Accessibility and performance can affect the experience within the published criteria, but Awwwards does not publish a separate weighted accessibility criterion on this page.

## Implementation update — 5 November 2026

The following improvements have now been made in the repository. The root page remains a link hub, as requested.

- Removed the client-side passphrase overlay, digest check, and page-hiding CSS from the shared portfolio runtime. The landing page and all four case pages are now authored as public content.
- Added direct “lead case” and contact actions to the portfolio masthead, with English, Indonesian, and German labels.
- Restored every portfolio navigation link at phone widths using a horizontally scrollable, wrapped navigation row.
- Added a translated, custom before/after process diagram to each of the four case studies. The maps are built from the case details already in the repository and are included in prerendered HTML for no-JavaScript access.
- Updated `scripts/prerender_portfolio.py` so future content edits keep the new CTAs and case diagrams in generated HTML.
- Reworked the portfolio art direction into a dark, technical field-notes system: large typographic cover, orbit/routing motif, lime action color, responsive project index, and clearer case-study hierarchy. The root page remains the link hub.
- Added four original SVG case visuals and localized the portfolio’s key positioning, hero labels, work captions, and project artwork alternatives in English, Indonesian, and German.
- Rebuilt the generated static HTML after updating its source content so the landing page and case pages retain meaningful content before JavaScript runs.

The remaining work is verification and evidence-dependent: replace conceptual diagrams with approved project artifacts where available, document the measurement basis for outcome claims, and complete keyboard/screen-reader/mobile/performance audits. No automated tests or audits were run in this implementation pass. Changes are local to the repository; they have not been deployed to `dictuzz.me`.

| Criterion | Directional estimate | Evidence and gap |
|---|---:|---|
| Design (40%) | 5/10 | Portfolio has a consistent newspaper/editorial language, Fraunces/Manrope pairing, and paper/ink palette. Root page’s profile-card/link-hub composition is familiar; portfolio is blocked by a gate. Case visuals are explicitly described as illustrative photography rather than project evidence. No reviewed interaction or art direction currently creates a memorable signature. |
| Usability (30%) | 3/10 live; 6/10 underlying structure | Live portfolio and case routes are not available to a normal first-time visitor due to the passphrase screen. Root page has a clear hierarchy and semantic buttons/links, but key contact/social actions are hidden in collapsed folders. Mobile portfolio CSS hides two topbar links at narrow widths. Keyboard, touch, screen reader, zoom, and responsive behavior need verification. |
| Creativity (20%) | 4/10 | “The Operational Record” is a cohesive editorial concept, but the current implementation relies mainly on conventional cards, headings, scroll reveals, theme/language switches, and a progress line. Strengthen the concept through custom data visualization, an interactive operational artifact, or a bespoke visual narrative tied to the work. |
| Content (10%) | 6/10 potential; 3/10 accessible | Case copy has memorable headlines, context, solution, impact, and quantitative claims. The gate blocks the portfolio content. Proof is mostly prose and illustrative imagery; provide redacted real artifacts, workflow diagrams, before/after states, role clarity, and substantiation for metrics. |

## Critical and high-priority findings

### P0 — Make the portfolio publicly accessible

**Observed:** Live `/portfolio/` shows a passphrase gate. `portfolio/portfolio.js` contains a hard-coded expected SHA-256 digest, checks a browser session flag, and adds `is-locked` to the document. `portfolio/portfolio.css` hides the page behind the overlay. The landing and case pages load this script. The portfolio HTML, locale JSON, case shells, and asset files remain statically served.

**Why it matters:** A judge, recruiter, or visitor cannot assess the core work. The mechanism is client-side, so it does not protect static content from a visitor inspecting or requesting the delivered files. It adds friction without providing meaningful access control.

**Plan:** Remove the gate from the public portfolio and every case page. If a project contains confidential material, publish a redacted public version and keep private files outside this public static site. Update crawler metadata/structured data so all listings accurately point to publicly accessible work. Revisit the invitation-only language and request-access link after the gate is removed.

### P1 — Make the portfolio the primary award experience

**Observed:** The root page presents a portrait, name, role, availability, date/time, and accordion folders. The portfolio’s editorial landing page is the substantive work surface but is one click away and currently gated.

**Plan:** Create one intentional entry journey: a concise claim about the work, immediate featured case proof, selected projects, a clear contact action, and a coherent visual transition into the case archive. The root can remain a compact directory if desired, but the Awwwards submission should land on the publicly accessible surface that best showcases the experience.

### P1 — Replace illustrative imagery with project evidence and custom art direction

**Observed:** The automation case image caption says the operational dashboard is used as illustration; the file is a generic photo. The case narrative has metrics, but no visible workflow diagram, original interface, artifact, or documented before/after sample was part of this review. Two portfolio image assets exist (`automation.jpg`, `governance.jpg`, `events.jpg`); there is not a broad custom visual system around the cases.

**Plan:** For each case, prepare privacy-safe evidence: redacted workbook/form screenshots, process maps, dashboard crops, SOP excerpts, timeline or stage plots, equipment-readiness systems, and annotated before/after states. Use original diagrams and visualizations where the actual interface cannot be shared. Label illustrative assets honestly and avoid making stock photos carry the proof burden.

### P1 — Make the differentiator visible in the experience

**Observed:** The editorial “record” metaphor is mainly expressed through typography, masthead, labels, and story layout. This is coherent but not yet a distinctive interaction or technical demonstration.

**Plan:** Build one meaningful, lightweight signature interaction from the work itself: for example, an interactive reporting-cycle map showing the weekly handoffs before/after, an explorable KPI governance timeline, or a live-operations cue sequence. Keep it keyboard-operable, understandable without animation, and useful rather than decorative. Avoid generic 3D/parallax effects that do not deepen the operational story.

### P1 — Strengthen proof, attribution, and case-study detail

**Observed:** The lead case reports “12+ hours” saved weekly, three functions aligned, and a shared routine. The story explains context, what was built, and outcome. It does not show the calculation method, baseline period, measurement method, concrete workbook/SOP artifacts, technical constraints, individual contribution boundaries, or an attributed client validation in the reviewed content.

**Plan:** For every featured case, show: client/context and dates; problem baseline; constraints; your role and collaborators; process/design decisions; implementation details; evidence/artifacts; measurable outcome and how it was measured; what changed after handoff; and a concise takeaway. Confirm all claims and any client-identifying material are approved for public use. The statement “12+ hours saved” is strongest when the measurement basis and whether it is estimated or observed are explicit.

### P1 — Improve the first-contact path

**Observed:** Homepage contact is described in a collapsed “Contact Me” group. The footer exposes email and WhatsApp. The portfolio has a contact section in its content, but its live view was blocked.

**Plan:** Add one persistent, descriptive contact action on the primary journey (such as “Discuss an operations problem”) and provide a direct email link without requiring accordion discovery. Keep alternate contact options available but visually secondary. State the preferred contact route and availability plainly.

## Checklist Design coverage

Checklist Design describes itself as a library covering websites, web apps, mobile, components, and flows. Its checklists are specific to the page or pattern being designed, so not every checklist applies to this personal portfolio. [Checklist Design library](https://www.checklist.design/)

The directly relevant checklist page that could be inspected in indexed content is **About Website**. It lists origin story, mission/values, team, milestones/traction, investors/backers where relevant, and a CTA. For a solo portfolio, investors/backers are not applicable; “team” can be reframed as a clear introduction to the person and collaborators; milestones are better expressed as verified outcomes and work history. The About Website checklist is not a universal homepage or portfolio certification. [About Website checklist](https://www.checklist.design/website/about)

| Relevant pattern/check | Current evidence | Status |
|---|---|---|
| Clear identity and purpose | Name, role, and positioning appear above the fold on the root. Portfolio copy identifies systems/automation work. | **Partial** — clear role, but broad “Systems Architect” promise is not immediately translated into a specific audience/problem/outcome. |
| About / origin story | Summary and career details exist in the resume; portfolio introduces operational work. | **Partial** — add the personal motivation and point of view that make the editorial concept meaningful. |
| Values or working principles | Portfolio says the work is structured, calm, evidence-led in its dossier. | **Partial** — show how those principles affect decisions and outcomes, not only as labels. |
| Human introduction / team | Root portrait and full name; case bylines identify the author. | **Pass with caveat** — collaborators and role boundaries are not consistently visible in reviewed case material. |
| Milestones / proof | Homepage metadata cites 12+ hours, 34 team members, and events over 1,000; portfolio has quantified case facts. | **Partial** — bring evidence forward, substantiate metrics, and make proof publicly reachable. |
| Clear CTA | Footer has email/WhatsApp; homepage has contact folder. | **Partial** — contact is too easy to miss; make one direct CTA prominent. |
| Portfolio/work page | Four detailed case routes are linked from portfolio HTML and represented in JSON-LD. | **Fail in live journey** — passphrase barrier prevents access; visuals/proof also need improvement. |
| Contact pattern | Email/WhatsApp exist; portfolio includes a contact section in source. | **Partial / unverified** — route exists in source, but accessibility/behavior and the live public state need review after gate removal. |
| Navigation and wayfinding | Skip links and semantic nav are present in reviewed HTML; multiple pages use shared sections. | **Partial** — portfolio mobile CSS hides Home and Resume links at narrow widths; verify consistent nav, current-page context, and footer across all public routes. |
| Accessibility and interaction states | Skip links, `:focus-visible`, `aria-label`, reduced-motion CSS, semantic headings/landmarks are present in reviewed surfaces. | **Unverified** — source support is encouraging, but no keyboard, screen-reader, contrast, zoom/reflow, target-size, or automated audit was run. |
| Content/image integrity | Copy is specific and outcome-led; portfolio labels some photos illustrative. | **Partial** — add project artifacts and evidence so visual content is accurate and case claims are auditable. |

**Checklist Design conclusion:** relevant patterns are partially met. The most obvious unmet requirement is not a missing generic page element; it is that the work is unavailable to the public. After fixing access, map the live pages against their applicable checklists one by one. Do not claim “Checklist Design certified” or “all standards passed.”

## Experience and implementation review

### Strengths to preserve

- The portfolio has a coherent editorial identity: “The Operational Record,” issue straps, case files, bylines, and carefully written headlines.
- Cases follow a useful narrative arc (context → build → outcome) and use concrete numbers.
- Page shells include meaningful titles/descriptions, canonical URLs, Open Graph metadata, structured data, and alternate locale links.
- The portfolio has language and theme controls, semantic landmarks, skip links, focus styling, and reduced-motion CSS in source.
- Static HTML and vanilla JS keep the runtime relatively simple; README documents the architecture and Lighthouse CI thresholds.

### Further improvements after P0

1. **Unify the public brand journey.** Root, resume, resources, and portfolio currently use related type/color tokens but different composition and purpose. Make navigation, footer, contact, logo behavior, and active-page cues consistent while preserving the editorial portfolio art direction.
2. **Clarify the homepage information hierarchy.** The root profile hub is visually centered around a large portrait and name; make the portfolio/case proof and primary action prominent in the first viewport. Keep date/time only if it supports a clear use case.
3. **Make interactions self-describing.** Ensure theme toggle says the action/result, accordions announce expanded state and controls, and language controls have a group label and accessible names. Provide visible focus and hover/pressed states for all controls.
4. **Audit mobile header behavior.** At widths up to 720px, portfolio CSS hides nav links except the last two. Confirm the remaining choices are the right top tasks on both landing and case pages; retain a clear route to the full archive, home, resume, and contact.
5. **Reduce external-resource fragility.** Google Fonts are requested from an external host on all portfolio and several site pages. Consider self-hosting only the used font files with appropriate subsets and fallback tuning, or ensure the design remains polished when the font request fails.
6. **Optimize motion and runtime.** Keep reveal animations progressive-enhancement only, honor reduced motion on every route, avoid layout shifts, and make the portfolio useful without JavaScript. Ensure locked overlay code is removed so no runtime failure can blank the primary work.
7. **Check metadata consistency.** The portfolio schema advertises eight items including external short links and an external report. Confirm each destination is stable, safe, current, and named accurately; prefer direct, branded URLs over short links. Ensure metadata count and public work remain accurate after any project changes.
8. **Review privacy and contact disclosure.** Contact details and social links are intentionally public. Explain how any external links behave and avoid unexplained redirects. Review the terms/privacy pages for relevance to the actual static site and third-party resources.

## Prioritized improvement plan

### Phase 1 — Remove submission blockers (first)

- Remove the portfolio lock overlay, digest check, session gate, and “request access” flow from public portfolio/case pages.
- Confirm `/portfolio/` and all four case URLs load for a clean browser session, direct deep link, and crawler/no-JavaScript fallback.
- Update landing copy so a visitor understands the offer, audience, and lead outcome immediately.
- Put a direct primary contact action and selected-case links in the first viewport.
- Replace generic/illustrative lead imagery with at least one authentic, redacted artifact or original explanatory diagram.

**Exit condition:** an anonymous visitor can open the portfolio and every case directly and understand the work without signing in, asking for access, or relying on JavaScript.

### Phase 2 — Build a winning case-study system

- Develop three flagship case studies (automation, KPI governance, live operations) to a consistent depth; keep other experiences as a concise archive.
- For each, show the challenge, constraints, role, process, key decisions, artifacts, quantified result, method of measurement, and handoff/maintenance outcome.
- Commission/create bespoke diagrams, visual evidence, and a clear art direction tied to each project.
- Make statements specific and defensible; distinguish measured outcomes from estimates and obtain permission for identifiable client material.

**Exit condition:** the three lead cases demonstrate the quality of both the thinking and the execution, not only the claims.

### Phase 3 — Add a memorable but purposeful interaction

- Choose one interaction that reveals the operational system (before/after flow, weekly reporting cycle, KPI cadence, or backstage cue sequence).
- Design it for touch, keyboard, screen readers, reduced motion, and small screens from the beginning.
- Use motion to clarify cause/effect or sequence; keep static alternatives and avoid scrolljacking.

**Exit condition:** the signature interaction is distinct to this portfolio, improves comprehension, and remains fully usable with motion disabled.

### Phase 4 — Complete a quality and polish pass

- Audit every route with keyboard only, screen reader, browser zoom/reflow, mobile widths, dark/light themes, and language switching.
- Run axe and Lighthouse against the deployed build; record real results for accessibility, performance, best practices, and SEO and fix the highest-severity issues.
- Verify text contrast, tap-target size, focus visibility, image alternative text, heading order, title/description uniqueness, broken links, and external-link behavior.
- Test loading with slow network/font failure, JS disabled, and a fresh session; verify no hidden content, console errors, or layout shifts.
- Check case images are compressed, responsive, and loaded at appropriate priority; lazy-load below-the-fold media and reserve dimensions.

**Exit condition:** published performance/accessibility measurements and manual QA show a stable, fast, usable experience on mobile and desktop. Treat WCAG AA as a target and verify it; source patterns alone do not prove conformance.

### Phase 5 — Prepare the Awwwards submission

- Submit the public URL only after Phase 1–4; choose the strongest landing URL rather than assuming `/` is automatically the right entry.
- Prepare a concise concept statement and accurate credits. Identify roles and collaborators transparently.
- Produce strong submission captures that show the full experience and responsive behavior; make sure the live site matches the submitted material.
- Recheck every public route and asset immediately before submission and while it is under review.

## Suggested success metrics

- 100% of featured case URLs accessible anonymously, including direct deep links.
- First viewport clearly communicates who the portfolio is for, the work delivered, one evidence-backed result, and the next action.
- Three flagship cases each contain at least one authentic or original evidence visual, a clear contribution statement, and a substantiated outcome.
- No critical or serious axe findings; manual keyboard and screen-reader review completed.
- Lighthouse accessibility at or above the project’s configured 0.98 target and performance at or above the configured 0.90 target on the representative routes, with test environment and date recorded.
- No broken internal links, dead short links, image layout shifts, or required content hidden behind interaction/motion.

## Final verdict

The repository now has a public-facing portfolio direction, an ungated landing page, direct case/contact actions, and original explanatory visuals while preserving the root link hub as requested. This is a substantial design and content improvement, but **it is not yet verified as an Awwwards-ready submission**: live deployment, authentic project evidence, substantiation for outcome claims, and hands-on accessibility/responsive/performance QA remain outstanding. Use the `/portfolio/` route as the award experience while keeping `/` as the personal link hub. Reassess the published site against the quality gates above before submitting.

## Sources

- [Awwwards — Evaluation System](https://www.awwwards.com/about-evaluation/)
- [Checklist Design — Checklist library](https://www.checklist.design/)
- [Checklist Design — About Website checklist](https://www.checklist.design/website/about)
- Repository evidence: `index.html`, `css/site.css`, `portfolio/index.html`, `portfolio/portfolio.css`, `portfolio/portfolio.js`, `portfolio/cases/*/index.html`, `content/portfolio/locales/en.json`, `lighthouserc.json`, and relevant resume/resources shells.

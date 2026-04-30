# Wireframe Plan — CKM Connection Explorer (Full Page)

Instructions for a designer / design AI to produce wireframes for the full CKM education page. The interactive Venn diagram is **one section** within a longer, scroll-based page that layers complementary content and interactions.

---

## Project context (read first)

- **Audience:** general consumer / patient. **Zero baseline knowledge.** Grade 5–8 reading level.
- **Tone:** delightful but serious; warm, modern, approachable; empowering, not overwhelming.
- **Posture:** patient-led — users define their own path; this should feel like guidance, not instruction.
- **Constraints:** no login, no account creation, anonymous analytics, session-based (cookie) personalization. Lives on `heart.org`. Built in Sitecore.
- **Success metrics:** completion rates, time spent, topic interest patterns. Wireframes should make those signals trackable (clear section boundaries, distinct interactive moments).
- **Repeatability:** the page should reward return visits — users should be able to pick up where they left off and not be forced to re-do the same flow.

Source content for all copy: `_context/01-content-deduped.md`. Use the plain-language phrasing as written; don't medicalize it.

---

## Page architecture

A single long page with anchored sections. Sticky in-page nav (top or side) lets users jump between sections — supports both linear reading and self-directed exploration. Visited sections show a checkmark or color shift (cookie-driven).

```
┌─────────────────────────────────────────────────┐
│  1. Hero / Intro                                │
│  2. CKM Connection Explorer  ← Venn diagram     │
│  3. By the Numbers           ← stats            │
│  4. Know Your Numbers        ← 5 factors        │
│  5. Stages of CKM Syndrome   ← severity ladder  │
│  6. Take Action              ← Life's Essential 8│
│  7. Closing CTA              ← schedule / learn │
└─────────────────────────────────────────────────┘
```

A **persistent CTA element** ("Schedule a checkup" → `heart.org/myCKMhealth`) appears in the page header or as a sticky footer bar so users can convert from anywhere.

---

## Section 1 — Hero / Intro

**Purpose:** Hook the user with the core idea (your body works as a team) before any medical content.

**Content:**
- Overline: `American Heart Association`
- Headline: something close to *"Your body works as a team."*
- Subhead: *"Heart, kidneys, and the way your body creates energy each have different jobs — but they share the work to keep you healthy. When one part isn't working well, it can affect the others."*
- A short scroll cue ("Explore the connection ↓")

**Interaction / motion:**
- Subtle ambient animation suggesting connection (e.g. three abstract shapes drifting toward and away from each other, soft lines pulsing between them).
- No clinical imagery, no charts. Emotional, not informational.

**Layout:** Full-bleed, generous vertical space, single-column, large type.

---

## Section 2 — CKM Connection Explorer (the Venn diagram)

**Purpose:** Let users explore each system and the overlaps at their own pace.

**Content:** Already implemented in `ckmh-connections-vN.vue`. Pull region copy from `src/data/ckmh-connections.js`.

**Interaction:** Click/hover the three circles or their overlaps to reveal:
- Plain-language explanation
- "Why this matters to you" callout
- Simple definition (e.g. *what metabolism actually means*)
- Optional short article / video link

**Layout:** Diagram on the left (or top on mobile), content panel on the right (or below) that swaps as users select regions. Visited regions are visually marked.

**Wireframe note:** show the diagram in 2 states — closed (diagram only, full width) and open (diagram + side panel). Include a small "you've explored 3 of 7 — see the full connection →" nudge that appears mid-exploration.

---

## Section 3 — By the Numbers

**Purpose:** Establish scope and relevance. *"This applies to almost everyone."*

**Content (stat cards):**
- **9 in 10** U.S. adults (20+) have at least one CKM risk factor
- **8 in 10** young adults (20–44) are affected
- Only **10%** of U.S. adults have excellent CKM health
- **1 in 7** U.S. adults have kidney disease
- More than half have prediabetes or diabetes

(Use 4–5 stats max — pick the most striking. Full list in `_context/01-content-deduped.md`.)

**Interaction:**
- Numbers count up when scrolled into view.
- Cards are subtly animated (entry on scroll, hover lift).
- Optional: a small toggle between "U.S. adults" and "young adults" comparing the same stat across age ranges.

**Layout:** Horizontal row of cards on desktop; stacked on mobile. Bold, big-number typography. Background contrasts with surrounding sections.

---

## Section 4 — Know Your Numbers

**Purpose:** Translate "CKM" into the five concrete things to know about your own body.

**Content:** Five interconnected factors (each gets a card or expandable row):
- Blood pressure
- Cholesterol
- Weight (especially around the waist)
- Blood glucose
- Kidney function

For each: short plain-language description + the screening test that measures it. Reinforce: *"Each can worsen or improve the others."*

**Interaction:**
- Cards expand on click to show: what it is, why it matters, what test measures it, what to ask your doctor.
- A "show me my checklist" button gathers all five into a printable / shareable list users can take to a doctor's appointment.

**Layout:** 5 cards in a responsive grid (3+2 on desktop, 1-col on mobile). Color coding ties each factor to one of the three Venn regions where it primarily belongs.

---

## Section 5 — Stages of CKM Syndrome

**Purpose:** Communicate that this is a continuum, and that early action helps. Avoid medical anxiety — frame as *"here's where action helps most."*

**Content:**
- Plain-language description of progression: from healthy → risk factors present → early disease → advanced disease.
- At each stage, a one-line "what helps here" message.
- Reinforcing message: *"Many aspects are preventable, treatable, and sometimes reversible."*

**Interaction:**
- Horizontal stepper with stages 0–4 (or however the actual AHA staging is defined; confirm with stakeholder).
- Click a stage to expand its description.
- Scroll-driven progression (active stage advances as user scrolls within the section) optional but high-impact.

**Layout:** Horizontal on desktop with arrow connectors; vertical timeline on mobile.

---

## Section 6 — Take Action

**Purpose:** Convert understanding into specific daily behaviors. This is the *empowering* section.

**Content:** Life's Essential 8 — the eight habits critical to heart and overall health. Anchor message: *"Improving even one improves how your body functions. Small changes, made consistently, add up."*

**Interaction:**
- 8 tiles in a grid, each with an icon + name (e.g. Eat Better, Be Active, Quit Tobacco, Get Healthy Sleep, Manage Weight, Control Cholesterol, Manage Blood Sugar, Manage Blood Pressure).
- Click a tile → modal or expanded panel with what it means, why it helps CKM health specifically, and 1–2 small starting steps.
- Optional: "pick one to focus on this week" — saves to cookie, surfaces on return visit.

**Layout:** 4×2 grid on desktop, 2×4 on tablet, 1×8 on mobile. Tiles use color and iconography only — no text-heavy cards.

---

## Section 7 — Closing CTA

**Purpose:** Drive to action — schedule a checkup or learn more.

**Content:**
- Headline: *"Early detection is strong protection."*
- Subhead: *"Schedule a checkup of your heart, kidney, and metabolic health."*
- Two paths:
  - Primary CTA: **Schedule a checkup** → `heart.org/myCKMhealth`
  - Secondary CTA: **Learn more about CKM** → article hub
- Optional tertiary: "Print my CKM checklist" (from Section 4)

**Layout:** Full-bleed, high-contrast, single focal CTA. Quiet — final breath of the page.

---

## Cross-cutting requirements

### Navigation

- Sticky in-page nav (chips or numbered dots) listing the 7 sections. Active section highlights as user scrolls. Visited sections (cookie) get a subtle checkmark.
- The nav also serves as a progress indicator — supports the "completion rate" metric.

### Repeatability / return-visit handling

- Cookie remembers: last-visited section, regions explored in the Venn diagram, the user's chosen "focus this week" habit (Section 6).
- On return, show a small "Welcome back — pick up where you left off" banner that scrolls user to their last position. Dismissible.

### Accessibility

- All interactives keyboard-navigable, with focus-visible states.
- Color-coded factors must also have non-color identifiers (icons, labels).
- Animations respect `prefers-reduced-motion`.
- Reading level: aim for grade 5–8 (Hemingway / Flesch-Kincaid). Avoid clinical jargon — explain terms inline.

### Responsive

- Design 3 breakpoints: mobile (≤640), tablet (641–1024), desktop (≥1025).
- The Venn diagram (Section 2) shifts from side-by-side to stacked at the tablet breakpoint.
- Sticky elements (nav, CTA) collapse to a bottom bar on mobile.

### Analytics hooks

Each section should be visually distinct enough to track:
- Section-in-view events (for time-spent-per-section)
- Region clicks within the Venn (topic interest)
- Card / tile expansion events
- CTA clicks (primary, secondary, tertiary)
- Habit-of-the-week selection

### Visual system

- Carry through the three Venn region colors (heart, kidney, metabolic) consistently across sections — same color = same system everywhere on the page.
- Iconography: warm, slightly hand-drawn or organic, not clinical. Existing organ illustrations in `_assets/Human Organ /` may be a starting point.
- Generous whitespace. The page should feel calm even with this much content.

---

## Deliverables for the wireframe pass

1. Low-fidelity wireframes for each of the 7 sections (desktop + mobile).
2. A flow diagram showing how a first-time user moves through the page vs. a returning user.
3. Annotations calling out each interactive moment and what analytics event it should fire.
4. Notes on any content that needs to be commissioned (icons, illustrations, short videos).

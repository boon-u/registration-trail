# Learning Design

How and why the experience is shaped the way it is. This is the rationale; the
granular content lives in `CONTENT_SPEC.md`.

## The core tension

A large body of content, total beginners, a 5–6 hr ceiling, and one concept
(encounters) that matters most. These pull against each other. The design choices
below resolve that tension by changing *how* material is handed over, not by
cutting content arbitrarily.

## Principles

### 1. Gradual release, instructor-assisted
Originally "I do → we do → you do" with on-demand hints. Per Boon's request,
**hints were removed** — the instructor walks the room and guides navigation
live. The app provides the goal and the thinking prompts; the human provides the
clicks-help. Do not re-add hint ladders unless asked.

### 2. Encounters are the spine
- A dedicated concept world (**Encounters 101**) establishes: an encounter is one
  *episode of care*; its ID links registration, orders, docs, meds; the golden
  rule is *every episode of care gets its own encounter*.
- The **create-new-vs-choose-existing decision recurs** as a scored "gate" inside
  Outpatient, Inpatient, and the Boss world, each time followed by a written
  justification. Spaced repetition across contexts is the mechanism that builds
  real understanding.

### 3. Ask the "why", never tell it
Concept cards state the fact only. The *why* becomes an open reflection question
the learner answers in their own words. (e.g. "Why add apps to the App Bar when
you can open them from the Storefront?" — the SSO answer is not shown.)

### 4. Reflection after every task
Each "try it yourself" is followed by one or more **free-text questions** in the
"In your own words" component. These are placeholder prompts Boon edits. They are
graded by the instructor (subjective), matching Boon's intent to score
understanding, not clicks.

### 5. Scored items with penalties
`gate`, `quiz`, and `rope` blocks are scored. Wrong picks deduct points; a floor
of **40%** of the world's max keeps morale intact. Reflections are *not*
auto-scored (instructor grades them). This gives a clean run full marks and makes
careless picks cost something — exactly what Boon asked for.

### 6. Anti-overwhelm structure
One idea per world; a lean required path; visible progress; a clear win-state per
world. Fast learners finish early; the format honours the "Enrichment" name by
allowing depth without forcing it.

### 7. Game feel that teaches
- **Horizontal curvy world map** (level 1 → n), mascot riding the current world,
  bouncing. Evokes the "level up, move to the next circle" feel Boon described.
- **Status colours mirror the system's appointment colours** on purpose:
  gray = locked/pending, blue = ready/confirmed, green = complete/checked-in. The
  navigation UI quietly rehearses a concept learners must master on the grid.
- **Boss level** = the real go-live failure (an appointment mapped to the wrong
  encounter) as a capstone that applies everything.

## World map (≈4.5 hrs core, leaves buffer under 5–6)

| # | World | Focus | Rough time |
|---|-------|-------|-----------|
| 1 | Base Camp | App Bar (+SSO why), PM Office + custom groups, Appointment Book tour, proportional view + clinic-hours timeline, create test patient + note MRN | ~45m |
| 2 | Encounters 101 | The concept: episode of care, golden rule, create-vs-choose | ~20m |
| 3 | Outpatient Journey | 3 scheduling methods, grid colours, encounter gate, check-in (pre-reg → outpatient), registration details (insurance/guarantor/etc.), no manual discharge | ~60m |
| 4 | Inpatient Journey | pre-admit → inpatient, encounter gate again, bed board + gender colours, discharge, dirty room | ~45m |
| 5 | Recurring Appointments | demo-led; reuses encounter + check-in + service interaction | ~20m |
| 6 | Group Sessions | create 60-capacity container, add patient | ~20m |
| 7 | Boss Level | fix the wrong-encounter mapping (disassociate + remap) + go-live pitfalls (alias-exists, expiring health cards) | ~40m |
|   | Quiz + wrap | consolidation + submit | ~20m |

## Block model (the content primitives)

The `LEVELS` array composes worlds from typed blocks. To add content, add blocks
— don't hand-build new components.

| Block | Purpose | Scored? |
|-------|---------|---------|
| `concept` | State a fact in plain language (title + body). No "why" given. | no |
| `do` | "Try it yourself" — a goal to perform in the live system. No hints. | no |
| `reflect` | Open question, free text, captured against the learner. Instructor-graded. | no |
| `gate` | Encounter decision (create new / choose existing) with post-commit rationale. | yes |
| `rope` | "Cut the rope" — drag/tap the appointment to the correct encounter among ropes. | yes |
| `quiz` | Single multiple-choice check with explanation. | yes |

See `CONTENT_SPEC.md` for every block currently authored, and `CLAUDE.md` for the
rule about keeping `reflect` ids unique.

# CLAUDE.md — Registration Trail

> Context for Claude Code. Read this first, then `docs/` for detail.
> This project was scoped in a planning chat; the docs here capture that
> conversation so work can resume without re-explaining everything.

## What this is

**Registration Trail** is an interactive, self-paced, game-style training app
that teaches **registration & scheduling in the Oracle / Cerner Clinical
Information System (CIS)** to hospital clerks. It replaces a spoon-fed,
instructor-led walkthrough with an active-learning "level up through worlds"
experience.

- **Org / context:** IWK Health, Halifax, Nova Scotia. This is the "Enrichment
  Training" stream for a Go-Live (the prior deck is labelled GL3).
- **Audience:** registration / scheduling clerks. **Assume most are brand new.**
- **Authors / owners:** Boon (lead), Sholaye (per the original deck).
- **The #1 learning objective:** participants must deeply understand
  **encounters** — specifically *when to create a new encounter vs. choose an
  existing one*. Boon stressed repeatedly that this is the concept people miss.

## Hard constraints (do not violate)

- **Time budget:** the whole experience must fit in **5–6 hours self-paced**,
  ideally less. Don't bloat it.
- **Don't overwhelm beginners.** One idea per world; lean core path.
- **Healthcare safety framing:** in the inpatient discharge step, the scenario
  must **avoid any "deceased / suicide" outcome** — later scenarios reuse the
  same patient, so the patient must stay alive in the storyline.
- **No real patient data.** Everything uses fictitious names / DOB / health card
  numbers in a sandbox ("train") environment. The only real personal data the
  app stores is the **trainee's own name + their answers**.

## Pedagogy (the spine — keep these intact)

1. **Encounters are the spine, not a topic.** A short concept world up front,
   then a recurring "create new vs. choose existing" decision *inside every
   scenario*, each time with a written justification. Repetition across contexts
   is the whole point.
2. **"Why" is asked, not told.** Concept cards state the fact; the *why* is an
   open question the learner answers in their own words. Never pre-fill the why.
3. **After every "try it yourself" task → an open reflection question.** These
   are editable placeholders (see below). Free-text, instructor-graded.
4. **Scoring with penalties.** Wrong scored picks lose points (floor = 40% of a
   world's max), so a clean run earns full marks and sloppy picks don't.
5. **Hints were intentionally removed** — the instructor guides navigation live
   in the room. Do **not** re-add step-by-step hints unless Boon asks.
6. **Game feel:** horizontal curvy world map, bouncing mascot, XP, leaderboard,
   a boss level. Status colours (gray = locked, blue = ready, green = complete)
   deliberately mirror the appointment-grid colours learners must master
   (gray = pending, blue = confirmed, green = checked in) so the UI pre-teaches.

## Repo map

```
CLAUDE.md                 <- you are here
README.md                 <- human overview + how to run / migrate to Vite
src/RegistrationTrail.jsx <- the working prototype (single-file React component)
docs/LEARNING_DESIGN.md   <- principles + the world/level structure + scoring
docs/CONTENT_SPEC.md      <- the full scenario walkthrough (source of truth for content)
docs/ARCHITECTURE.md      <- stack, persistence, data backend, leaderboard, deploy
docs/OPEN_QUESTIONS.md    <- decisions still pending (READ before big changes)
docs/GLOSSARY.md          <- domain terms (encounter, pre-reg, MSI, bed board, ...)
```

## Current state of the prototype

`src/RegistrationTrail.jsx` is a **single-file React component** (default export
`App`). It is a *prototype to align on feel*, not production. It currently:

- Renders 5 screens: **start** (name + mascot) → **map** (horizontal curvy world
  trail, auto-scrolls to current world, bouncing mascot) → **level** → **leaderboard** → **summary**.
- Defines all content in a `LEVELS` array of typed **blocks**:
  `concept` | `do` | `gate` | `rope` | `reflect` | `quiz` (see CONTENT_SPEC).
- Has 7 worlds: Base Camp (setup), Encounters 101, Outpatient Journey, Inpatient
  Journey, Recurring Appointments, Group Sessions, Boss Level.
- Includes a **"cut the rope" encounter-mapping mini-game** (`rope` block): an
  appointment hangs by ropes to candidate encounters; correct = snaps on, wrong =
  rope cut + point penalty.
- **Scoring:** penalties `gate 30 / quiz 30 / rope 20`, floor 40%; total XP = sum.
- **Mascot:** bouncing, CSS pseudo-3D (drop shadow + bob). 16 emoji shown; spec
  calls for ~60 or pre-assigned.
- **Persistence:** resume-by-name via a guarded `localStorage` wrapper (`SS`).
  Keyed by name slug. Saves profile/status/scores/reflections/quiz on change.
  Works when self-hosted; **no-ops in the Claude.ai artifact preview sandbox**
  (storage is blocked there — the start screen shows a note when off).
- **Leaderboard:** seeded demo entries + the live player. **Not yet shared across
  users** — that needs a backend (see OPEN_QUESTIONS).
- **Answer capture:** reflections saved per id, shown in the summary, copy-to-
  clipboard. Production target is Microsoft Forms / SharePoint (see ARCHITECTURE).

### Tech notes / conventions
- React + `lucide-react` icons. **Styling is inline style objects + a small
  injected `<style>`** for keyframes — no Tailwind, no CSS framework. Keep this
  style unless migrating the whole project.
- Fonts: **Baloo 2** (display) + **Inter** (body), injected via a Google Fonts
  `<link>` in a `useEffect`.
- Colour tokens live in the `C` object at the top of the file. Reuse them.
- The file was authored under Claude.ai artifact constraints (no localStorage in
  preview, no arbitrary Tailwind). Those constraints disappear once it's a real
  hosted Vite app — see README "Migration".

## Editing the questions (Boon does this)
Every `{ type: "reflect", id, prompt }` in `LEVELS` is a **placeholder** for Boon
to reword. Rules: keep each `id` **unique and stable** (ids map answers back to a
person), and don't turn reflects into answers — they're meant to make learners
think. There's a reminder comment at the top of the `LEVELS` array.

## Where we left off / suggested next steps
See `docs/OPEN_QUESTIONS.md` for the decisions that gate the next build. In
priority order:
1. **Pick the data backend** (MS Forms vs SharePoint List + Power Automate vs
   custom). This unblocks persistent leaderboard + cross-device resume + grading.
2. Replace placeholder reflection prompts with Boon's real wording.
3. Drop in **real screenshots / Figma** per world (Boon has Figma for encounter
   transitions, the bed board, and the 4-instance wrong-mapping fix — not yet shared).
4. Flesh out the stubbed worlds (Inpatient bed board, Recurring demo, Groups) with
   real steps.
5. Expand mascots to ~60 (or pre-assign), add the username flow.
6. Concretely build the **duplicate health card / "alias exists"** error moment
   and the **expiring-health-cards work list** moment.
7. Sanity-check total runtime against the 5–6 hr budget.

## Source materials referenced
- `old_GL3_Enrichment_reg_sched.pptx` — the prior instructor deck (agenda,
  Encounters 101, Encounter = $, GL2 issues, fix-incorrect-mapping steps, AppBar,
  Scenario 1, terminology, OP/IP transitions, recurring, hotkeys, three methods).
- A meeting transcript where Boon brain-dumped the full session design — its
  content is captured in `docs/CONTENT_SPEC.md`.
- Figma diagrams (owned by Boon, **not yet provided**).

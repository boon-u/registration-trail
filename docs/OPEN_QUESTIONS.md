# Open Questions & Decision Log

## Decisions already made
- **Format:** a standalone interactive React web app for the journey, *not*
  slides; data via a Forms/SharePoint hybrid. (Slides can't gate, score, capture,
  or game.)
- **Pedagogy:** encounters as the spine; "why" asked not told; reflection after
  every task; scored penalties with a 40% floor.
- **Hints removed** — instructor guides navigation live.
- **Game look:** horizontal curvy world map; status colours mirror appointment
  colours; bouncing mascot; boss level.
- **3D mascots:** CSS pseudo-3D (bounce + shadow) for now; real three.js models
  are a later option, not default (load/complexity for 60 users on hospital browsers).
- **Persistence:** resume-by-name via guarded localStorage in the prototype;
  backend needed for cross-device.

## Open questions (these gate the next build)

1. **Data backend** — Microsoft Forms (A) vs SharePoint List + Power Automate (B)
   vs custom (C)? Recommendation: **B**, so leaderboard + resume + grading share
   one store. *Needs Boon + IT input.*
2. **Hosting** — can a web app run on the network / SharePoint, or M365-only?
   Determines self-contained app vs Forms-handoff shell.
3. **Leaderboard scope** — persistent shared ranking (needs B/C) vs per-session
   bragging rights (A is enough)?
4. **Trainee machines** — fixed seats (browser storage resume is enough) vs
   roaming (need backend resume)?
5. **Scored vs free-text balance** — how many per-task checks should be auto-scored
   multiple-choice vs instructor-graded free text? Currently mostly free text + two
   quizzes.
6. **Mascots** — build ~60 unique with a username flow, or pre-assign mascot+name
   per trainee?
7. **True 3D** — is the CSS bounce enough, or do they want real 3D figures (three.js)?

## Assets still needed from Boon
- **Figma diagrams** — encounter transitions (OP & IP), the **4-instance
  wrong-mapping fix**, and the **bed board**. (Mentioned, not yet shared.)
- **Real screenshots** of each step in the live CIS to drop into the worlds
  (App Bar settings, PM Office, proportional view toggle, scheduling methods,
  check-in, registration fields, bed board, discharge, group container, the
  alias-exists error, the expiring-health-cards work list).
- Final **reflection-question wording** (the placeholders are Boon's to edit).

## Build backlog (suggested order)
1. Choose backend (Q1) → wire reflections, scores, leaderboard, resume to it.
2. Replace placeholder reflection prompts with real wording.
3. Drop in real screenshots / Figma per world.
4. Flesh out stubbed worlds: Inpatient **bed board** (gender colours, assign/
   discharge/dirty room), **Recurring** demo, **Group Sessions** container.
5. Build the **alias-exists** duplicate-profile moment and the **expiring health
   cards work list** moment concretely.
6. Add reschedule tasks in Outpatient.
7. Expand mascots to ~60 (or pre-assign) + username flow.
8. Time-box a full run-through against the **5–6 hr** budget; trim if over.
9. Optional: migrate the single file to a proper Vite project structure.

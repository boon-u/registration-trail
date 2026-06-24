# Content Spec

Source of truth for *what* the training covers, captured from Boon's brief. The
prototype implements a subset; everything here should eventually be reflected in
`src/RegistrationTrail.jsx`. Items marked **[stub]** are not yet built in detail.

## Scenario arc (the storyline)

One patient threads through the whole session:

> A patient with a suspected peanut allergy attends a scheduled outpatient clinic
> visit. They are pre-registered and assessed; during testing they have an acute
> reaction and must be **admitted** (inpatient). Later they have **recurring**
> visits, and appear in a **group session**. Along the way learners hit the real
> go-live pitfalls (wrong-encounter mapping, duplicate health cards).

**Safety constraint:** the inpatient discharge must never be "deceased/suicide" —
the patient must remain available for later scenarios.

## World 1 — Base Camp (setup)

- **App Bar:** add applications to it. Configure: large icons, **float** (don't
  block the view underneath), **uncheck "always on top"**.
  - *Why (learner answers):* the App Bar gives **single sign-on** — launching apps
    from it avoids logging in repeatedly. (Don't reveal; ask.)
- **PM Office tour:** left-hand categories are **Conversation, Work List, Groups,
  Inquiries**. Create a **custom group**, rename it, and **pin** features from any
  section into it.
  - *Why (learner answers):* one place to access everything instead of opening
    each section individually.
- **Appointment Book tour:** toolbars on top, calendar view, appointment books,
  Books tab, work-in-progress section, grid.
- **Create test patient** while in PM Office: use the fictitious **name, DOB, and
  health card number** provided. **Note the MRN** (needed downstream).

## World 2 — Encounters 101 (concept)

- **Encounter** = a unique ID for one *episode of care* / visit / interaction;
  links registration, orders, documentation, meds for that visit.
- **Encounter = $** — billing context. (Prior deck notes in-between-visit
  encounters are non-billable.)
- **Golden rule:** every episode of care gets its own encounter. New visit / new
  date / new reason → new encounter; same ongoing visit → reuse existing.
- In the **train/sandbox** environment there are **no pre-made encounters**, so
  learners will almost always *create* — and must understand *why*.

## World 3 — Outpatient Journey

- **Appointment Book view:** open the **IWK Allergy** book. Default view is
  **non-proportional single day** (no timeline; appointments squeezed to top).
  Change to **proportional single day**. Then the timeline runs 00:00–23:59
  (1200→1159); **trim it to clinic hours (7am–5pm)**. Confirm appointments map to
  the right place on the timeline.
- **Schedule an appointment** for the test patient. **Three methods**, try all:
  1. **Schedule**  2. **Suggest**  3. **Drag and drop**
- **Grid colours:** **gray = pending** (before confirm), **blue = confirmed**
  (after confirm), **green = checked in**.
- **Encounter decision:** on confirm, the system asks to choose or create an
  encounter. Sandbox has none → **create new**; learner justifies in text.
- **Reschedule tasks:** reschedule to a different date, then back to the original
  date/time. (Reinforces grid manipulation.) **[stub]**
- **Check-in:** an appointment made ahead of arrival is a **pre-registration**
  (a draft/container/template). When the patient actually arrives (days/weeks
  later), the clerk **checks in** the appointment, which **flips pre-reg →
  outpatient encounter**. Block turns **green**.
- **No manual discharge** for outpatient — auto-discharged at end of day. (Ask
  learners whether they should discharge; answer: no.)
- **Registration details** to capture: **emergency contact**, **guarantor**,
  **primary insurance**, **temporary address**, **pronouns**, **administrative
  sex**.
- **Insurance types** (discuss):
  - Nova Scotia resident → **MSI** (Medical Services Insurance)
  - Injured at workplace → **Workers' Compensation Board (WCB)**
  - Canadian Armed Forces personnel → **Canadian Armed Forces Health Plan**
  - Out-of-province → that province's plan
- **Transition question:** explain pre-reg → outpatient and what triggers it.

## World 4 — Inpatient Journey

- Same patient, admitted a few days later. Create a **pre-admit** (like pre-reg,
  but for admission), then **flip to an inpatient encounter** (pre-admit →
  inpatient registration).
- **Encounter decision again:** new date, new setting, new episode → **new
  encounter**, not the outpatient one. Learner justifies. (Boon wants maximum
  focus on this reasoning.)
- **Bed board:** choose locations and beds; assign the patient. Beds are coloured
  by gender: **male / female / undefined**. **[stub]**
- **Discharge:** when the doctor approves, use **discharge encounter**. Learner
  must find where that is. After discharge: patient leaves the grid, room marked
  **dirty**. (Remember the no-deceased constraint.)

## Encounter deep-dive (discussion + pitfalls)

After inpatient, a focused discussion on encounters with scenarios:

- Real records often show **multiple encounters** per patient.
- A **central booking / registration** clerk may pre-create encounters for the
  coming days/week so there's a visual to follow on the grid — when they reach the
  "create or choose existing" step, **grill** the learner: new or existing? why?
- **Pitfall:** habitually choosing an existing encounter when a new one is needed.

### The wrong-mapping scenario (capstone / Boss)
- Deliberately **mis-map**: create a new appointment but **choose an existing
  encounter** — the exact slip that happened frequently during go-live.
- **Task:** fix it — **disassociate/unassociate** the incorrect mapping and
  **re-map** the appointment to the correct encounter.
- Boon built **Figma diagrams** showing this as **4 instances** of appointments
  to be fixed (diagrams not yet provided). Visualise it. The `rope` mini-game is
  the playful version of this concept.

## World 5 — Recurring Appointments  [stub, demo-led]

Reuses everything: choosing vs creating encounters, check-in, and creating a
**service interaction**. Boon suggested **demoing** this rather than full
hands-on. End with one encounter-decision + a reflection.

## World 6 — Group Sessions  [stub]

- Create a **group container** with **60-member capacity**.
- Add the patient into the group.

## Go-live pitfalls to dramatise

- **Duplicate health card numbers → duplicate profiles.** Creating the profile a
  second time throws an **"alias exists"** error. Learners should hit this. **[stub]**
- **Expiring health cards work list.** When adding the profile, set a health-card
  **expiry date**; the patient then appears on the **Expiring Health Cards** work
  list so it can be updated/fixed. **[stub]**

## Gamification / logistics Boon asked for

- **Mascots:** at least ~60 (or pre-assigned). Learner picks a **mascot + username**
  and keeps it through the session. (Prototype shows 16 emoji; scale up or pre-assign.)
- **Overlapping health card numbers** intentionally seeded so two patients collide
  (drives the alias-exists moment).
- **Every step has a discussion + a couple of sentences written** by the learner
  ("make their brain work"), instructor-graded.
- **Answer collection:** a database or **Microsoft Forms**; Boon is open to a
  hybrid. (See `ARCHITECTURE.md`.)
- **Tone:** visually appealing, "like a kid's game", but for adult professionals —
  warm and game-y, not childish.

## Prior deck (`old_GL3_Enrichment_reg_sched.pptx`) — slide inventory
Welcome/agenda · Encounters 101 (definition) · Encounter = $ · Encounter issues
during GL2 · Fix incorrectly-mapped encounter (Step 1/2/3) · Before we start
(create test patient, set up App Bar) · Scenario 1 (peanut allergy, admitted) ·
Reg/Sched terminology (pre-registered, encounter) · Encounter transition
outpatient · Encounter transition inpatient · Recurring appts · Date/time hotkeys
(TODAY / NOW / WEEK / MONTH / YEAR) · Three methods to schedule · Break slides.

# Architecture

## Current shape

A single-file React component (`src/RegistrationTrail.jsx`, default export `App`).
State is all in React; there is no backend yet. The component is intentionally
self-contained so it can be dropped into any React host.

- **UI:** React + `lucide-react`. Inline style objects + one injected `<style>`
  for keyframes. Colour tokens in the `C` object. Fonts (Baloo 2 / Inter) injected
  via a Google Fonts `<link>`.
- **Routing:** a `screen` string in state (`start` / `map` / `<levelId>` /
  `leaderboard` / `summary`). No router library.
- **Content:** the `LEVELS` array of typed blocks (see LEARNING_DESIGN / CONTENT_SPEC).
- **Scoring:** per-level penalty accumulates from wrong `gate`/`quiz`/`rope`
  picks; earned = `max(40% of max, max − penalty)`; total XP = sum of earned.

## Persistence (resume after breaks / logout)

**Decided & implemented (prototype-level):** resume-by-name via a guarded
`localStorage` wrapper called `SS`. On start, the app looks up a saved record
keyed by the trainee's name slug (`regtrail:v1:<name>`); if found, it restores
profile/status/scores/reflections/quiz and shows a "Welcome back" banner. A
`useEffect` re-saves on every change.

**Known limits (documented for the user):**
- Tied to the **same browser on the same device**. Roaming machines, cleared data,
  or private mode lose the local copy.
- **No-ops inside the Claude.ai artifact preview** (sandbox blocks storage). It
  activates automatically once self-hosted. The start screen shows whether saving
  is on.

**For cross-device resume:** replace `SS` with a backend client that loads/saves a
row keyed by name or an assigned ID (same store as answers + leaderboard, below).

## Data backend — options (DECISION PENDING, see OPEN_QUESTIONS)

The app needs to (a) collect graded reflection answers, (b) persist scores for a
leaderboard, and (c) optionally support cross-device resume. The org lives in
Microsoft 365, so options are framed around that.

### Option A — Microsoft Forms (simplest)
- App holds answers in memory, then submits to a Form at the end (or via a
  pre-filled form URL).
- Responses land automatically in an Excel workbook on SharePoint/OneDrive — that
  is the "database" for grading.
- **Good for:** graded reflections with minimal setup.
- **Weak for:** a *live* leaderboard and resume — you can't easily read responses
  back into the app.

### Option B — SharePoint List + Power Automate (recommended)
- App POSTs each score/answer to a Power Automate HTTP-trigger flow that writes a
  row to a SharePoint List (or Dataverse).
- App can **read rows back**, enabling a **shared live leaderboard** and
  **cross-device resume** (look up the person's row on start).
- Still fully inside M365; no separate hosting for data.
- **Recommendation:** since the project wants a leaderboard *and* resume *and*
  grading, one SharePoint List can serve all three. Lean here unless IT objects.

### Option C — Custom backend (Azure Function + table / Dataverse)
- Most flexible, real-time, fully custom.
- Needs a developer + IT sign-off + hosting. Overkill unless other options are
  blocked.

### Leaderboard specifics
A persistent, shared leaderboard requires shared storage everyone reads/writes
(Option B or C). If "leaderboard" only needs to be per-session bragging rights,
Forms (Option A) is enough and you skip the flow. **This scope choice is open.**

## Hosting (DECISION PENDING)
Can the team host a small web app on the network / SharePoint, or is it M365-only?
- If self-hostable → ship the React app; wire data via Option B/C.
- If M365-only → the journey can run as an embedded/static web part that hands
  off to Forms (Option A), with reduced leaderboard/resume capability.

## Suggested target architecture (if Option B is chosen)
```
React app (hosted)  --POST score/answer-->  Power Automate flow  -->  SharePoint List
        ^                                                                   |
        |------------------- GET on start (resume) / GET leaderboard --------|
```
- One List, columns: name/id, mascot, world, score, each reflection id+text,
  timestamps.
- Resume = GET by name/id on start. Leaderboard = GET top-N by total score.
  Grading = open the List / its Excel export.

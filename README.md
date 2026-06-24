# Registration Trail

A self-paced training app that teaches **registration & scheduling in the Oracle /
Cerner CIS** to hospital clerks (IWK Health). Learners travel an open world map,
do hands-on tasks in the CIS sandbox, and answer reflection questions in
**Microsoft Forms** (which you share separately).

**New here? Read [`CLAUDE.md`](./CLAUDE.md) first**, then `docs/`.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173 — same experience as production: open map, all worlds
unlocked, no scores or leaderboard.

## Optional: Microsoft Forms link

Create `.env.local` (for dev) or edit `.env.production` (for deploy):

```bash
VITE_FORMS_URL=https://forms.office.com/r/your-form-id
```

Restart the dev server after changing env files.

## Deploy

```bash
npm run build
```

Upload the `dist/` folder to any static host (Netlify Drop, Vercel, SharePoint,
etc.). See `netlify.toml` / `vercel.json` if connecting a repo.

## What learners see

- Open world map — every world tappable from the start, any order
- Concepts, hands-on tasks, encounter decisions, mini-games inside each world
- Reflection questions with a reminder to answer in Microsoft Forms
- No sign-in, no scores, no locked levels, no leaderboard

## Status

Prototype. Content is partly real (Encounters 101, Outpatient, Boss) and partly
stubbed (Inpatient bed board, Recurring, Groups). Reflection questions are
editable placeholders. See `docs/OPEN_QUESTIONS.md` for what's blocking the next
milestone.

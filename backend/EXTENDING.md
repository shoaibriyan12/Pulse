# Extending Pulse

This project is intentionally structured so new features — especially
third-party integrations — can be added without touching unrelated code.

## Adding a new API route

1. Create `backend/src/routes/<name>.ts` exporting an Express `Router`.
2. Mount it in `backend/src/index.ts`:
   ```ts
   import { myRouter } from './routes/my-feature.js'
   app.use('/api/my-feature', apiKeyAuth, myRouter)
   ```
3. If it needs new tables/columns, add a new file to `backend/migrations/`
   (e.g. `003_my_feature.sql`) — never edit an already-applied migration.
   Migrations run in filename order via `npm run migrate`.
4. Add matching methods to `frontend/src/lib/api.ts` and call them from a
   hook or page.

## Adding a third-party integration (Strava, Google Fit, Apple Health, ...)

A stub already exists for this:

- **`backend/src/routes/integrations.ts`** reads/writes a JSONB
  `integrations` column on the settings row, so you can store per-provider
  state (`{ "strava": { "connected": true, "athleteId": "..." } }`) without
  another migration for simple cases.
- For anything needing OAuth tokens, webhooks, or sync history, add a
  dedicated table instead (e.g. `integration_tokens`, `integration_events`)
  and a dedicated route file — the JSONB column is for lightweight config
  only, not secrets.
- Typical shape for a provider integration:
  1. `routes/integrations/strava.ts` — OAuth start/callback endpoints, plus
     a sync endpoint/cron job that upserts into `entries`.
  2. Mount at `/api/integrations/strava`.
  3. Frontend: a "Connect" button in `Settings.tsx` (there's already a
     placeholder card there) that redirects to the OAuth start endpoint.

## Adding a new accent color / theme

1. Add a `html[data-accent='name'] { --accent: ...; --accent-dark: ...; }`
   block to `frontend/src/index.css`.
2. Add an entry to `ACCENT_PRESETS` in `frontend/src/lib/theme.ts`.

That's it — every component already themes off the `--accent` CSS variable
via Tailwind's `pulse-teal` color, so nothing else needs to change.

## Adding a new export/report type

`frontend/src/lib/export.ts` has small composable helpers
(`openPrintableReport`, `statBlock`) used by `downloadMonthlyReport` and
`downloadFullStatsReport`. Follow the same pattern for new report types.

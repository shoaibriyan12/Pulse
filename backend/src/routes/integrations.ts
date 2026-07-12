import { Router } from 'express'
import { pool } from '../db.js'

// This route exists so future integrations (Strava, Google Fit, Apple
// Health, etc.) have a ready-made place to store per-provider config/tokens
// without another migration. It reads/writes the `integrations` JSONB
// column on the single settings row.
//
// To wire up a real provider later:
//   1. Add a dedicated file, e.g. routes/integrations/strava.ts, with its
//      OAuth callback + sync logic.
//   2. Mount it in index.ts, e.g. app.use('/api/integrations/strava', ...).
//   3. Have it read/write its slice of `integrations` via the helpers below,
//      or its own table if it needs more structure (webhooks, sync history).
//   4. Add the corresponding fetch calls to frontend/src/lib/api.ts and a
//      toggle in Settings.tsx (there's already a placeholder card there).

export const integrationsRouter = Router()

integrationsRouter.get('/', async (_req, res) => {
  try {
    const result = await pool.query('SELECT integrations FROM settings WHERE id = 1')
    if (result.rows.length === 0) return res.status(404).json({ error: 'Settings not initialized' })
    res.json(result.rows[0].integrations ?? {})
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to load integrations' })
  }
})

// PATCH /api/integrations — shallow-merges the provided object into the
// existing integrations config, e.g. { "strava": { "connected": true } }
integrationsRouter.patch('/', async (req, res) => {
  const patch = req.body ?? {}
  try {
    const result = await pool.query(
      `UPDATE settings
       SET integrations = COALESCE(integrations, '{}'::jsonb) || $1::jsonb
       WHERE id = 1
       RETURNING integrations`,
      [JSON.stringify(patch)]
    )
    res.json(result.rows[0].integrations)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update integrations' })
  }
})

import { Router } from 'express'
import { pool } from '../db.js'

export const settingsRouter = Router()

interface SettingsRow {
  height_cm: string
  goal_weight_kg: string
  start_weight_kg: string | null
  protein_goal: string
  calorie_goal: number
  carb_limit: string
  fat_goal: string
  theme: string
  units: string
  accent_color: string
  integrations: Record<string, unknown>
}

function toApiShape(row: SettingsRow) {
  return {
    heightCm: Number(row.height_cm),
    goalWeightKg: Number(row.goal_weight_kg),
    startWeightKg: row.start_weight_kg === null ? null : Number(row.start_weight_kg),
    proteinGoal: Number(row.protein_goal),
    calorieGoal: Number(row.calorie_goal),
    carbLimit: Number(row.carb_limit),
    fatGoal: Number(row.fat_goal),
    theme: row.theme,
    units: row.units,
    accentColor: row.accent_color,
    integrations: row.integrations ?? {},
  }
}

// GET /api/settings
settingsRouter.get('/', async (_req, res) => {
  try {
    const result = await pool.query<SettingsRow>('SELECT * FROM settings WHERE id = 1')
    if (result.rows.length === 0) return res.status(404).json({ error: 'Settings not initialized' })
    res.json(toApiShape(result.rows[0]))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to load settings' })
  }
})

// PATCH /api/settings -> partial update
settingsRouter.patch('/', async (req, res) => {
  const b = req.body ?? {}
  const fields: Record<string, unknown> = {
    height_cm: b.heightCm,
    goal_weight_kg: b.goalWeightKg,
    start_weight_kg: b.startWeightKg,
    protein_goal: b.proteinGoal,
    calorie_goal: b.calorieGoal,
    carb_limit: b.carbLimit,
    fat_goal: b.fatGoal,
    theme: b.theme,
    units: b.units,
    accent_color: b.accentColor,
    integrations: b.integrations !== undefined ? JSON.stringify(b.integrations) : undefined,
  }

  const setClauses: string[] = []
  const values: unknown[] = []
  let i = 1
  for (const [col, val] of Object.entries(fields)) {
    if (val !== undefined) {
      setClauses.push(`${col} = $${i}`)
      values.push(val)
      i++
    }
  }

  if (setClauses.length === 0) {
    const result = await pool.query<SettingsRow>('SELECT * FROM settings WHERE id = 1')
    return res.json(toApiShape(result.rows[0]))
  }

  try {
    const result = await pool.query<SettingsRow>(
      `UPDATE settings SET ${setClauses.join(', ')} WHERE id = 1 RETURNING *`,
      values
    )
    res.json(toApiShape(result.rows[0]))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update settings' })
  }
})

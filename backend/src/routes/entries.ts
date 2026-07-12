import { Router } from 'express'
import { pool } from '../db.js'

export const entriesRouter = Router()

interface EntryRow {
  date: string
  calories: number
  protein: string
  carbs: string
  fat: string
  weight: string | null
  water: string
  steps: number
  workout_minutes: number
  notes: string
  created_at: string
  updated_at: string
}

function toApiShape(row: EntryRow) {
  return {
    date: row.date,
    calories: Number(row.calories),
    protein: Number(row.protein),
    carbs: Number(row.carbs),
    fat: Number(row.fat),
    weight: row.weight === null ? undefined : Number(row.weight),
    water: Number(row.water),
    steps: Number(row.steps),
    workoutMinutes: Number(row.workout_minutes),
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// GET /api/entries -> { "2026-01-01": {...}, ... } (matches the frontend's Record<string, DailyEntry> shape)
entriesRouter.get('/', async (_req, res) => {
  try {
    const result = await pool.query<EntryRow>('SELECT * FROM entries ORDER BY date ASC')
    const map: Record<string, ReturnType<typeof toApiShape>> = {}
    for (const row of result.rows) {
      const entry = toApiShape(row)
      map[new Date(entry.date).toISOString().split('T')[0]] = entry
    }
    res.json(map)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to load entries' })
  }
})

// GET /api/entries/:date
entriesRouter.get('/:date', async (req, res) => {
  try {
    const result = await pool.query<EntryRow>('SELECT * FROM entries WHERE date = $1', [req.params.date])
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' })
    res.json(toApiShape(result.rows[0]))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to load entry' })
  }
})

// PUT /api/entries/:date -> upsert
entriesRouter.put('/:date', async (req, res) => {
  const { date } = req.params
  const b = req.body ?? {}

  try {
    const result = await pool.query<EntryRow>(
      `INSERT INTO entries (date, calories, protein, carbs, fat, weight, water, steps, workout_minutes, notes, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, now())
       ON CONFLICT (date) DO UPDATE SET
         calories = EXCLUDED.calories,
         protein = EXCLUDED.protein,
         carbs = EXCLUDED.carbs,
         fat = EXCLUDED.fat,
         weight = EXCLUDED.weight,
         water = EXCLUDED.water,
         steps = EXCLUDED.steps,
         workout_minutes = EXCLUDED.workout_minutes,
         notes = EXCLUDED.notes,
         updated_at = now()
       RETURNING *`,
      [
        date,
        b.calories ?? 0,
        b.protein ?? 0,
        b.carbs ?? 0,
        b.fat ?? 0,
        b.weight ?? null,
        b.water ?? 0,
        b.steps ?? 0,
        b.workoutMinutes ?? 0,
        b.notes ?? '',
      ]
    )
    res.json(toApiShape(result.rows[0]))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to save entry' })
  }
})

// DELETE /api/entries/:date
entriesRouter.delete('/:date', async (req, res) => {
  try {
    await pool.query('DELETE FROM entries WHERE date = $1', [req.params.date])
    res.status(204).send()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete entry' })
  }
})

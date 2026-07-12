export interface DailyEntry {
  date: string // 'YYYY-MM-DD'
  calories: number
  protein: number
  carbs: number
  fat: number
  weight?: number
  water: number
  steps: number
  workoutMinutes: number
  notes: string
  createdAt: string
  updatedAt: string
}

export type ThemeMode = 'dark' | 'light'
export type UnitSystem = 'metric' | 'imperial'

// Accent color presets. Adding a new one only requires: a CSS var block in
// index.css, an entry in ACCENT_PRESETS (src/lib/theme.ts), and a swatch on
// the Settings page — no other component needs to change.
export type AccentColor = 'teal' | 'violet' | 'coral' | 'blue' | 'rose' | 'emerald'

// Free-form bucket for future third-party integrations (Strava, Google Fit,
// Apple Health, etc). Kept as an open record so new integrations don't need
// a schema/type change — see backend/EXTENDING.md.
export type IntegrationsConfig = Record<string, unknown>

export interface Settings {
  heightCm: number
  goalWeightKg: number
  startWeightKg: number | null
  proteinGoal: number
  calorieGoal: number
  carbLimit: number
  fatGoal: number
  theme: ThemeMode
  units: UnitSystem
  accentColor: AccentColor
  integrations: IntegrationsConfig
}

export const DEFAULT_SETTINGS: Settings = {
  heightCm: 175,
  goalWeightKg: 70,
  startWeightKg: null,
  proteinGoal: 150,
  calorieGoal: 1500,
  carbLimit: 50,
  fatGoal: 70,
  theme: 'dark',
  units: 'metric',
  accentColor: 'teal',
  integrations: {},
}

export type FilterPreset =
  | 'today'
  | 'yesterday'
  | 'last7'
  | 'last30'
  | 'july'
  | 'august'
  | 'custom'
  | 'all'

export interface DateRange {
  start: string
  end: string
}

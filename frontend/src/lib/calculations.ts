import type { DailyEntry, Settings } from '@/types'
import { addDays, daysBetween, monthKey, todayStr, weekKey } from '@/lib/date'

export function sortedEntries(entries: Record<string, DailyEntry>): DailyEntry[] {
  return Object.values(entries).sort((a, b) => (a.date < b.date ? -1 : 1))
}

export function average(nums: number[]): number {
  if (nums.length === 0) return 0
  return nums.reduce((a, b) => a + b, 0) / nums.length
}

export function round(n: number, digits = 1): number {
  const f = 10 ** digits
  return Math.round(n * f) / f
}

// ---------- Color rules ----------
export type ColorLevel = 'green' | 'orange' | 'red'

export function calorieColor(value: number, limit: number): ColorLevel {
  if (value < limit) return 'green'
  if (value === limit) return 'orange'
  return 'red'
}

export function carbColor(value: number, limit: number): ColorLevel {
  if (value < limit) return 'green'
  if (value === limit) return 'orange'
  return 'red'
}

export function proteinColor(value: number, goal: number): ColorLevel {
  if (value >= goal) return 'green'
  if (value >= goal - 50) return 'orange'
  return 'red'
}

export const colorClass: Record<ColorLevel, string> = {
  green: 'text-pulse-green',
  orange: 'text-pulse-amber',
  red: 'text-pulse-red',
}

export const colorBg: Record<ColorLevel, string> = {
  green: 'bg-pulse-green/15 text-pulse-green border-pulse-green/30',
  orange: 'bg-pulse-amber/15 text-pulse-amber border-pulse-amber/30',
  red: 'bg-pulse-red/15 text-pulse-red border-pulse-red/30',
}

// ---------- Streaks ----------
export function computeStreaks(entries: DailyEntry[]): { current: number; longest: number } {
  if (entries.length === 0) return { current: 0, longest: 0 }
  const dates = entries.map((e) => e.date).sort()
  let longest = 1
  let run = 1
  for (let i = 1; i < dates.length; i++) {
    if (daysBetween(dates[i - 1], dates[i]) === 1) {
      run += 1
    } else {
      longest = Math.max(longest, run)
      run = 1
    }
  }
  longest = Math.max(longest, run)

  // current streak: walk backwards from today or last logged date
  const today = todayStr()
  const lastDate = dates[dates.length - 1]
  const dateSet = new Set(dates)
  let current = 0
  let cursor = lastDate === today || daysBetween(lastDate, today) === 1 ? lastDate : null
  if (cursor) {
    while (dateSet.has(cursor)) {
      current += 1
      cursor = addDays(cursor, -1)
    }
  }
  return { current, longest }
}

// ---------- Moving average ----------
export function movingAverage<T extends { date: string }>(
  data: T[],
  key: keyof T,
  windowSize = 7
): { date: string; value: number }[] {
  const result: { date: string; value: number }[] = []
  for (let i = 0; i < data.length; i++) {
    const windowStart = Math.max(0, i - windowSize + 1)
    const slice = data.slice(windowStart, i + 1)
    const vals = slice.map((d) => Number(d[key]) || 0)
    result.push({ date: data[i].date, value: round(average(vals), 1) })
  }
  return result
}

// ---------- Weekly / Monthly aggregation ----------
export interface Aggregate {
  key: string
  label: string
  calories: number
  protein: number
  carbs: number
  fat: number
  weight: number | null
  count: number
}

function aggregateBy(entries: DailyEntry[], keyFn: (e: DailyEntry) => string, labelFn: (k: string) => string): Aggregate[] {
  const buckets = new Map<string, DailyEntry[]>()
  for (const e of entries) {
    const k = keyFn(e)
    if (!buckets.has(k)) buckets.set(k, [])
    buckets.get(k)!.push(e)
  }
  const result: Aggregate[] = []
  for (const [k, list] of Array.from(buckets.entries()).sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
    const weights = list.map((e) => e.weight).filter((w): w is number => typeof w === 'number')
    result.push({
      key: k,
      label: labelFn(k),
      calories: round(average(list.map((e) => e.calories))),
      protein: round(average(list.map((e) => e.protein))),
      carbs: round(average(list.map((e) => e.carbs))),
      fat: round(average(list.map((e) => e.fat))),
      weight: weights.length ? round(average(weights), 1) : null,
      count: list.length,
    })
  }
  return result
}

export function weeklyAggregate(entries: DailyEntry[]): Aggregate[] {
  return aggregateBy(
    entries,
    (e) => weekKey(e.date),
    (k) => `Wk of ${k.slice(5)}`
  )
}

export function monthlyAggregate(entries: DailyEntry[]): Aggregate[] {
  return aggregateBy(
    entries,
    (e) => monthKey(e.date),
    (k) => new Date(Number(k.slice(0, 4)), Number(k.slice(5, 7)) - 1, 1).toLocaleDateString('en-US', { month: 'long' })
  )
}

// ---------- Best / worst days ----------
export function extremeDay(
  entries: DailyEntry[],
  key: 'calories' | 'protein' | 'carbs' | 'fat',
  mode: 'max' | 'min'
): DailyEntry | null {
  if (entries.length === 0) return null
  return entries.reduce((best, cur) => {
    if (mode === 'max') return cur[key] > best[key] ? cur : best
    return cur[key] < best[key] ? cur : best
  }, entries[0])
}

// ---------- BMI ----------
export function computeBMI(weightKg: number, heightCm: number): number {
  if (!weightKg || !heightCm) return 0
  const heightM = heightCm / 100
  return round(weightKg / (heightM * heightM), 1)
}

export function bmiCategory(bmi: number): string {
  if (bmi === 0) return 'N/A'
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

// ---------- Weight trend / projection ----------
export function linearRegression(points: { x: number; y: number }[]): { slope: number; intercept: number } {
  const n = points.length
  if (n < 2) return { slope: 0, intercept: points[0]?.y ?? 0 }
  const sumX = points.reduce((s, p) => s + p.x, 0)
  const sumY = points.reduce((s, p) => s + p.y, 0)
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0)
  const sumXX = points.reduce((s, p) => s + p.x * p.x, 0)
  const denom = n * sumXX - sumX * sumX
  if (denom === 0) return { slope: 0, intercept: sumY / n }
  const slope = (n * sumXY - sumX * sumY) / denom
  const intercept = (sumY - slope * sumX) / n
  return { slope, intercept }
}

export function projectedGoalDate(
  entries: DailyEntry[],
  goalWeightKg: number
): { date: string | null; weeklyRate: number } {
  const withWeight = entries.filter((e) => typeof e.weight === 'number') as (DailyEntry & { weight: number })[]
  if (withWeight.length < 2) return { date: null, weeklyRate: 0 }
  const first = withWeight[0]
  const points = withWeight.map((e) => ({ x: daysBetween(first.date, e.date), y: e.weight }))
  const { slope, intercept } = linearRegression(points)
  const weeklyRate = round(slope * 7, 2)
  if (Math.abs(slope) < 0.0001) return { date: null, weeklyRate }
  const lastX = points[points.length - 1].x
  const currentWeight = slope * lastX + intercept
  const daysToGoal = (goalWeightKg - currentWeight) / slope
  if (!isFinite(daysToGoal) || daysToGoal < 0 || daysToGoal > 3650) return { date: null, weeklyRate }
  return { date: addDays(withWeight[withWeight.length - 1].date, Math.round(daysToGoal)), weeklyRate }
}

// ---------- Goal progress ----------
export function weightGoalProgress(startWeight: number | null, currentWeight: number | null, goalWeight: number): number {
  if (startWeight == null || currentWeight == null || startWeight === goalWeight) return 0
  const total = startWeight - goalWeight
  const done = startWeight - currentWeight
  const pct = (done / total) * 100
  return Math.max(0, Math.min(100, round(pct)))
}

// ---------- Macronutrient calories ----------
export function macroCalorieSplit(protein: number, carbs: number, fat: number) {
  const pCal = protein * 4
  const cCal = carbs * 4
  const fCal = fat * 9
  const total = pCal + cCal + fCal || 1
  return {
    protein: round((pCal / total) * 100),
    carbs: round((cCal / total) * 100),
    fat: round((fCal / total) * 100),
  }
}

// ---------- Estimated calorie deficit ----------
export function estimateDeficit(calories: number, calorieGoal: number, workoutMinutes: number): number {
  const workoutBurn = workoutMinutes * 6.5 // rough estimate kcal/min moderate activity
  return round(calorieGoal + workoutBurn - calories)
}

export function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1]
}

export function filterByRange(entries: DailyEntry[], start: string, end: string): DailyEntry[] {
  return entries.filter((e) => e.date >= start && e.date <= end)
}

export function summarize(entries: DailyEntry[], settings: Settings) {
  const list = sortedEntries(Object.fromEntries(entries.map((e) => [e.date, e])))
  const calories = list.map((e) => e.calories)
  const protein = list.map((e) => e.protein)
  const carbs = list.map((e) => e.carbs)
  const fat = list.map((e) => e.fat)
  const under1500 = calories.filter((c) => c < settings.calorieGoal).length
  const above1500 = calories.filter((c) => c > settings.calorieGoal).length
  const underCarb = carbs.filter((c) => c < settings.carbLimit).length
  const aboveCarb = carbs.filter((c) => c > settings.carbLimit).length
  const proteinGoalHit = protein.filter((p) => p >= settings.proteinGoal).length
  return {
    avgCalories: round(average(calories)),
    avgProtein: round(average(protein)),
    avgCarbs: round(average(carbs)),
    avgFat: round(average(fat)),
    under1500,
    above1500,
    underCarb,
    aboveCarb,
    proteinGoalPct: list.length ? round((proteinGoalHit / list.length) * 100) : 0,
  }
}

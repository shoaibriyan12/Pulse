import { useMemo } from 'react'
import { Award, TrendingDown, TrendingUp, Ruler, Target, CalendarClock, Download } from 'lucide-react'
import { useEntries } from '@/hooks/useEntries'
import { useSettings } from '@/hooks/useSettings'
import StatCard from '@/components/ui/StatCard'
import GlassCard from '@/components/ui/GlassCard'
import ProgressRing from '@/components/ui/ProgressRing'
import Button from '@/components/ui/Button'
import { downloadFullStatsReport } from '@/lib/export'
import {
  average,
  bmiCategory,
  computeBMI,
  computeStreaks,
  extremeDay,
  monthlyAggregate,
  projectedGoalDate,
  round,
  sortedEntries,
  summarize,
  weeklyAggregate,
  weightGoalProgress,
} from '@/lib/calculations'
import { daysBetween, formatShort, todayStr } from '@/lib/date'

export default function StatisticsPage() {
  const { entries } = useEntries()
  const { settings } = useSettings()
  const list = useMemo(() => sortedEntries(entries), [entries])
  const withWeight = list.filter((e) => typeof e.weight === 'number')
  const summary = summarize(list, settings)
  const { current, longest } = computeStreaks(list)
  const weekly = weeklyAggregate(list)
  const monthly = monthlyAggregate(list)

  const startWeight = settings.startWeightKg ?? withWeight[0]?.weight ?? null
  const currentWeight = withWeight.length ? withWeight[withWeight.length - 1].weight ?? null : null
  const lowestWeight = withWeight.length ? Math.min(...withWeight.map((e) => e.weight!)) : null
  const highestWeight = withWeight.length ? Math.max(...withWeight.map((e) => e.weight!)) : null
  const bmi = currentWeight ? computeBMI(currentWeight, settings.heightCm) : 0
  const goalProgress = weightGoalProgress(startWeight, currentWeight, settings.goalWeightKg)
  const projection = projectedGoalDate(list, settings.goalWeightKg)
  const weightRemaining = currentWeight != null ? round(Math.abs(currentWeight - settings.goalWeightKg), 1) : null

  const today = entries[todayStr()]
  const yIdx = withWeight.findIndex((e) => e.date === today?.date) - 1
  const yesterdayWeight = yIdx >= 0 ? withWeight[yIdx].weight : undefined
  const diffFromYesterday =
    typeof today?.weight === 'number' && typeof yesterdayWeight === 'number' ? round(today.weight - yesterdayWeight, 1) : null

  const lastWeekEntry = withWeight.find((e) => daysBetween(e.date, todayStr()) >= 7)
  const diffFromLastWeek =
    currentWeight != null && lastWeekEntry?.weight != null ? round(currentWeight - lastWeekEntry.weight, 1) : null

  if (list.length === 0) {
    return (
      <div className="mx-auto max-w-lg pt-16 text-center">
        <p className="font-display text-lg text-slate-300">No statistics yet</p>
        <p className="mt-2 text-sm text-slate-500">Log your first entry to unlock detailed statistics.</p>
      </div>
    )
  }

  const highestProtein = extremeDay(list, 'protein', 'max')
  const highestCalories = extremeDay(list, 'calories', 'max')
  const lowestCalories = extremeDay(list, 'calories', 'min')
  const highestFat = extremeDay(list, 'fat', 'max')
  const highestCarbs = extremeDay(list, 'carbs', 'max')
  const lowestCarbs = extremeDay(list, 'carbs', 'min')

  const weeklyWeightLoss =
    withWeight.length >= 2
      ? round((withWeight[0].weight! - withWeight[withWeight.length - 1].weight!) / Math.max(1, weekly.length), 2)
      : null

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-lg font-semibold text-slate-100">Statistics</h1>
        <Button variant="secondary" onClick={() => downloadFullStatsReport(entries, settings)}>
          <Download size={14} /> Download Full Report
        </Button>
      </div>

      <section>
        <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-slate-500">Extreme Days</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <ExtremeCard label="Highest Protein Day" entry={highestProtein} field="protein" unit="g" accent="violet" />
          <ExtremeCard label="Highest Calories Day" entry={highestCalories} field="calories" unit="kcal" accent="coral" />
          <ExtremeCard label="Lowest Calories Day" entry={lowestCalories} field="calories" unit="kcal" accent="green" />
          <ExtremeCard label="Highest Fat Day" entry={highestFat} field="fat" unit="g" accent="amber" />
          <ExtremeCard label="Highest Carbs Day" entry={highestCarbs} field="carbs" unit="g" accent="teal" />
          <ExtremeCard label="Lowest Carbs Day" entry={lowestCarbs} field="carbs" unit="g" accent="green" />
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-slate-500">Averages & Streaks</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Average Calories" value={summary.avgCalories} unit="kcal" accent="coral" />
          <StatCard label="Average Protein" value={summary.avgProtein} unit="g" accent="violet" />
          <StatCard label="Average Carbs" value={summary.avgCarbs} unit="g" accent="teal" />
          <StatCard label="Average Fat" value={summary.avgFat} unit="g" accent="amber" />
          <StatCard label="Current Tracking Streak" value={current} unit="days" accent="blue" />
          <StatCard label="Longest Tracking Streak" value={longest} unit="days" accent="green" icon={<Award size={16} />} />
          <StatCard label="Days Under Calorie Goal" value={summary.under1500} accent="green" />
          <StatCard label="Days Above Calorie Goal" value={summary.above1500} accent="red" />
          <StatCard label="Days Under Carb Limit" value={summary.underCarb} accent="green" />
          <StatCard label="Days Above Carb Limit" value={summary.aboveCarb} accent="red" />
          <StatCard label="Protein Goal Completion" value={summary.proteinGoalPct} unit="%" accent="violet" />
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-slate-500">Weight Tracking</h2>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <GlassCard glow="teal" className="flex flex-col items-center justify-center">
            <ProgressRing progress={goalProgress} label={`${goalProgress}%`} sublabel="To Goal" size={130} />
          </GlassCard>
          <div className="grid grid-cols-2 gap-4 lg:col-span-2">
            <StatCard label="Starting Weight" value={startWeight ?? '—'} unit="kg" accent="violet" />
            <StatCard label="Current Weight" value={currentWeight ?? '—'} unit="kg" accent="teal" />
            <StatCard label="Lowest Weight" value={lowestWeight ?? '—'} unit="kg" accent="green" icon={<TrendingDown size={16} />} />
            <StatCard label="Highest Weight" value={highestWeight ?? '—'} unit="kg" accent="coral" icon={<TrendingUp size={16} />} />
            <StatCard label="BMI" value={bmi || '—'} sub={bmiCategory(bmi)} accent="amber" icon={<Ruler size={16} />} />
            <StatCard label="Goal Weight" value={settings.goalWeightKg} unit="kg" accent="blue" icon={<Target size={16} />} />
            <StatCard label="Weight Remaining" value={weightRemaining ?? '—'} unit="kg" accent="violet" />
            <StatCard
              label="Projected Goal Date"
              value={projection.date ? formatShort(projection.date) : '—'}
              sub={projection.weeklyRate ? `${projection.weeklyRate} kg/wk` : undefined}
              accent="teal"
              icon={<CalendarClock size={16} />}
            />
            <StatCard
              label="Vs. Yesterday"
              value={diffFromYesterday != null ? `${diffFromYesterday > 0 ? '+' : ''}${diffFromYesterday}` : '—'}
              unit="kg"
              accent={diffFromYesterday != null && diffFromYesterday <= 0 ? 'green' : 'red'}
            />
            <StatCard
              label="Vs. Last Week"
              value={diffFromLastWeek != null ? `${diffFromLastWeek > 0 ? '+' : ''}${diffFromLastWeek}` : '—'}
              unit="kg"
              accent={diffFromLastWeek != null && diffFromLastWeek <= 0 ? 'green' : 'red'}
            />
          </div>
        </div>
        {weeklyWeightLoss != null && (
          <p className="mt-3 text-xs text-slate-500">
            Average weekly weight change: <span className="font-mono text-slate-300">{weeklyWeightLoss} kg/wk</span>
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-slate-500">Weekly Summary</h2>
        <SummaryTable rows={weekly.map((w) => [w.label, w.calories, w.protein, w.carbs, w.fat])} />
      </section>

      <section>
        <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-slate-500">Monthly Summary</h2>
        <SummaryTable rows={monthly.map((m) => [m.label, m.calories, m.protein, m.carbs, m.fat])} />
      </section>
    </div>
  )
}

function ExtremeCard({
  label,
  entry,
  field,
  unit,
  accent,
}: {
  label: string
  entry: ReturnType<typeof extremeDay>
  field: 'calories' | 'protein' | 'carbs' | 'fat'
  unit: string
  accent: 'teal' | 'violet' | 'coral' | 'amber' | 'green' | 'red' | 'blue'
}) {
  return (
    <StatCard
      label={label}
      value={entry ? `${entry[field]}` : '—'}
      unit={entry ? unit : undefined}
      sub={entry ? formatShort(entry.date) : undefined}
      accent={accent}
    />
  )
}

function SummaryTable({ rows }: { rows: (string | number)[][] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-slate-500">Not enough data yet.</p>
  }
  return (
    <GlassCard className="overflow-x-auto p-0">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/8 text-[11px] uppercase tracking-wider text-slate-500">
            <th className="px-4 py-3">Period</th>
            <th className="px-4 py-3">Avg Cal</th>
            <th className="px-4 py-3">Avg Protein</th>
            <th className="px-4 py-3">Avg Carbs</th>
            <th className="px-4 py-3">Avg Fat</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={String(r[0])} className="border-b border-white/5 font-mono text-slate-300 last:border-0">
              <td className="px-4 py-2.5 font-body text-slate-200">{r[0]}</td>
              <td className="px-4 py-2.5">{r[1]}</td>
              <td className="px-4 py-2.5">{r[2]}</td>
              <td className="px-4 py-2.5">{r[3]}</td>
              <td className="px-4 py-2.5">{r[4]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </GlassCard>
  )
}
